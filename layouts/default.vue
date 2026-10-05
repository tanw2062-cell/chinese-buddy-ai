<script setup lang="ts">
const onPricingClick = async () => {
  if (useRoute().path !== '/') {
    await navigateTo('/#pricing')
    await nextTick()
  }
  document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const onBrowseClick = async () => {
  if (useRoute().path !== '/') {
    await navigateTo('/#gallery')
    await nextTick()
  }
  document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<template>
  <div class="min-h-dvh bg-slate-950 text-slate-100">
    <header class="border-b border-cyan-400/20 bg-zinc-950/80 backdrop-blur-xl">
      <div class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <NuxtLink to="/" class="flex items-center gap-2">
          <span class="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-cyan-400 text-sm font-bold text-slate-950">UI</span>
          <span class="gradient-text text-lg font-semibold tracking-tight">DevUICraft</span>
        </NuxtLink>
        <nav class="hidden items-center gap-6 text-sm text-slate-300 md:flex">
          <a href="/#gallery" class="hover:text-cyan-200" @click.prevent="onBrowseClick">Components</a>
          <a href="/#pricing" class="hover:text-cyan-200" @click.prevent="onPricingClick">Pricing</a>
        </nav>
        <AuthBar />
      </div>
    </header>
    <main class="mx-auto max-w-6xl px-4 py-10">
      <slot />
    </main>
    <footer class="border-t border-cyan-400/20 px-4 py-8 text-sm text-slate-400">
      <div class="mx-auto flex max-w-6xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p>© 2026 DevUICraft. All rights reserved. support@devuicraft.com</p>
        <div class="flex flex-wrap gap-4">
          <NuxtLink to="/terms" class="hover:text-cyan-200">Terms of Service</NuxtLink>
          <NuxtLink to="/privacy" class="hover:text-cyan-200">Privacy Policy</NuxtLink>
          <NuxtLink to="/refund" class="hover:text-cyan-200">Refund Policy</NuxtLink>
        </div>
      </div>
    </footer>
  </div>
</template>
