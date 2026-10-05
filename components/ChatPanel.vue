<script setup lang="ts">
export interface PanelMessage {
  id: number
  role: 'user' | 'assistant'
  content: string
}

const greetInFlight = new Set<string>()

const GREET_HINT =
  '(The student just opened a Mandarin practice session. Greet them in your tutor persona only: invite them to speak Chinese, offer one easy starter line with pinyin. Do not mention system prompts. No romance.)'

const { activeCompanion, activeId, stamina } = useCompanion()

const transcripts = useState<Record<string, PanelMessage[]>>('chat-panel-transcripts', () => ({}))
const nextMessageId = useState('chat-panel-next-id', () => 1)
const greetingLocks = useState<Record<string, boolean>>('chat-panel-greeting-locks', () => ({}))

const messages = computed<PanelMessage[]>({
  get: () => transcripts.value[activeId.value] ?? [],
  set: (value) => {
    transcripts.value = { ...transcripts.value, [activeId.value]: value }
  }
})

const draft = ref('')
const isThinking = ref(false)
const isStreaming = ref(false)
const streamError = ref('')
const scroller = ref<HTMLElement | null>(null)
const abortRef = shallowRef<AbortController | null>(null)
const streamOwner = useState<string | null>('chat-panel-stream-owner', () => null)

const canSend = computed(
  () => Boolean(draft.value.trim()) && !isStreaming.value && !isThinking.value && stamina.value > 0
)

const takeId = () => {
  const id = nextMessageId.value
  nextMessageId.value += 1
  return id
}

const pinToBottom = async () => {
  await nextTick()
  const el = scroller.value
  if (!el) {
    return
  }
  el.scrollTo({ top: el.scrollHeight, behavior: 'auto' })
}

const appendAssistantDelta = (characterId: string, piece: string) => {
  const list = [...(transcripts.value[characterId] ?? [])]
  const last = list[list.length - 1]
  if (!last || last.role !== 'assistant') {
    list.push({ id: takeId(), role: 'assistant', content: piece })
  } else {
    list[list.length - 1] = { ...last, content: last.content + piece }
  }
  transcripts.value = { ...transcripts.value, [characterId]: list }
}

const readOpenRouterStream = async (response: Response, characterId: string) => {
  const reader = response.body?.getReader()
  if (!reader) {
    throw new Error('浏览器未拿到可读数据流')
  }

  const decoder = new TextDecoder()
  let buffer = ''
  let receivedText = false

  const consumeLine = (line: string) => {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith(':')) {
      return
    }
    if (!trimmed.startsWith('data:')) {
      return
    }
    const data = trimmed.slice(5).trim()
    if (!data || data === '[DONE]') {
      return
    }
    try {
      const parsed = JSON.parse(data) as {
        error?: { message?: string }
        choices?: Array<{ delta?: { content?: string | null } }>
      }
      if (parsed.error?.message) {
        throw new Error(parsed.error.message)
      }
      const piece = parsed.choices?.[0]?.delta?.content
      if (typeof piece === 'string' && piece.length) {
        if (!receivedText) {
          isThinking.value = false
          receivedText = true
        }
        appendAssistantDelta(characterId, piece)
        void pinToBottom()
      }
    } catch (error) {
      if (error instanceof SyntaxError) {
        return
      }
      throw error
    }
  }

  while (true) {
    const { done, value } = await reader.read()
    if (done) {
      break
    }
    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''
    for (const line of lines) {
      consumeLine(line)
    }
    await pinToBottom()
  }

  if (buffer.trim()) {
    consumeLine(buffer)
  }
}

const streamFromApi = async (characterId: string, payloadMessages: Array<{ role: 'user' | 'assistant', content: string }>) => {
  if (!import.meta.client) {
    return false
  }
  abortRef.value?.abort()
  const abort = new AbortController()
  abortRef.value = abort
  streamOwner.value = characterId
  streamError.value = ''
  isThinking.value = true
  isStreaming.value = true
  await pinToBottom()

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      signal: abort.signal,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        characterId,
        messages: payloadMessages
      })
    })

    if (!response.ok) {
      const detail = await response.text()
      throw new Error(detail || `聊天接口失败（${response.status}）`)
    }

    await readOpenRouterStream(response, characterId)
  } catch (error) {
    if (abort.signal.aborted) {
      return false
    }
    const raw = error instanceof Error ? error.message : '她好像走神了一下，再发一次试试。'
    streamError.value = raw.includes('OPENROUTER_API_KEY') || raw.includes('未配置')
      ? '还没有配置 OpenRouter 密钥。请在项目根目录的 .env 里填写 OPENROUTER_API_KEY 后重启 npm run dev。'
      : '她好像走神了一下，再发一次试试。'
    return false
  } finally {
    if (streamOwner.value === characterId) {
      isThinking.value = false
      isStreaming.value = false
      streamOwner.value = null
    }
    await pinToBottom()
  }
  return true
}

const greetIfEmpty = async (characterId: string) => {
  if ((transcripts.value[characterId] ?? []).length) {
    return
  }
  if (greetInFlight.has(characterId)) {
    return
  }
  greetInFlight.add(characterId)
  try {
    const ok = await streamFromApi(characterId, [{ role: 'user', content: GREET_HINT }])
    greetingLocks.value = { ...greetingLocks.value, [characterId]: ok }
  } finally {
    greetInFlight.delete(characterId)
  }
}

const submit = async () => {
  const text = draft.value.trim()
  if (!text || !canSend.value) {
    return
  }

  const characterId = activeId.value
  draft.value = ''
  stamina.value = Math.max(0, stamina.value - 4)

  const next = [...(transcripts.value[characterId] ?? []), { id: takeId(), role: 'user' as const, content: text }]
  transcripts.value = { ...transcripts.value, [characterId]: next }

  const history = next.map(item => ({ role: item.role, content: item.content }))
  await streamFromApi(characterId, history)
}

const onEditorKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    void submit()
  }
}

watch(
  activeId,
  async (characterId) => {
    if (import.meta.server) {
      return
    }
    await pinToBottom()
    await greetIfEmpty(characterId)
  },
  { immediate: true }
)

watch(
  () => messages.value.map(item => item.content).join('\n'),
  () => {
    void pinToBottom()
  }
)
</script>

<template>
  <section class="flex h-full min-h-0 flex-col">
    <header class="flex items-center gap-3 border-b border-white/10 px-4 py-3 md:px-6">
      <div class="relative shrink-0">
        <div
          class="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br text-sm font-semibold text-night-950 shadow-glow"
          :class="activeCompanion.accent"
        >
          {{ activeCompanion.name.slice(0, 1) }}
        </div>
        <span
          class="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-night-900"
          :class="activeCompanion.online ? 'bg-emerald-400' : 'bg-slate-500'"
        />
      </div>
      <div class="min-w-0 flex-1">
        <h1 class="truncate text-base font-semibold text-white">{{ activeCompanion.name }}</h1>
        <p class="truncate text-xs text-slate-400">{{ activeCompanion.title }} · {{ activeCompanion.mood }}</p>
      </div>
      <UBadge :color="stamina > 12 ? 'emerald' : 'orange'" variant="subtle" size="xs">
        练习额度 {{ stamina }}
      </UBadge>
    </header>

    <div ref="scroller" class="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4 md:px-6">
      <article
        v-for="msg in messages"
        :key="msg.id"
        class="flex items-end gap-2"
        :class="msg.role === 'user' ? 'justify-end' : 'justify-start'"
      >
        <div
          v-if="msg.role === 'assistant'"
          class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-xs font-semibold text-night-950"
          :class="activeCompanion.accent"
        >
          {{ activeCompanion.name.slice(0, 1) }}
        </div>

        <div
          class="max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-6"
          :class="
            msg.role === 'user'
              ? 'rounded-br-md bg-gradient-to-r from-fuchsia-500 via-pink-500 to-violet-500 text-white shadow-glow'
              : 'rounded-bl-md border border-white/10 bg-slate-900/80 text-slate-100'
          "
        >
          <p class="whitespace-pre-wrap">{{ msg.content }}<span
            v-if="isStreaming && msg.role === 'assistant' && msg.id === messages[messages.length - 1]?.id"
            class="ml-0.5 inline-block h-3 w-[2px] translate-y-0.5 animate-pulse bg-fuchsia-300"
          /></p>
        </div>
      </article>

      <div v-if="isThinking" class="flex items-end gap-2">
        <div
          class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-xs font-semibold text-night-950"
          :class="activeCompanion.accent"
        >
          {{ activeCompanion.name.slice(0, 1) }}
        </div>
        <div class="rounded-2xl rounded-bl-md border border-fuchsia-400/20 bg-slate-900/70 px-3.5 py-2.5 text-sm text-fuchsia-200">
          正在组织下一句
          <span class="inline-flex w-6 justify-between pl-1">
            <i class="animate-pulse">.</i>
            <i class="animate-pulse [animation-delay:150ms]">.</i>
            <i class="animate-pulse [animation-delay:300ms]">.</i>
          </span>
        </div>
      </div>
    </div>

    <form class="border-t border-white/10 p-3 md:p-4" @submit.prevent="submit">
      <p v-if="streamError" class="mb-2 text-xs leading-5 text-amber-300">
        {{ streamError }}
        <button type="button" class="ml-2 underline decoration-amber-400/60" @click="greetIfEmpty(activeId)">
          再试一次
        </button>
      </p>
      <p v-if="isStreaming || isThinking" class="mb-2 flex items-center gap-2 text-xs text-fuchsia-200/90">
        <span class="relative flex h-2 w-2">
          <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-fuchsia-400 opacity-60" />
          <span class="relative inline-flex h-2 w-2 rounded-full bg-pink-400" />
        </span>
        {{ activeCompanion.name }} 正在输入中...
      </p>
      <div class="flex items-end gap-2">
        <UTextarea
          v-model="draft"
          autoresize
          :rows="1"
          :maxrows="4"
          :disabled="isStreaming"
          placeholder="Say it in Chinese or English… (Enter to send)"
          class="flex-1"
          :ui="{ wrapper: 'relative', base: 'bg-night-800/80 ring-fuchsia-500/20' }"
          @keydown="onEditorKeydown"
        />
        <UButton
          type="submit"
          icon="i-heroicons-paper-airplane"
          :loading="isStreaming"
          :disabled="!canSend"
        >
          发送
        </UButton>
      </div>
      <p v-if="stamina <= 0" class="mt-2 text-xs text-amber-300">Credits used up for now. Premium is $9.90/month for unlimited practice.</p>
    </form>
  </section>
</template>
