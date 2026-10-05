<script setup lang="ts">
const { companions, activeId, selectCompanion } = useCompanion()
const route = useRoute()

const onSelect = async (id: string) => {
  selectCompanion(id)
  if (route.path !== '/practice' && window.matchMedia('(max-width: 767px)').matches) {
    await navigateTo('/practice')
  }
}
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <div class="mb-3 flex items-end justify-between px-1">
      <div>
        <p class="text-[11px] uppercase tracking-[0.2em] text-amber-300/80">Tutors</p>
        <h2 class="text-lg font-semibold text-white">Tutors</h2>
      </div>
      <UBadge color="fuchsia" variant="subtle" size="xs">在线可聊</UBadge>
    </div>

    <ul class="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
      <li v-for="item in companions" :key="item.id">
        <button
          type="button"
          class="w-full rounded-2xl border p-3 text-left transition"
          :class="
            activeId === item.id
              ? 'border-fuchsia-400/50 bg-fuchsia-500/15 shadow-glow'
              : 'border-white/5 bg-white/[0.03] hover:border-white/15 hover:bg-white/[0.06]'
          "
          @click="onSelect(item.id)"
        >
          <div class="flex items-center gap-3">
            <div
              class="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br text-sm font-semibold text-night-950"
              :class="item.accent"
            >
              {{ item.name.slice(0, 1) }}
            </div>
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2">
                <p class="truncate font-medium text-white">{{ item.name }}</p>
                <span
                  class="h-2 w-2 rounded-full"
                  :class="item.online ? 'bg-emerald-400 shadow-glow-cyan' : 'bg-slate-500'"
                />
              </div>
              <p class="truncate text-xs text-slate-400">{{ item.title }} · {{ item.mood }}</p>
            </div>
          </div>
          <div class="mt-2 flex flex-wrap gap-1">
            <UBadge v-for="tag in item.tags" :key="tag" size="xs" color="gray" variant="subtle">
              {{ tag }}
            </UBadge>
          </div>
        </button>
      </li>
    </ul>
  </div>
</template>
