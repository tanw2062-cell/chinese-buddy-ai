<template>
  <div class="relative min-h-dvh bg-ink-950 text-slate-100">
    <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(220,38,38,0.18),transparent_45%)]" />

    <div class="relative hidden h-dvh md:flex">
      <aside class="flex w-80 shrink-0 flex-col gap-4 border-r border-white/10 bg-[#2a1010]/80 p-4 backdrop-blur-xl">
        <div>
          <NuxtLink to="/" class="gradient-text text-xl font-semibold">ChineseBuddy</NuxtLink>
          <p class="mt-1 text-xs text-slate-400">24/7 Mandarin speaking practice</p>
          <div class="mt-3">
            <AuthBar />
          </div>
        </div>
        <CompanionStaminaBar />
        <CompanionCharacterList />
      </aside>
      <main class="min-w-0 flex-1 bg-ink-950/40">
        <ChatPanel />
      </main>
    </div>

    <div class="relative flex h-dvh flex-col md:hidden">
      <header class="border-b border-white/10 px-4 py-3">
        <div class="flex items-center justify-between gap-3">
          <NuxtLink to="/" class="gradient-text text-lg font-semibold">ChineseBuddy</NuxtLink>
          <AuthBar />
        </div>
      </header>
      <div class="min-h-0 flex-1 overflow-hidden pb-20">
        <slot />
      </div>
      <CompanionMobileTabbar />
    </div>
  </div>
</template>
