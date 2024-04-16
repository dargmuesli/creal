import type { LocationQuery } from '#vue-router'

export interface Paging {
  isNextAllowed: boolean
  isPreviousAllowed: boolean
  partString: string
  queryNext: LocationQuery
  queryPrevious: LocationQuery
}

export interface CollectionItem<T> {
  id: number
  attributes: T
}
