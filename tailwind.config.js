/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB',
        'primary-hover': '#1D4ED8',
        'bg-primary': '#FFFFFF',
        'bg-surface': '#F7F7F5',
        'bg-secondary': '#F0F4FF',
        'text-primary': '#1A1A1A',
        'text-muted': '#6B6B6B',
        'text-dim': '#9CA3AF',
        success: '#16A34A',
        error: '#DC2626',
        border: '#E5E7EB',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '12px',
      },
    },
  },
  plugins: [],
}
