<script setup lang="ts">
const route = useRoute()
const tabs = [
  { to: '/discover', label: 'Tutors', icon: 'i-heroicons-academic-cap' },
  { to: '/practice', label: 'Practice', icon: 'i-heroicons-chat-bubble-left-right' }
]
</script>

<template>
  <nav
    class="tabbar-safe fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-night-900/90 px-4 pt-2 backdrop-blur-xl md:hidden"
  >
    <ul class="mx-auto grid max-w-md grid-cols-2 gap-2">
      <li v-for="tab in tabs" :key="tab.to">
        <NuxtLink
          :to="tab.to"
          class="flex flex-col items-center rounded-2xl py-2 text-xs transition"
          :class="route.path === tab.to ? 'bg-fuchsia-500/20 text-fuchsia-200' : 'text-slate-400'"
        >
          <UIcon :name="tab.icon" class="h-5 w-5" />
          <span class="mt-1">{{ tab.label }}</span>
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>
