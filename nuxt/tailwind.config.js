const defaultTheme = require('tailwindcss/defaultTheme')

function heading(theme) {
  return {
    fontWeight: theme('fontWeight.bold'),
    marginBottom: theme('margin.1'),
    marginTop: theme('margin.4'),
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  }
}

module.exports = {
  mode: 'jit',
  theme: {
    extend: {
      colors: {
        background: {
          body: defaultTheme.colors.gray['800'],
          dark: defaultTheme.colors.gray['900'],
        },
        link: defaultTheme.colors.blue['400'],
        text: defaultTheme.colors.white,
      },
      transitionProperty: {
        margin: 'margin',
        maxHeight: 'max-height',
      },
      transitionTimingFunction: {
        popout: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.text'),
            a: {
              color: theme('colors.link'),
              textDecoration: 'none',
            },
            h1: {
              color: theme('colors.text'),
            },
            h2: {
              color: theme('colors.text'),
            },
            h3: {
              color: theme('colors.text'),
            },
            h4: {
              color: theme('colors.text'),
            },
            h5: {
              color: theme('colors.text'),
            },
            h6: {
              color: theme('colors.text'),
            },
            strong: {
              color: theme('colors.text'),
            },
          },
        },
        xl: {
          css: {
            h1: {
              lineHeight: theme('lineHeight.snug'),
            },
            h2: {
              lineHeight: theme('lineHeight.snug'),
            },
            h3: {
              lineHeight: theme('lineHeight.snug'),
            },
            h4: {
              lineHeight: theme('lineHeight.snug'),
            },
            h5: {
              lineHeight: theme('lineHeight.snug'),
            },
            h6: {
              lineHeight: theme('lineHeight.snug'),
            },
          },
        },
      }),
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
    require('@tailwindcss/forms'),
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/typography'),
    function ({ addBase, addComponents, addUtilities, theme }) {
      addBase({
        ':disabled': {
          cursor: theme('cursor.not-allowed'),
          opacity: theme('opacity.50'),
        },
        h1: {
          ...heading(theme),
          fontSize: theme('fontSize.4xl'),
          marginBottom: theme('margin.4'),
          textAlign: 'center',
        },
        h2: {
          ...heading(theme),
          fontSize: theme('fontSize.3xl'),
        },
        h3: {
          ...heading(theme),
          fontSize: theme('fontSize.2xl'),
        },
        h4: {
          ...heading(theme),
          fontSize: theme('fontSize.xl'),
        },
        h5: {
          ...heading(theme),
          fontSize: theme('fontSize.lg'),
        },
        h6: {
          ...heading(theme),
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
        '.min-w-xxs': {
          minWidth: '15rem',
        },
        '.mb-20vh': {
          marginBottom: '20vh',
        },
      })
    },
  ],
}
