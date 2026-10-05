import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  darkMode: 'class',
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './composables/**/*.{js,ts}',
    './app.vue',
    './error.vue'
  ],
  theme: {
    extend: {
      colors: {
        night: {
          950: '#07040f',
          900: '#0b0614',
          800: '#140b22',
          700: '#1d1233'
        },
        ink: {
          950: '#140606',
          900: '#1c0a0a',
          800: '#2a1010'
        }
      },
      boxShadow: {
        glow: '0 0 32px rgba(232, 121, 249, 0.28)',
        'glow-cyan': '0 0 28px rgba(103, 232, 249, 0.22)'
      },
      backgroundImage: {
        'companion-mesh':
          'radial-gradient(1200px 600px at 10% -10%, rgba(217, 70, 239, 0.22), transparent 55%), radial-gradient(900px 500px at 100% 0%, rgba(56, 189, 248, 0.16), transparent 50%), radial-gradient(700px 400px at 50% 110%, rgba(244, 114, 182, 0.18), transparent 45%)'
      },
      fontFamily: {
        sans: ['"Noto Sans SC"', 'ui-sans-serif', 'system-ui', 'sans-serif']
      }
    }
  }
}
