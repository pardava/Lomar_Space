/** @type {import('tailwindcss').Config} */
// Tailwind v3. If your project uses CommonJS, rename to tailwind.config.cjs and use module.exports.
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        lomar: {
          bg: '#090B10',
          surface: '#111827',
          blue: '#2563EB',
          aurora: '#7C3AED',
          champagne: '#C8A97E',
          ivory: '#F5F1EB',
          muted: '#94A3B8',
        },
      },
      fontFamily: {
        sans: ['"SF Pro Display"', '-apple-system', 'BlinkMacSystemFont', 'Inter', 'system-ui', 'sans-serif'],
        display: ['"SF Pro Display"', '-apple-system', 'BlinkMacSystemFont', 'Inter', 'system-ui', 'sans-serif'],
      },
      // Hero 80px / Section 48px / Card 22px / Body 18px (fluid on small screens)
      fontSize: {
        hero: ['clamp(2.75rem, 6.2vw + 0.5rem, 5rem)', { lineHeight: '1.02', letterSpacing: '-0.035em', fontWeight: '600' }],
        section: ['clamp(2rem, 3.4vw + 0.6rem, 3rem)', { lineHeight: '1.08', letterSpacing: '-0.03em', fontWeight: '600' }],
        card: ['1.375rem', { lineHeight: '1.25', letterSpacing: '-0.01em', fontWeight: '600' }],
        body: ['1.125rem', { lineHeight: '1.6' }],
      },
      borderRadius: { lomar: '28px' },
      backdropBlur: { lomar: '24px' },
      boxShadow: {
        float: '0 24px 60px -24px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.06)',
        'glow-blue': '0 0 0 1px rgba(37,99,235,0.35), 0 16px 56px -12px rgba(37,99,235,0.5)',
        'glow-champagne': '0 0 70px -12px rgba(200,169,126,0.5)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: { float: 'float 7s ease-in-out infinite' },
    },
  },
  plugins: [],
};
