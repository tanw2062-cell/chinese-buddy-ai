<script setup lang="ts">
const { data, refresh } = await useFetch('/api/auth/me')
const user = computed(() => data.value?.user || null)

const logout = async () => {
  await $fetch('/api/auth/logout', { method: 'POST' })
  await refresh()
}
</script>

<template>
  <div class="flex items-center gap-2">
    <template v-if="user">
      <img
        v-if="user.avatar"
        :src="user.avatar"
        :alt="user.name || user.email"
        class="h-8 w-8 rounded-full border border-white/20"
      >
      <p class="min-w-0 truncate text-xs text-slate-300">{{ user.name || user.email }}</p>
      <UButton size="xs" color="gray" variant="ghost" @click="logout">Sign out</UButton>
    </template>
    <a
      v-else
      href="/api/auth/google"
      class="inline-flex items-center rounded-md bg-fuchsia-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-fuchsia-500"
    >
      Google sign-in
    </a>
  </div>
</template>
