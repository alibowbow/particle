import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './hooks/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
    './store/**/*.{ts,tsx}',
  ],
  darkMode: ['class'],
  theme: {
    extend: {
      colors: {
        ink: '#07090d',
        mist: '#99a4b8',
        line: 'rgba(255,255,255,0.09)',
        panel: 'rgba(11,16,24,0.7)',
        panelStrong: 'rgba(15,22,32,0.92)',
        plasma: '#77f2ff',
        ember: '#ff8361',
        volt: '#d2ff5d',
        iris: '#8f9dff',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      boxShadow: {
        float: '0 32px 80px rgba(0, 0, 0, 0.38)',
        glass: '0 12px 34px rgba(5, 8, 14, 0.34)',
      },
      backgroundImage: {
        shell:
          'radial-gradient(circle at top, rgba(119,242,255,0.18), transparent 26%), radial-gradient(circle at 20% 20%, rgba(143,157,255,0.12), transparent 20%), linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0))',
        mesh:
          'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
      },
      backgroundSize: {
        mesh: '80px 80px',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseLine: {
          '0%, 100%': { opacity: '0.35', transform: 'scaleX(0.95)' },
          '50%': { opacity: '0.9', transform: 'scaleX(1)' },
        },
      },
      animation: {
        float: 'float 9s ease-in-out infinite',
        pulseLine: 'pulseLine 5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

export default config
