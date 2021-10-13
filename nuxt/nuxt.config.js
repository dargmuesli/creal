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

export default {
  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    babel: {
      presets({ _isServer }) {
        return [
          ['@nuxt/babel-preset-app', { loose: true, corejs: { version: 3 } }],
        ]
      },
    },
    /*
     ** You can extend webpack config here
     */
    extend(config, _ctx) {
      config.node = {
        fs: 'empty',
      }
    },
    extractCSS: true,
  },

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    [
      '@nuxtjs/fontawesome',
      {
        icons: {
          brands: ['faMixcloud'],
          solid: [
            'faBug',
            'faCalendarDay',
            'faComments',
            'faDownload',
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
    '@nuxtjs/composition-api/module',
    '@nuxtjs/html-validator',
    // Doc: https://github.com/nuxt-community/moment-module
    ['@nuxtjs/moment', { locales: ['de'], plugins: ['twix'] }],
    // https://go.nuxtjs.dev/stylelint
    '@nuxtjs/stylelint-module',
    // https://go.nuxtjs.dev/tailwindcss
    ['@nuxtjs/tailwindcss', { jit: true }],
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: ['plyr/dist/plyr.css'],

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
          content: process.env.npm_package_description,
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: process.env.npm_package_description,
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
          content: this.$baseUrl + '/assets/static/logos/creal.svg',
        },
        {
          hid: 'og:image:alt',
          property: 'og:image:alt',
          content: "cReal's logo",
        },
        {
          hid: 'og:type',
          property: 'og:type',
          content: 'website', // https://ogp.me/#types
        },
      ],
      titleTemplate: (titleChunk) => {
        return titleChunk ? `${titleChunk} - cReal` : 'cReal'
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
    'nuxt-healthcheck',
    [
      '@nuxtjs/axios',
      {
        baseURL: 'http://creal:3000/api/',
        browserBaseURL: 'https://creal.' + STACK_DOMAIN + '/api/',
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
    '@nuxtjs/proxy',
    [
      '@nuxtjs/robots',
      {
        Allow: ['/'],
        Disallow: ['/robots.txt'], // https://webmasters.stackexchange.com/a/117537/70856
        Sitemap: BASE_URL + '/sitemap.xml',
      },
    ],
    '@nuxtjs/sitemap', // Should be declared at the end of the array.
  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    '~/plugins/baseUrl.ts',
    '~/plugins/i18n.ts',
    '~/plugins/marked.ts',
    '~/plugins/paging.ts',
    '~/plugins/vue-plyr',
    '~/plugins/vuelidate.ts',
  ],

  // Cannot be moved to modules.
  proxy: {
    '/api/strapi/': {
      target: 'http://creal_strapi:1337/',
      pathRewrite: { '^/api/strapi': '' },
    },
  },

  render: {
    compressor: shrinkRay(),
    csp: {
      policies: {
        'base-uri': ["'none'"], // Mozilla Observatory.
        'connect-src': [
          "'self'", // Nuxt development.
          'https://cdn.plyr.io/', // Plyr.
        ],
        'default-src': ["'none'"],
        'form-action': ["'none'"], // Mozilla Observatory.
        'frame-ancestors': ["'none'"], // Mozilla Observatory.
        'img-src': [
          "'self'",
          `https://strapi.${STACK_DOMAIN}`,
          `https://${AWS_BUCKET_NAME}.s3.nl-ams.scw.cloud/`, // Playlist cover.
        ],
        'media-src': [
          'https://cdn.plyr.io/static/blank.mp4', // Plyr.
          `https://${AWS_BUCKET_NAME}.s3.nl-ams.scw.cloud/`, // Music.
        ],
        'manifest-src': ["'self'"], // Chrome
        'report-uri': 'https://dargmuesli.report-uri.com/r/d/csp/enforce',
        'script-src': ['https://static.cloudflareinsights.com/beacon.min.js'],
        'style-src': [
          "'self'", // Tailwind
          "'sha256-WcR1Ar+4qu9KupBnfKnc/wVoMHhfObQDhd2xlj6DG4o='",
        ],
      },
      reportOnly: false,
    },
  },

  serverMiddleware: [
    '~/middleware/server/headers.ts',
    '~/api/player/getObject.ts',
    '~/api/player/playlists.ts',
    '~/api/player/signedUrl.ts',
  ],

  vue: {
    config: {
      productionTip: false,
    },
  },
}
