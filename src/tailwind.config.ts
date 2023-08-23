import type { Config } from 'tailwindcss'
import type { PluginAPI } from 'tailwindcss/types/config'

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
} as Config
