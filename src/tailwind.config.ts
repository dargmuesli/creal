import type { ModuleOptions } from '@nuxtjs/tailwindcss'
import type { PluginAPI } from 'tailwindcss/types/config'
import colors from 'tailwindcss/colors'

const { gray, yellow } = colors

export default {
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
    },
  },
} as ModuleOptions['config']
