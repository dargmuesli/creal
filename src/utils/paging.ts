import type { LocationQuery } from '#vue-router'
import type { Paging } from '~/types/paging'

export const getPaging = <T>({
  items,
  itemsCountTotal,
  query,
  start,
  limit,
}: {
  items?: Array<T>
  itemsCountTotal?: number
  query: LocationQuery
  start: number
  limit: number
}) => {
  const partString =
    (items?.length && items?.length > 0 ? start + 1 : 0) +
    '-' +
    (items?.length && items.length > 0 ? start + items.length : 0) +
    ' / ' +
    itemsCountTotal

  const startPrevious = Math.max(0, start - limit)
  const queryPrevious = {
    ...(query.limit && { limit: query.limit }),
    ...(startPrevious > 0 && { start: `${startPrevious}` }),
  }
  const queryNext = {
    ...(query.limit && { limit: query.limit }),
    start: `${start + limit}`,
  }

  const isNextAllowed = start + (items?.length || 0) < (itemsCountTotal || 0)
  const isPreviousAllowed = start > 0

  return {
    isNextAllowed,
    isPreviousAllowed,
    partString,
    queryNext,
    queryPrevious,
  } as Paging
}
