import dayjs from 'dayjs'

// workaround for [1]
import de from 'dayjs/locale/de'
// import 'dayjs/locale/de' does not make locale available

import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

export default defineNuxtPlugin((_nuxtApp) => {
  dayjs.extend(isSameOrBefore)
  dayjs.extend(localizedFormat)
  dayjs.extend(timezone)
  dayjs.extend(utc)

  // workaround for [1]
  dayjs.locale(de)
  // dayjs.locale(en) makes `format` error

  return {
    provide: {
      dayjs,
    },
  }
})

/*
  [1]
  https://github.com/nuxt/framework/issues/7534#issuecomment-1248596609
  https://github.com/nuxt/framework/issues/7206
  https://github.com/maevsi/maevsi/issues/956
*/
