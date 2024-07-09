import type { Config } from 'tailwindcss'
import type { PluginAPI } from 'tailwindcss/types/config'
import colors from 'tailwindcss/colors'

const { gray, yellow } = colors

export default <Partial<Config>>{
  plugins: [
    ({ addComponents }: PluginAPI) => {
      addComponents({
        '.bg-creal': {
          backgroundImage: 'url("/creal.webp")',
        },
      })
    },
  ],
  theme: {
    extend: {
      colors: {
        vio: {
          primary: {
            bg: yellow['500'],
            text: gray['900'],
          },
        },
      },
      fontSize: {
        xs: ['0.75rem', '1.375'],
        sm: ['0.875rem', '1.375'],
        base: ['1rem', '1.375'],
        lg: ['1.125rem', '1.375'],
        xl: ['1.25rem', '1.375'],
        '2xl': ['1.5rem', '1.375'],
        '3xl': ['1.875rem', '1.375'],
        '4xl': ['2.25rem', '1.375'],
        '5xl': ['3rem', '1.375'],
        '6xl': ['3.75rem', '1.375'],
        '7xl': ['4.5rem', '1.375'],
        '8xl': ['6rem', '1.375'],
        '9xl': ['8rem', '1.375'],
      },
    },
  },
}
