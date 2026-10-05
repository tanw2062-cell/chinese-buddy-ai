<script setup lang="ts">
useHead({ title: 'DevUICraft — Premium Tailwind Components' })

const config = useRuntimeConfig()
const checkoutUrl = computed(() => String(config.public.creemCheckoutUrl || '#pricing'))
const { data } = await useFetch('/api/auth/me')
const user = computed(() => data.value?.user || null)

type GalleryItem = {
  id: string
  name: string
  blurb: string
  premium: boolean
  code: string
}

const items: GalleryItem[] = [
  {
    id: 'shine-button',
    name: 'Neon Shine Button',
    blurb: 'Hover to send a light sweep across a gradient CTA.',
    premium: false,
    code: `<button class="relative overflow-hidden rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 px-6 py-3 font-semibold text-slate-950">
  <span class="relative z-10">Launch Build</span>
  <span class="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent transition hover:translate-x-full" />
</button>`
  },
  {
    id: 'flip-card',
    name: '3D Flip Card',
    blurb: 'Rotate the card in 3D to reveal stats on the back.',
    premium: true,
    code: `<div class="group h-40 w-64 [perspective:900px]">
  <div class="relative h-full w-full transition duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
    <div class="absolute inset-0 rounded-2xl border border-cyan-400/40 bg-zinc-900 p-4 [backface-visibility:hidden]">Front</div>
    <div class="absolute inset-0 rounded-2xl border border-violet-400/40 bg-slate-900 p-4 [transform:rotateY(180deg)] [backface-visibility:hidden]">Back</div>
  </div>
</div>`
  },
  {
    id: 'glass-nav',
    name: 'Frosted Glass Navbar',
    blurb: 'Translucent bar with neon hairline border.',
    premium: true,
    code: `<nav class="flex items-center justify-between rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-xl">
  <span class="font-semibold text-cyan-200">DevUICraft</span>
  <div class="flex gap-4 text-sm text-slate-200">
    <a href="#gallery">Docs</a>
    <a href="#pricing">Pricing</a>
  </div>
</nav>`
  },
  {
    id: 'orbit-badge',
    name: 'Orbit Status Badge',
    blurb: 'Pulsing ring around a live-status chip.',
    premium: true,
    code: `<span class="relative inline-flex items-center gap-2 rounded-full border border-violet-400/40 bg-zinc-900 px-3 py-1 text-xs text-cyan-100">
  <span class="relative flex h-2 w-2">
    <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-60" />
    <span class="relative inline-flex h-2 w-2 rounded-full bg-violet-400" />
  </span>
  API healthy
</span>`
  }
]

const modal = ref<'login' | 'premium' | 'copied' | null>(null)
const previewId = ref(items[0].id)
const previewItem = computed(() => items.find(item => item.id === previewId.value) || items[0])

const scrollTo = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const copyCode = async (item: GalleryItem) => {
  if (!user.value) {
    modal.value = 'login'
    return
  }
  if (item.premium && !user.value.is_premium) {
    modal.value = 'premium'
    return
  }
  await navigator.clipboard.writeText(item.code)
  modal.value = 'copied'
}

const startGoogle = () => {
  window.location.assign('/api/auth/google')
}

onMounted(() => {
  if (window.location.hash === '#pricing') {
    scrollTo('pricing')
  }
  if (window.location.hash === '#gallery') {
    scrollTo('gallery')
  }
})
</script>

<template>
  <div>
    <section class="pb-16">
      <p class="text-xs uppercase tracking-[0.28em] text-cyan-300/90">DevUICraft</p>
      <h1 class="mt-4 max-w-4xl text-4xl font-semibold leading-tight text-white md:text-5xl">
        Copy-and-Paste Premium Tailwind Components with Stunning Animations
      </h1>
      <p class="mt-4 max-w-2xl text-slate-300">
        Production-ready Vue 3 + Tailwind snippets for indie developers. Preview live, then copy source.
        Premium Membership is $9.90 / month.
      </p>
      <button
        type="button"
        class="mt-7 rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950"
        @click="scrollTo('gallery')"
      >
        Browse Components
      </button>
    </section>

    <section id="gallery" class="scroll-mt-24 space-y-8 pb-16">
      <h2 class="text-2xl font-semibold text-white">Component Gallery</h2>
      <div class="grid gap-6 md:grid-cols-2">
        <article
          v-for="item in items"
          :key="item.id"
          class="rounded-3xl border border-cyan-400/20 bg-zinc-900/60 p-5 shadow-[0_0_40px_rgba(34,211,238,0.08)]"
        >
          <div class="mb-3 flex items-center justify-between gap-2">
            <h3 class="font-semibold text-white">{{ item.name }}</h3>
            <span
              class="rounded-full px-2 py-0.5 text-[11px]"
              :class="item.premium ? 'bg-violet-500/20 text-violet-200' : 'bg-cyan-500/20 text-cyan-200'"
            >
              {{ item.premium ? 'Premium' : 'Free' }}
            </span>
          </div>
          <p class="mb-4 text-sm text-slate-400">{{ item.blurb }}</p>

          <div class="mb-4 flex min-h-[10rem] items-center justify-center rounded-2xl border border-white/10 bg-slate-950/80 p-6">
            <button
              v-if="item.id === 'shine-button'"
              type="button"
              class="shine-btn rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 px-6 py-3 font-semibold text-slate-950"
            >
              Launch Build
            </button>
            <div v-else-if="item.id === 'flip-card'" class="flip-scene h-36 w-56">
              <div class="flip-card relative h-full w-full">
                <div class="flip-face absolute inset-0 flex items-center justify-center rounded-2xl border border-cyan-400/40 bg-zinc-900">
                  Dashboard
                </div>
                <div class="flip-face flip-back absolute inset-0 flex items-center justify-center rounded-2xl border border-violet-400/40 bg-slate-900">
                  99.9% uptime
                </div>
              </div>
            </div>
            <nav
              v-else-if="item.id === 'glass-nav'"
              class="flex w-full items-center justify-between rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-xl"
            >
              <span class="font-semibold text-cyan-200">DevUICraft</span>
              <span class="text-sm text-slate-200">Docs · Pricing</span>
            </nav>
            <span
              v-else
              class="relative inline-flex items-center gap-2 rounded-full border border-violet-400/40 bg-zinc-900 px-3 py-1 text-xs text-cyan-100"
            >
              <span class="relative flex h-2 w-2">
                <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-60" />
                <span class="relative inline-flex h-2 w-2 rounded-full bg-violet-400" />
              </span>
              API healthy
            </span>
          </div>

          <div class="flex gap-2">
            <button
              type="button"
              class="rounded-full border border-white/20 px-4 py-2 text-xs text-white"
              @click="previewId = item.id"
            >
              Preview
            </button>
            <button
              type="button"
              class="rounded-full bg-violet-600 px-4 py-2 text-xs font-semibold text-white"
              @click="copyCode(item)"
            >
              Copy Code
            </button>
          </div>
        </article>
      </div>
      <p class="text-sm text-slate-400">Active preview: {{ previewItem.name }}</p>
    </section>

    <section id="pricing" class="scroll-mt-24 pb-8">
      <div class="mx-auto max-w-lg rounded-3xl border border-violet-400/30 bg-zinc-900/70 p-8 text-center">
        <p class="text-xs uppercase tracking-[0.2em] text-cyan-300">Membership</p>
        <h2 class="mt-2 text-2xl font-semibold text-white">Premium Membership</h2>
        <p class="mt-3 text-4xl font-semibold text-cyan-200">$9.90 <span class="text-base text-slate-400">/ month</span></p>
        <ul class="mt-5 space-y-2 text-left text-sm text-slate-300">
          <li>Copy Vue 3 / Tailwind source for every animated component</li>
          <li>New snippets added monthly</li>
          <li>Cancel anytime before the next billing date</li>
        </ul>
        <a
          :href="checkoutUrl"
          class="mt-6 inline-flex rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950"
        >
          Upgrade to Premium
        </a>
      </div>
    </section>

    <div
      v-if="modal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4"
      @click.self="modal = null"
    >
      <div class="w-full max-w-md rounded-2xl border border-cyan-400/30 bg-zinc-900 p-6">
        <template v-if="modal === 'login'">
          <h3 class="text-lg font-semibold text-white">Sign in to copy code</h3>
          <p class="mt-2 text-sm text-slate-300">Create a free DevUICraft account with Google to copy snippets.</p>
          <button type="button" class="mt-4 rounded-full bg-violet-600 px-4 py-2 text-sm text-white" @click="startGoogle">
            Continue with Google
          </button>
        </template>
        <template v-else-if="modal === 'premium'">
          <h3 class="text-lg font-semibold text-white">Premium component</h3>
          <p class="mt-2 text-sm text-slate-300">
            This is a Premium Component. Upgrade to Premium ($9.90/mo) to unlock full Vue 3 / Tailwind source code!
          </p>
          <a :href="checkoutUrl" class="mt-4 inline-flex rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950">
            Upgrade with Creem
          </a>
        </template>
        <template v-else>
          <h3 class="text-lg font-semibold text-white">Copied</h3>
          <p class="mt-2 text-sm text-slate-300">Source is on your clipboard.</p>
        </template>
        <button type="button" class="mt-4 text-xs text-slate-400" @click="modal = null">Close</button>
      </div>
    </div>
  </div>
</template>
