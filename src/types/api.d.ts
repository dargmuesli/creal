export type ApiData = ComputedRef<{
  data?: Object
  errors: BackendError[]
  isFetching: boolean
}>
