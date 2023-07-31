export interface StrapiResult<T> {
  data: CollectionItem<T>[]
  meta: {
    pagination: {
      total: number
    }
  }
}
