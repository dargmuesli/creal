export interface Paging {
  isNextAllowed: boolean
  isPreviousAllowed: boolean
  partString: string
  queryNext: Object
  queryPrevious: Object
}

export interface CollectionItem<T> {
  id: number
  attributes: T
}
