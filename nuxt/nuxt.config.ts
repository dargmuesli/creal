import { defineNuxtConfig } from '@nuxt/bridge'
import shrinkRay from 'shrink-ray-current'

import localeDe from './locales/de.json'
import localeEn from './locales/en.json'
import { AWS_BUCKET_NAME, BASE_URL, STACK_DOMAIN } from './plugins/baseUrl'

const LOCALES = [
  {
    code: 'en',
    name: 'English',
    iso: 'en', // Will be used as catchall locale by default.
  },
  {
    code: 'de',
    name: 'Deutsch',
    iso: 'de',
  },
]

export default defineNuxtConfig({
  alias: {
    tslib: 'tslib/tslib.es6.js',
  },
  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    babel: {
      presets() {
        return [['@nuxt/babel-preset-app', { corejs: { version: 3 } }]]
      },
    },
    extend(config) {
      config.node = {
        fs: 'empty',
      }
    },
    extractCSS: true,
    postcss: { plugins: { tailwindcss: {}, autoprefixer: {} } },
    transpile: [
      '@http-util/status-i18n',
      'abort-controller',
      'cross-fetch',
      'event-target-shim',
      'graphql',
      'moment',
      'subscriptions-transport-ws',
      'tslib',
      'twix',
      'universal-cookie',
      'web-streams-polyfill',
    ],
  },

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    [
      '@nuxtjs/fontawesome',
      {
        icons: {
          brands: ['faMixcloud'],
          solid: [
            'faArrowRight',
            'faBug',
            'faCalendarDay',
            'faComments',
            'faDownload',
            'faExclamationCircle',
            'faExclamationTriangle',
            'faLightbulb',
            'faMusic',
            'faPlay',
            'faShareAlt',
          ],
        },
        useLayers: false,
        useLayersText: false,
      },
    ],
    '@nuxtjs/html-validator',
    // Doc: https://github.com/nuxt-community/moment-module
    ['@nuxtjs/moment', { locales: ['de'], plugins: ['twix'] }],
    // https://go.nuxtjs.dev/stylelint
    '@nuxtjs/stylelint-module',
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  css: ['@/assets/css/main.css'],

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head() {
    return {
      bodyAttrs: {
        class: 'bg-background-body text-text',
      },
      link: [
        {
          href: '/assets/static/favicon/apple-touch-icon-60x60.png?v=eEYRGn5b9R',
          rel: 'apple-touch-icon',
          sizes: '60x60',
        },
        {
          href: '/assets/static/favicon/apple-touch-icon-76x76.png?v=eEYRGn5b9R',
          rel: 'apple-touch-icon',
          sizes: '76x76',
        },
        {
          href: '/assets/static/favicon/apple-touch-icon-120x120.png?v=eEYRGn5b9R',
          rel: 'apple-touch-icon',
          sizes: '120x120',
        },
        {
          href: '/assets/static/favicon/apple-touch-icon-152x152.png?v=eEYRGn5b9R',
          rel: 'apple-touch-icon',
          sizes: '152x152',
        },
        {
          href: '/assets/static/favicon/apple-touch-icon-180x180.png?v=eEYRGn5b9R',
          rel: 'apple-touch-icon',
          sizes: '180x180',
        },
        {
          href: '/assets/static/favicon/apple-touch-icon.png?v=eEYRGn5b9R',
          rel: 'apple-touch-icon',
          sizes: '180x180',
        },
        {
          href: '/assets/static/favicon/favicon-16x16.png?v=eEYRGn5b9R',
          rel: 'icon',
          sizes: '16x16',
          type: 'image/png',
        },
        {
          href: '/assets/static/favicon/favicon-32x32.png?v=eEYRGn5b9R',
          rel: 'icon',
          sizes: '32x32',
          type: 'image/png',
        },
        {
          href: '/assets/static/favicon/favicon.ico',
          rel: 'icon',
          type: 'image/x-icon',
        },
        {
          href: '/assets/static/favicon/site.webmanifest?v=eEYRGn5b9R',
          rel: 'manifest',
        },
        {
          color: '#2d3748',
          href: '/assets/static/favicon/safari-pinned-tab.svg?v=eEYRGn5b9R',
          rel: 'mask-icon',
        },
        {
          href: '/assets/static/favicon/favicon.ico?v=eEYRGn5b9R',
          rel: 'shortcut icon',
        },
      ],
      meta: [
        { charset: 'utf-8' },
        { content: 'width=device-width, initial-scale=1', name: 'viewport' },
        {
          hid: 'description',
          property: 'description',
          content: this.$t('globalOgSeoDescription'),
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: this.$t('globalOgSeoDescription'),
        },
        {
          content: '/assets/static/favicon/browserconfig.xml?v=eEYRGn5b9R',
          name: 'msapplication-config',
        },
        {
          content: '#2d3748',
          name: 'msapplication-TileColor',
        },
        {
          content: '#2d3748',
          name: 'theme-color',
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content:
            this.$baseUrl +
            '/assets/static/logos/creal_with-text_open-graph.png', // Does not support .svg as of 2021-06.
        },
        {
          hid: 'og:image:alt',
          property: 'og:image:alt',
          content: this.$t('globalOgImageAlt'),
        },
        {
          hid: 'og:image:height',
          property: 'og:image:height',
          content: '627',
        },
        {
          hid: 'og:image:width',
          property: 'og:image:width',
          content: '1200',
        },
        {
          hid: 'og:site_name',
          property: 'og:site_name',
          content: 'DJ cReal',
        },
        {
          hid: 'og:type',
          property: 'og:type',
          content: 'website', // https://ogp.me/#types
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: 'DJ cReal',
        },
        {
          hid: 'og:url',
          property: 'og:url',
          content: this.$baseUrl + this.$router.currentRoute.fullPath,
        },
        {
          hid: 'twitter:card',
          property: 'twitter:card',
          content: 'summary',
        },
        {
          hid: 'twitter:description',
          property: 'twitter:description',
          content: this.$t('globalOgSeoDescription'),
        },
        {
          hid: 'twitter:image',
          property: 'twitter:image',
          content:
            this.$baseUrl +
            '/assets/static/logos/creal_with-text_open-graph.png', // Does not support .svg as of 2021-06.
        },
        {
          hid: 'twitter:image:alt',
          property: 'twitter:image:alt',
          content: this.$t('globalOgImageAlt'),
        },
        {
          hid: 'twitter:title',
          property: 'twitter:title',
          content: 'DJ cReal',
        },
      ],
      titleTemplate: (titleChunk: string) => {
        return titleChunk ? `${titleChunk} - DJ cReal` : 'DJ cReal'
      },
    }
  },

  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    [
      'nuxt-helmet',
      {
        hsts: {
          maxAge: 31536000,
          preload: true,
        },
      },
    ], // Should be declared at the start of the array.
    'nuxt-clipboard2',
    [
      '@nuxt/http',
      {
        baseURL: 'http://creal_strapi:1337/api/',
        browserBaseURL: `https://strapi.${STACK_DOMAIN}/api/`,
      },
    ],
    [
      '@nuxtjs/apollo',
      {
        clientConfigs: {
          default: '~/plugins/apollo-config.ts',
        },
        defaultOptions: {
          $query: {
            fetchPolicy: 'cache-and-network',
          },
        },
      },
    ],
    [
      '@nuxtjs/axios',
      {
        baseURL: 'http://creal:3000/api/',
        browserBaseURL: `${BASE_URL}/api/`,
      },
    ], // Doc: https://axios.nuxtjs.org/usage
    [
      '@nuxtjs/i18n',
      {
        baseUrl: BASE_URL,
        defaultLocale: 'en', // Must be set for the default prefix_except_default prefix strategy.
        detectBrowserLanguage: {
          cookieSecure: true,
          redirectOn: 'root',
        },
        locales: LOCALES,
        vueI18n: {
          messages: {
            de: localeDe,
            en: localeEn,
          },
          silentFallbackWarn: true,
        },
        vueI18nLoader: true,
      },
    ],
    [
      '@nuxtjs/robots',
      {
        Allow: ['/'],
        Disallow: ['/robots.txt'], // https://webmasters.stackexchange.com/a/117537/70856
        Sitemap: BASE_URL + '/sitemap.xml',
      },
    ],
    'vue-sweetalert2/nuxt',
    '@nuxtjs/sitemap', // Should be declared at the end of the array.
  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    '~/plugins/baseUrl.ts',
    '~/plugins/i18n.ts',
    '~/plugins/marked.ts',
    '~/plugins/paging.ts',
    '~/plugins/util.ts',
    { src: '~/plugins/vue-plyr.js', mode: 'client' },
    '~/plugins/vuelidate.ts',
  ],

  render: {
    compressor: shrinkRay(),
    csp: {
      policies: {
        'base-uri': ["'none'"], // Mozilla Observatory.
        'connect-src': [
          "'self'", // Nuxt development.
          `https://*.${STACK_DOMAIN}`, // PostGraphile, ...
          'https://cdn.plyr.io', // Plyr.
        ],
        'default-src': ["'none'"],
        'form-action': ["'none'"], // Mozilla Observatory.
        'frame-ancestors': ["'none'"], // Mozilla Observatory.
        'img-src': [
          "'self'",
          `https://strapi.${STACK_DOMAIN}`,
          `https://${AWS_BUCKET_NAME}.s3.nl-ams.scw.cloud`, // Playlist cover.
        ],
        'media-src': [
          'https://cdn.plyr.io/static/blank.mp4', // Plyr.
          `https://${AWS_BUCKET_NAME}.s3.nl-ams.scw.cloud`, // Music.
        ],
        'manifest-src': ["'self'"], // Chrome
        'report-uri': 'https://dargmuesli.report-uri.com/r/d/csp/enforce',
        'script-src': ['https://static.cloudflareinsights.com'],
        'style-src': [
          "'self'", // Tailwind
          "'sha256-WcR1Ar+4qu9KupBnfKnc/wVoMHhfObQDhd2xlj6DG4o='",
        ],
      },
      reportOnly: false,
    },
  },

  vue: {
    config: {
      productionTip: false,
    },
  },
})
