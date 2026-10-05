<template>
  <div class="min-h-dvh bg-ink-950 text-slate-100">
    <header class="border-b border-white/10 bg-[#1c0a0a]/80 backdrop-blur-xl">
      <div class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <NuxtLink to="/" class="flex items-center gap-2">
          <span class="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-red-600 text-sm font-bold text-red-950">汉</span>
          <span class="text-lg font-semibold tracking-tight">ChineseBuddy AI</span>
        </NuxtLink>
        <nav class="hidden items-center gap-6 text-sm text-slate-300 md:flex">
          <NuxtLink to="/#features">Features</NuxtLink>
          <NuxtLink to="/#pricing">Pricing</NuxtLink>
          <NuxtLink to="/practice">Practice</NuxtLink>
        </nav>
        <div class="flex items-center gap-3">
          <AuthBar />
        </div>
      </div>
    </header>
    <main class="mx-auto max-w-6xl px-4 py-10">
      <slot />
    </main>
    <footer class="border-t border-white/10 px-4 py-8 text-sm text-slate-400">
      <div class="mx-auto flex max-w-6xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p>© 2026 ChineseBuddy AI. All rights reserved.</p>
        <div class="flex flex-wrap gap-4">
          <NuxtLink to="/terms" class="hover:text-amber-200">Terms of Service</NuxtLink>
          <NuxtLink to="/privacy" class="hover:text-amber-200">Privacy Policy</NuxtLink>
          <NuxtLink to="/refund" class="hover:text-amber-200">Refund Policy</NuxtLink>
        </div>
      </div>
    </footer>
  </div>
</template>
