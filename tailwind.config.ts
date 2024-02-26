import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors : {
        'custom-theme': '#14C673',
        'hover-theme': '#04df79',
        'custom-buttonText': '#ffffff',
        'custom-red': '#ef4444',
        'hover-red': '#dc2626',
        'custom-green': '#22C55E ',
        'hover-green' :"#37A34A",
        'custom-yellow': '#f59e0b',
        'hover-yellow': '#F19408',
        'custom-blue':'#1d4ed8',
        'custom-link-blue': '#1d4ed8',
        'custom-pink': '#f9a8d4',
        'custom-indigo':'#60a5fa',
        'custom-gray-1':'#f3f4f6',
        'custom-gray-2': '#e5e7eb',
        'custom-gray-3': '#d1d5db',
        'custom-gray-4': '#6b7280',
        'custom-gray-5': '#374151',
      }
    },
  },
  plugins: [],
}
export default config
