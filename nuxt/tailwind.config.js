const colors = require('tailwindcss/colors')

function heading(theme) {
  return {
    fontWeight: theme('fontWeight.bold'),
    marginBottom: theme('margin.1'),
    marginTop: theme('margin.4'),
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  }
}

function prose(theme) {
  return {
    css: {
      a: {
        color: theme('colors.link'),
        textDecoration: 'none',
      },
      color: theme('colors.text'),
      h1: {
        color: theme('colors.text'),
        lineHeight: theme('lineHeight.snug'),
      },
      h2: {
        color: theme('colors.text'),
        lineHeight: theme('lineHeight.snug'),
      },
      h3: {
        color: theme('colors.text'),
        lineHeight: theme('lineHeight.snug'),
      },
      h4: {
        color: theme('colors.text'),
        lineHeight: theme('lineHeight.snug'),
      },
      h5: {
        color: theme('colors.text'),
        lineHeight: theme('lineHeight.snug'),
      },
      h6: {
        color: theme('colors.text'),
        lineHeight: theme('lineHeight.snug'),
      },
    },
  }
}

module.exports = {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.js',
    './nuxt.config.ts',
  ],
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
        '::placeholder': {
          fontStyle: 'italic',
          'input&,textarea&': {
            opacity: 0.5,
          },
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
        '.form-input': {
          appearance: 'none',
          backgroundColor: theme('colors.gray.50'),
          borderColor: theme('colors.gray.300'),
          borderRadius: theme('borderRadius.DEFAULT'),
          boxShadow: theme('boxShadow.sm'),
          color: theme('colors.text.dark'),
          lineHeight: theme('lineHeight.tight'),
          padding: theme('padding.2') + ' ' + theme('padding.4'),
          width: theme('width.full'),
          '&:focus': {
            backgroundColor: theme('colors.white'),
          },
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
  theme: {
    extend: {
      animation: {
        shake: 'shake 0.6s ease-in-out 0s 1 normal forwards running',
      },
      colors: {
        background: {
          body: colors.gray['800'],
          dark: colors.gray['900'],
        },
        link: colors.blue['400'],
        text: colors.white,
      },
      keyframes: {
        shake: {
          '0%': {
            transform: 'translateX(0)',
          },
          '15%': {
            transform: 'translateX(0.375rem)',
          },
          '30%': {
            transform: 'translateX(-0.375rem)',
          },
          '45%': {
            transform: 'translateX(0.375rem)',
          },
          '60%': {
            transform: 'translateX(-0.375rem)',
          },
          '75%': {
            transform: 'translateX(0.375rem)',
          },
          '90%': {
            transform: 'translateX(-0.375rem)',
          },
          '100%': {
            transform: 'translateX(0)',
          },
        },
      },
      minHeight: {
        '80vh': '80vh',
      },
      transitionProperty: {
        margin: 'margin',
        maxHeight: 'max-height',
      },
      transitionTimingFunction: {
        popout: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
      typography: (theme) => ({
        sm: prose(theme),
        DEFAULT: prose(theme),
        lg: prose(theme),
        xl: prose(theme),
        '2xl': prose(theme),
      }),
    },
    maxHeight: {
      0: '0',
    },
  },
}
