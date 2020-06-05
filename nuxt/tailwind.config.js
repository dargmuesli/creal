/*
 ** TailwindCSS Configuration File
 **
 ** Docs: https://tailwindcss.com/docs/configuration
 ** Default: https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
 */
module.exports = {
  theme: {},
  variants: {},
  plugins: [
    function ({ addBase, config }) {
      addBase({
        body: {
          background: config('theme.colors.gray.800'),
          color: config('theme.colors.white'),
          h1: {
            fontSize: config('theme.fontSize.6xl'),
            marginBottom: config('theme.margin.4'),
            fontWeight: config('theme.fontWeight.bold'),
          },
          h2: {
            fontSize: config('theme.fontSize.4xl'),
            marginBottom: config('theme.margin.3'),
            fontWeight: config('theme.fontWeight.bold'),
          },
          ':disabled': {
            cursor: config('theme.cursor.not-allowed'),
            opacity: config('theme.opacity.50'),
          },
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
