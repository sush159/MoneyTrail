/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy:    { DEFAULT: '#0d1b2a', 2: '#162436', 3: '#1e3048' },
        cream:   { DEFAULT: '#faf8f3', 2: '#f3f0e8', 3: '#e9e5d8', 4: '#ddd8c8' },
        copper:  { DEFAULT: '#b5622a', 2: '#c97840', glow: 'rgba(181,98,42,0.12)' },
        jade:    { DEFAULT: '#2e6b55', tint: '#e8f3ee', ring: 'rgba(46,107,85,0.25)' },
        crimson: { DEFAULT: '#b03040', tint: '#f7e8ea', ring: 'rgba(176,48,64,0.22)' },
        gold:    { DEFAULT: '#8a6520', tint: '#f8f2e0', ring: 'rgba(138,101,32,0.22)' },
        steel:   { DEFAULT: '#3a5878', tint: '#e8eef5', ring: 'rgba(58,88,120,0.22)' },
        ink:     { DEFAULT: '#0d1b2a', 2: '#2a3f52', 3: '#4a5f72' },
        muted:   { DEFAULT: '#8a9aaa', 2: '#b8c4ce' },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans:  ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono:  ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        s: '6px', m: '10px', l: '14px', xl: '18px',
      },
      boxShadow: {
        card:  '0 1px 3px rgba(13,27,42,0.06), 0 4px 16px rgba(13,27,42,0.04)',
        lift:  '0 2px 8px rgba(13,27,42,0.08), 0 8px 24px rgba(13,27,42,0.06)',
        float: '0 8px 32px rgba(13,27,42,0.12), 0 2px 8px rgba(13,27,42,0.06)',
      },
    },
  },
  plugins: [],
}
