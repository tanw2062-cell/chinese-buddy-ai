<script setup lang="ts">
useHead({ title: 'Privacy Policy — DevUICraft' })
</script>

<template>
  <article class="mx-auto max-w-3xl space-y-6 text-[15px] leading-7 text-slate-300">
    <h1 class="text-3xl font-semibold text-white">Privacy Policy</h1>
    <p class="text-sm text-slate-400">Last updated: October 5, 2026</p>
    <p>
      DevUICraft collects only what we need to run a Tailwind component library and protect your account.
    </p>
    <h2 class="pt-2 text-xl font-semibold text-white">1. Google OAuth</h2>
    <p>
      When you sign in with Google we receive your Google account ID, email, display name, and profile photo.
      We store these in our users table so we can keep you logged in and check Premium status. We do not post
      to Google on your behalf.
    </p>
    <h2 class="pt-2 text-xl font-semibold text-white">2. Membership data</h2>
    <p>
      We store an <code class="text-cyan-200">is_premium</code> flag so Copy Code can unlock paid snippets after
      a successful Creem subscription. We do not sell personal data.
    </p>
    <h2 class="pt-2 text-xl font-semibold text-white">3. Cookies</h2>
    <p>
      A signed session cookie is set after Google login. Sign out to clear it.
    </p>
    <h2 class="pt-2 text-xl font-semibold text-white">4. Contact</h2>
    <p>privacy@devuicraft.com</p>
  </article>
</template>
