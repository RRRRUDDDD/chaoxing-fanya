/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "hsl(var(--paper))",
        ink: "hsl(var(--ink))",
        accent: "hsl(var(--accent))",
        line: "hsl(var(--line))",
        soft: "hsl(var(--soft))",
        faint: "hsl(var(--faint))",
        success: "hsl(var(--success))",
        danger: "hsl(var(--danger))",
        warning: "hsl(var(--warning))",
        border: "hsl(var(--line))",
        input: "hsl(var(--line))",
        ring: "hsl(var(--accent))",
        background: "hsl(var(--paper))",
        foreground: "hsl(var(--ink))",
        primary: {
          DEFAULT: "hsl(var(--ink))",
          foreground: "hsl(var(--paper))",
        },
        secondary: {
          DEFAULT: "hsl(var(--soft))",
          foreground: "hsl(var(--ink))",
        },
        destructive: {
          DEFAULT: "hsl(var(--danger))",
          foreground: "hsl(var(--paper))",
        },
        muted: {
          DEFAULT: "hsl(var(--soft))",
          foreground: "hsl(var(--faint))",
        },
      },
      fontFamily: {
        sans: ['"Inter"', '"Noto Sans SC"', 'system-ui', 'sans-serif'],
        display: ['"Oswald"', '"Noto Sans SC"', '"Archivo Black"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', '"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        hero: ['clamp(3rem,10vw,9rem)', { lineHeight: '0.9', letterSpacing: '0.01em', fontWeight: '700' }],
        marq: ['clamp(1rem,2vw,1.5rem)', { lineHeight: '1', letterSpacing: '0.05em', fontWeight: '600' }],
      },
      boxShadow: {
        'b-xs': '2px 2px 0 0 hsl(var(--ink))',
        'b-sm': '4px 4px 0 0 hsl(var(--ink))',
        'b': '6px 6px 0 0 hsl(var(--ink))',
        'b-lg': '8px 8px 0 0 hsl(var(--ink))',
        'b-xl': '12px 12px 0 0 hsl(var(--ink))',
        'b-accent': '6px 6px 0 0 hsl(var(--accent))',
        'b-accent-lg': '10px 10px 0 0 hsl(var(--accent))',
        'none': '0 0 0 0 transparent',
      },
      borderWidth: {
        '3': '3px',
      },
      borderRadius: {
        none: '0',
        DEFAULT: '0',
      },
      keyframes: {
        'stagger-up': {
          from: { opacity: '0', transform: 'translateY(28px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'marquee': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        'spin-slow': {
          to: { transform: 'rotate(360deg)' },
        },
        'stripes': {
          from: { backgroundPosition: '0 0' },
          to: { backgroundPosition: '40px 0' },
        },
        'pulse-hard': {
          '0%,100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
      },
      animation: {
        'stagger-up': 'stagger-up 0.7s cubic-bezier(0.16,1,0.3,1) both',
        'marquee': 'marquee 20s linear infinite',
        'spin-slow': 'spin-slow 3s linear infinite',
        'stripes': 'stripes 1s linear infinite',
        'pulse-hard': 'pulse-hard 1.2s cubic-bezier(0.4,0,0.6,1) infinite',
      },
    },
  },
  plugins: [],
}
