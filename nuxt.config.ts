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
      title: 'DevUICraft — Premium Tailwind Components with Animations',
      htmlAttrs: { lang: 'en', class: 'dark' },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'theme-color', content: '#020617' },
        {
          name: 'description',
          content: 'Copy-and-paste premium Tailwind CSS and Vue 3 components with production-ready animations. $9.90/month.'
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
    supabaseKey: process.env.SUPABASE_KEY || '',
    public: {
      creemCheckoutUrl: process.env.CREEM_CHECKOUT_URL || '#pricing'
    }
  }
})
