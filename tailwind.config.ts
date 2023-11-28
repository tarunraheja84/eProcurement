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
          'access-denide' : "url('https://www.dropbox.com/s/qq5n8w99q40wtrg/wood-fence.png?raw=1')"
      },
      colors : {
        'custom-red': '#FB4444',
        'custom-green': '#22C55E ',
        'hover-red': '#E33333',
        'disable-grey' :"#ccc",
        'light-red' :"#FEF2F2",
        'hover-green' :"#37A34A"
      }
    },
  },
  plugins: [],
}
export default config
