module.exports = {
  extends: [
    '@nuxtjs/eslint-config-typescript',
    'plugin:@intlify/vue-i18n/recommended',
    'plugin:compat/recommended',
    'plugin:prettier/recommended',
    'plugin:nuxt/recommended',
    'plugin:yml/standard',
  ],
  overrides: [
    {
      files: ['server/**/*'],
      rules: {
        'compat/compat': 'off',
      },
    },
  ],
  root: true,
  rules: {
    '@intlify/vue-i18n/no-missing-keys': 'error',
    '@intlify/vue-i18n/no-raw-text': 'error',
    '@intlify/vue-i18n/no-deprecated-i18n-component': 'error', // TODO: do not specify below rules manually, but have them included in `recommended` https://github.com/intlify/eslint-plugin-vue-i18n/issues/275
    '@intlify/vue-i18n/no-deprecated-i18n-place-attr': 'error',
    '@intlify/vue-i18n/no-deprecated-i18n-places-prop': 'error',
    '@intlify/vue-i18n/no-i18n-t-path-prop': 'error',
    '@intlify/vue-i18n/valid-message-syntax': 'error',
    '@intlify/vue-i18n/key-format-style': 'error',
    '@intlify/vue-i18n/no-duplicate-keys-in-locale': 'error',
    '@intlify/vue-i18n/no-dynamic-keys': 'error',
    '@intlify/vue-i18n/no-missing-keys-in-other-locales': 'error',
    '@intlify/vue-i18n/no-unknown-locale': 'error',
    '@intlify/vue-i18n/no-unused-keys': 'error',
    '@intlify/vue-i18n/prefer-sfc-lang-attr': 'error',
    '@intlify/vue-i18n/prefer-linked-key-with-paren': 'error',
    // '@intlify/vue-i18n/sfc-locale-attr': 'error',
    'yml/quotes': ['error', { prefer: 'single' }],
  },
  settings: {
    'vue-i18n': {
      localeDir: [
        {
          pattern: './locales/*.json',
        },
        {
          pattern: './node_modules/@dargmuesli/nuxt-vio/locales/*.json',
        },
      ],
      messageSyntaxVersion: '^9.0.0',
    },
  },
}
