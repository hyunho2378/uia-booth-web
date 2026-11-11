export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'bg-primary': 'var(--bg)',
        'bg-elevated': 'var(--surface)',
        surface: 'var(--surface)',
        'border-subtle': 'transparent',
        'border-default': 'transparent',
        'border-strong': 'transparent',
        'text-primary': 'var(--ink)',
        'text-muted': 'var(--mute)',
        'text-inverse': 'var(--bg)',
        accent: 'var(--y)',
        'accent-dim': 'var(--y)',
      },
      fontFamily: {
        display: ['Barlow', 'Pretendard Variable', 'sans-serif'],
        body: ['Pretendard Variable', 'Pretendard', 'sans-serif'],
        ui: ['Pretendard Variable', 'Pretendard', 'sans-serif'],
      },
      screens: {
        xs: '320px', sm: '390px', md: '768px',
        lg: '1024px', xl: '1280px', '2xl': '1440px', '3xl': '1920px',
      },
      transitionTimingFunction: { out: 'cubic-bezier(0.16, 1, 0.3, 1)' },
    },
  },
  plugins: [],
}
