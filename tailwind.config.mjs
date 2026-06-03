/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--color-bg)',
        'bg-alt': 'var(--color-bg-alt)',
        surface: 'var(--color-surface)',
        accent: 'var(--color-accent)',
        'accent-soft': 'var(--color-accent-soft)',
        'accent-strong': 'var(--color-accent-strong)',
        sage: 'var(--color-sage)',
        text: 'var(--color-text)',
        'text-soft': 'var(--color-text-soft)',
        border: 'var(--color-border)',
      },
      fontFamily: {
        sans: ['Inter Variable', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Plus Jakarta Sans Variable', 'Plus Jakarta Sans', 'Inter Variable', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 18px 50px rgba(43, 42, 39, 0.08)',
        line: '0 1px 0 var(--color-border)',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
      },
      maxWidth: {
        site: '75rem',
      },
    },
  },
  plugins: [],
};
