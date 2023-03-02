import moment, { DayjsFn } from 'dayjs'

// workaround for [1]
import de from 'dayjs/locale/de'
// import 'dayjs/locale/de' does not make locale available

import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

export default defineNuxtPlugin((_nuxtApp) => {
  moment.extend(isSameOrBefore)
  moment.extend(timezone)
  moment.extend(utc)

  // workaround for [1]
  moment.locale(de)
  // moment.locale(en) makes `format` error

  return {
    provide: {
      moment,
    },
  }
})

declare module '#app' {
  interface NuxtApp {
    $dayjs: DayjsFn
  }
}

declare module 'nuxt/dist/app/nuxt' {
  interface NuxtApp {
    $dayjs: DayjsFn
  }
}

/*
  [1]
  https://github.com/nuxt/framework/issues/7534#issuecomment-1248596609
  https://github.com/nuxt/framework/issues/7206
  https://github.com/maevsi/maevsi/issues/956
*/
