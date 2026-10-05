<script setup lang="ts">
useHead({ title: 'Privacy Policy — ChineseBuddy AI' })
</script>

<template>
  <article class="mx-auto max-w-3xl space-y-6 text-[15px] leading-7 text-slate-300">
    <h1 class="text-3xl font-semibold text-white">Privacy Policy</h1>
    <p class="text-sm text-slate-400">Last updated: October 5, 2026</p>
    <p>
      This Privacy Policy explains how ChineseBuddy AI (“we”, “us”) collects, uses, and stores information when
      you use our Mandarin speaking-practice website at https://chinese-buddy-ai.vercel.app.
    </p>

    <h2 class="pt-2 text-xl font-semibold text-white">1. Information we collect</h2>
    <p>
      <strong class="text-white">Google OAuth account data.</strong>
      When you sign in with Google, we receive your Google account ID, email address, display name, and profile
      photo. We store these in our users database so we can keep you logged in, show your name in the practice
      room, and protect your account. We do not post to Google on your behalf and we do not request Gmail or Drive
      access.
    </p>
    <p>
      <strong class="text-white">Practice messages.</strong>
      Chat text you send to tutors is processed by our language-model provider so the tutor can reply with
      Mandarin, pinyin, and corrections. Do not send passwords, payment card numbers, government IDs, or other
      sensitive personal data in practice chats.
    </p>
    <p>
      <strong class="text-white">Technical logs.</strong>
      Our hosting provider may process IP address, browser type, and request timestamps to keep the site secure
      and available.
    </p>

    <h2 class="pt-2 text-xl font-semibold text-white">2. How we use information</h2>
    <ul class="list-disc space-y-2 pl-5">
      <li>Authenticate you and maintain a signed session cookie after Google login.</li>
      <li>Deliver AI tutoring, grammar notes, and membership features you request.</li>
      <li>Prevent abuse, debug outages, and comply with law enforcement requests we are legally required to honor.</li>
    </ul>
    <p>We do not sell your personal information. We do not use practice chats to train a public advertising profile.</p>

    <h2 class="pt-2 text-xl font-semibold text-white">3. Cookies and sessions</h2>
    <p>
      After a successful Google login we set a signed, HTTP-only session cookie. It identifies your ChineseBuddy
      user id. You can sign out at any time, which clears the cookie. Essential cookies are required for login to
      work.
    </p>

    <h2 class="pt-2 text-xl font-semibold text-white">4. Processors</h2>
    <p>
      We use infrastructure providers to host the site, store account records (including Google profile fields),
      and generate tutor replies. Those processors only receive data needed to perform their function.
    </p>

    <h2 class="pt-2 text-xl font-semibold text-white">5. Retention and your rights</h2>
    <p>
      We keep account records while your account is active. You may request access, correction, or deletion of
      your account data by emailing us. We will respond within a reasonable time, subject to legal retention
      duties. If you revoke Google access, you should also sign out of ChineseBuddy.
    </p>

    <h2 class="pt-2 text-xl font-semibold text-white">6. Children</h2>
    <p>
      ChineseBuddy is designed for adult learners. We do not knowingly collect personal information from children
      under 13. If you believe a child has created an account, contact us and we will delete it.
    </p>

    <h2 class="pt-2 text-xl font-semibold text-white">7. Contact</h2>
    <p>
      Privacy requests: <span class="text-amber-200">privacy@chinesebuddy.ai</span>
    </p>
    <p>
      See also our
      <NuxtLink to="/terms" class="text-amber-200 underline">Terms of Service</NuxtLink>
      and
      <NuxtLink to="/refund" class="text-amber-200 underline">Refund Policy</NuxtLink>.
    </p>
  </article>
</template>
