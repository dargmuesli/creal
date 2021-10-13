import { Inject } from '@nuxt/types/app'
import { Context } from '@nuxt/types'

export default (_: Context, inject: Inject) => {
  inject(
    'paging',
    (
      items: Array<any>,
      itemsCountTotal: number,
      query: Record<any, any>,
      start: number,
      limit: number
    ) => {
      const partString =
        (items.length > 0 ? start + 1 : 0) +
        '-' +
        (start + items.length) +
        ' / ' +
        itemsCountTotal

      const startPrevious = Math.max(0, start - limit)
      const queryPrevious = {
        ...(query.limit && { limit: query.limit }),
        ...(startPrevious > 0 && { start: startPrevious }),
      }
      const queryNext = {
        ...(query.limit && { limit: query.limit }),
        start: start + limit,
      }

      const isNextAllowed = start + items.length < itemsCountTotal
      const isPreviousAllowed = start > 0

      return {
        isNextAllowed,
        isPreviousAllowed,
        items,
        partString,
        queryNext,
        queryPrevious,
      }
    }
  )
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $paging: Function
  }
  interface Context {
    $paging: Function
  }
}
