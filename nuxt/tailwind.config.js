/*
 ** TailwindCSS Configuration File
 **
 ** Docs: https://tailwindcss.com/docs/configuration
 ** Default: https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
 */
module.exports = {
  future: {
    defaultLineHeights: true,
    purgeLayersByDefault: true,
    removeDeprecatedGapUtilities: true,
    standardFontWeights: true,
  },
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
      0: '0',
    },
  },
  variants: {
    borderWidth: ['first'],
    margin: ['responsive', 'first', 'last'],
  },
  plugins: [
    function ({ addBase, addComponents, addUtilities, theme }) {
      addBase({
        body: {
          background: theme('colors.gray.800'),
          color: theme('colors.white'),
          h1: {
            fontSize: theme('fontSize.6xl'),
            fontWeight: theme('fontWeight.bold'),
            lineHeight: 1,
            marginBottom: theme('margin.4'),
            textAlign: 'center',
          },
          h2: {
            fontSize: theme('fontSize.4xl'),
            fontWeight: theme('fontWeight.bold'),
            marginBottom: theme('margin.3'),
          },
          ':disabled': {
            cursor: theme('cursor.not-allowed'),
            opacity: theme('opacity.50'),
          },
          padding:
            '0px ' +
            theme('padding.2') +
            ' ' +
            theme('padding.2') +
            ' ' +
            theme('padding.2'),
        },
      })

      addComponents({
        '.bg-creal': {
          backgroundImage: 'url("/creal.jpg")',
        },
        '.fullscreen': {
          bottom: 0,
          height: theme('height.full'),
          left: 0,
          position: 'absolute',
          right: 0,
          top: 0,
          width: theme('width.full'),
        },
      })

      addUtilities({
        '.max-w-xxs': {
          maxWidth: '15rem',
        },
        '.mb-20vh': {
          marginBottom: '20vh',
        },
      })
    },
  ],
}
