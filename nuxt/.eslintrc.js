module.exports = {
  env: {
    browser: true,
    node: true,
  },
  extends: [
    '@nuxtjs/eslint-config-typescript',
    'plugin:@intlify/vue-i18n/recommended',
    'plugin:prettier/recommended',
    'plugin:nuxt/recommended',
    'plugin:yml/standard',
  ],
  root: true,
  rules: {
    '@intlify/vue-i18n/no-missing-keys': 'error',
    '@intlify/vue-i18n/no-raw-text': 'error',
    'yml/quotes': ['error', { prefer: 'single' }],
  },
  settings: {
    'vue-i18n': {
      localeDir: './locales/*.json',
    },
  },
}
