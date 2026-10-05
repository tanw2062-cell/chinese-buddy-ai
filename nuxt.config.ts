export default defineNuxtConfig({
  compatibilityDate: '2025-10-03',
  ssr: true,
  modules: ['@nuxt/ui'],
  css: ['~/assets/css/main.css'],
  tailwindcss: {
    cssPath: '~/assets/css/main.css',
    configPath: 'tailwind.config.ts'
  },
  colorMode: {
    preference: 'dark',
    fallback: 'dark',
    classSuffix: '',
    storageKey: 'companion-color-mode'
  },
  app: {
    head: {
      title: 'ChineseBuddy AI — 24/7 Mandarin Speaking Partner',
      htmlAttrs: { lang: 'en', class: 'dark' },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'theme-color', content: '#1c0a0a' },
        {
          name: 'description',
          content: 'Practice real-life Mandarin with AI tutors: immersive conversation, grammar and pinyin support, and authentic cultural buddies. Premium from $9.90/month.'
        }
      ]
    }
  },
  ui: {
    icons: ['heroicons']
  },
  runtimeConfig: {
    openrouterApiKey: process.env.OPENROUTER_API_KEY || '',
    googleClientId: process.env.GOOGLE_CLIENT_ID || '',
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    googleRedirectUri: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3001/api/auth/google/callback',
    googleHttpsProxy: process.env.GOOGLE_HTTPS_PROXY || process.env.HTTPS_PROXY || '',
    supabaseUrl: process.env.SUPABASE_URL || '',
    supabaseKey: process.env.SUPABASE_KEY || ''
  }
})
