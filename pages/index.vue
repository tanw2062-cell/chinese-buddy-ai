<script setup lang="ts">
useHead({ title: 'ChineseBuddy AI — Master Real-Life Chinese' })
</script>

<template>
  <div>
    <section class="grid gap-10 pb-16 md:grid-cols-2 md:items-center">
      <div>
        <p class="text-xs uppercase tracking-[0.28em] text-amber-300/90">ChineseBuddy AI</p>
        <h1 class="mt-3 text-4xl font-semibold leading-tight text-white md:text-5xl">
          Master Real-Life Chinese with Your 24/7 AI Speaking Partner
        </h1>
        <p class="mt-4 max-w-xl text-slate-300">
          Talk with patient tutors, Beijing-style culture buddies, and a career Mandarin coach.
          Get grammar notes, pinyin, and corrections in every session.
        </p>
        <div class="mt-7 flex flex-wrap gap-3">
          <NuxtLink
            to="/practice"
            class="rounded-full bg-gradient-to-r from-amber-300 to-red-500 px-6 py-3 text-sm font-semibold text-red-950"
          >
            Start Learning Free
          </NuxtLink>
          <NuxtLink to="/#pricing" class="rounded-full border border-white/20 px-6 py-3 text-sm text-white">
            View Premium
          </NuxtLink>
        </div>
      </div>
      <div class="glass-panel rounded-3xl p-6">
        <p class="text-sm text-amber-200">Live practice preview</p>
        <p class="mt-3 text-lg text-white">李老师：今天我们练“我想点一杯珍珠奶茶”。</p>
        <p class="mt-2 text-sm text-slate-300">wǒ xiǎng diǎn yì bēi zhēnzhū nǎichá — I would like a bubble tea.</p>
      </div>
    </section>

    <section id="features" class="grid gap-4 pb-16 md:grid-cols-3">
      <article class="glass-panel rounded-2xl p-5">
        <h2 class="text-lg font-semibold text-white">Immersive Conversations</h2>
        <p class="mt-2 text-sm text-slate-300">Role-play ordering food, commuting, and workplace small talk until it feels natural.</p>
      </article>
      <article class="glass-panel rounded-2xl p-5">
        <h2 class="text-lg font-semibold text-white">Grammar & Pinyin Support</h2>
        <p class="mt-2 text-sm text-slate-300">Every correction includes pinyin, a plain English gloss, and a sentence you can repeat.</p>
      </article>
      <article class="glass-panel rounded-2xl p-5">
        <h2 class="text-lg font-semibold text-white">Authentic Cultural Buddies</h2>
        <p class="mt-2 text-sm text-slate-300">Learn slang and etiquette from tutors modeled on real teaching styles, not romance chat.</p>
      </article>
    </section>

    <section id="pricing" class="pb-8">
      <div class="glass-panel mx-auto max-w-lg rounded-3xl p-8 text-center">
        <p class="text-xs uppercase tracking-[0.2em] text-amber-300">Membership</p>
        <h2 class="mt-2 text-2xl font-semibold text-white">Premium Membership</h2>
        <p class="mt-3 text-4xl font-semibold text-amber-200">$9.90 <span class="text-base text-slate-400">/ month</span></p>
        <ul class="mt-5 space-y-2 text-left text-sm text-slate-300">
          <li>Unlimited speaking practice with all three tutors</li>
          <li>Grammar, pinyin, and HSK-style drills</li>
          <li>Cancel anytime before the next billing date</li>
        </ul>
        <NuxtLink
          to="/practice"
          class="mt-6 inline-flex rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white"
        >
          Start Learning Free
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
