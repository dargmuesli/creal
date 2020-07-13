/*
 ** TailwindCSS Configuration File
 **
 ** Docs: https://tailwindcss.com/docs/configuration
 ** Default: https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
 */
module.exports = {
  theme: {
    extend: {
      transitionProperty: {
        margin: 'margin',
        maxHeight: 'max-height',
      },
      transitionTimingFunction: {
        popout: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
    },
    maxHeight: {
      '0': '0',
    },
  },
  variants: {
    borderWidth: ['first'],
    margin: ['responsive', 'first', 'last'],
  },
  plugins: [
    function ({ addBase, addUtilities, config }) {
      addBase({
        '#__nuxt': {
          height: config('theme.height.full'),
        },
        '#__layout': {
          height: config('theme.height.full'),
        },
        body: {
          background: config('theme.colors.gray.800'),
          color: config('theme.colors.white'),
          h1: {
            fontSize: config('theme.fontSize.6xl'),
            fontWeight: config('theme.fontWeight.bold'),
            marginBottom: config('theme.margin.4'),
            textAlign: 'center',
          },
          h2: {
            fontSize: config('theme.fontSize.4xl'),
            fontWeight: config('theme.fontWeight.bold'),
            marginBottom: config('theme.margin.3'),
          },
          height: config('theme.height.full'),
          ':disabled': {
            cursor: config('theme.cursor.not-allowed'),
            opacity: config('theme.opacity.50'),
          },
          padding: config('theme.padding.2'),
        },
        html: {
          height: config('theme.height.full'),
        },
      })

      addUtilities({
        '.fullscreen': {
          bottom: 0,
          height: config('theme.height.full'),
          left: 0,
          position: 'absolute',
          right: 0,
          top: 0,
          width: config('theme.width.full'),
        },
      })
    },
  ],
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    content: [
      'components/**/*.vue',
      'layouts/**/*.vue',
      'pages/**/*.vue',
      'plugins/**/*.js',
      'nuxt.config.js',
    ],
  },
}
