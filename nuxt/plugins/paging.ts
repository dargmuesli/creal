import { Context } from '@nuxt/types'

export default (_context: Context, inject: any) => {
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

      const allowNext = start + items.length < itemsCountTotal
      const allowPrevious = start > 0

      return {
        items,
        partString,
        queryNext,
        queryPrevious,
        allowNext,
        allowPrevious,
      }
    }
  )
}
