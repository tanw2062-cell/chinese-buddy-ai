const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'
const OPENROUTER_MODEL =
  process.env.OPENROUTER_MODEL || 'nvidia/nemotron-3-ultra-550b-a55b:free'

type ChatRole = 'system' | 'user' | 'assistant'
type CharacterId = 'teacher-li' | 'buddy-wang' | 'pro-master'

interface ChatMessage {
  role: ChatRole
  content: string
}

interface ChatRequestBody {
  characterId?: string
  messages?: ChatMessage[]
}

const CHARACTER_ALIASES: Record<string, CharacterId> = {
  'teacher-li': 'teacher-li',
  'buddy-wang': 'buddy-wang',
  'pro-master': 'pro-master',
  aurora: 'teacher-li',
  momo: 'buddy-wang',
  nino: 'teacher-li',
  kira: 'pro-master',
  gentle: 'teacher-li',
  tsundere: 'buddy-wang',
  'game-buddy': 'pro-master'
}

const SYSTEM_PROMPTS: Record<CharacterId, string> = {
  'teacher-li': `You are 李老师 (Teacher Li), a patient Mandarin private tutor for overseas beginners.
Speak slowly with short sentences. Mix simple Chinese with brief English glosses, e.g. "你好 (nǐ hǎo) — hello".
Correct grammar and pinyin kindly, then give one easier rewrite the student can repeat.
Stay educational: no romance, no late-night girlfriend roleplay, no flirting.
If the student is stuck, offer a fill-in-the-blank. Keep replies under 120 words unless they ask for more.`,
  'buddy-wang': `You are 老王 (Lao Wang), a Beijing cultural buddy who helps learners speak everyday Mandarin.
Use natural spoken Chinese, light slang, and short English when needed. Share food, games, cities, and internet culture as language practice, not nightlife romance.
After slang, add pinyin and a plain meaning. Invite the student to try a sentence back.
Stay friendly and platonic. No virtual-girlfriend tone, no seduction, no late-night emotional partner framing.`,
  'pro-master': `You are 商务教练 (Career Coach), a rigorous workplace Mandarin and HSK coach.
Focus on business dialogues, meeting phrases, email Chinese, pronunciation, and HSK sprint drills.
Give a model line, pinyin, then a correction of the student's attempt. Tone is professional and encouraging.
No romance, no companion/girlfriend persona. Stay inside language training.`
}

const resolveCharacterId = (raw?: string): CharacterId => {
  if (!raw) {
    return 'teacher-li'
  }
  return CHARACTER_ALIASES[raw] ?? 'teacher-li'
}

const sanitizeMessages = (messages: ChatMessage[] = []): ChatMessage[] => {
  return messages
    .filter(item => item && typeof item.content === 'string' && item.content.trim())
    .filter(item => item.role === 'user' || item.role === 'assistant')
    .map(item => ({
      role: item.role,
      content: item.content.trim()
    }))
    .slice(-24)
}

export default defineEventHandler(async (event) => {
  assertMethod(event, 'POST')

  const apiKey = useRuntimeConfig(event).openrouterApiKey || process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Missing OPENROUTER_API_KEY'
    })
  }

  const body = await readBody<ChatRequestBody>(event)
  const history = sanitizeMessages(body?.messages)
  if (!history.length) {
    throw createError({
      statusCode: 400,
      statusMessage: 'messages required'
    })
  }

  const characterId = resolveCharacterId(body?.characterId)
  const payload = {
    model: OPENROUTER_MODEL,
    stream: true,
    messages: [
      { role: 'system' as const, content: SYSTEM_PROMPTS[characterId] },
      ...history
    ]
  }

  const abort = new AbortController()
  const req = event.node.req
  const onClose = () => abort.abort()
  req.once('close', onClose)

  let upstream: Response
  try {
    upstream = await fetch(OPENROUTER_URL, {
      method: 'POST',
      signal: abort.signal,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': getRequestURL(event).origin,
        'X-OpenRouter-Title': 'ChineseBuddy AI'
      },
      body: JSON.stringify(payload)
    })
  } catch (error) {
    req.off('close', onClose)
    if (abort.signal.aborted) {
      return
    }
    throw createError({
      statusCode: 502,
      statusMessage: 'OpenRouter connection failed',
      message: error instanceof Error ? error.message : 'OpenRouter 连接失败'
    })
  }

  if (!upstream.ok || !upstream.body) {
    req.off('close', onClose)
    const detail = await upstream.text().catch(() => '')
    throw createError({
      statusCode: upstream.status || 502,
      statusMessage: detail && /^[\x00-\xFF]*$/.test(detail) ? detail.slice(0, 180) : 'OpenRouter error'
    })
  }

  setResponseStatus(event, 200)
  setResponseHeaders(event, {
    'Content-Type': 'text/event-stream; charset=utf-8',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no'
  })

  const stream = upstream.body.pipeThrough(
    new TransformStream({
      flush() {
        req.off('close', onClose)
      }
    })
  )

  return sendStream(event, stream)
})
