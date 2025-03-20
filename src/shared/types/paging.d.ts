import type { LocationQuery } from '#vue-router'

export interface Paging {
  isNextAllowed: boolean
  isPreviousAllowed: boolean
  partString: string
  queryNext: LocationQuery
  queryPrevious: LocationQuery
}
