import type { StrapiResult } from '@dargmuesli/nuxt-vio/types/fetch'
import { FETCH_RETRY_AMOUNT } from '@dargmuesli/nuxt-vio/utils/constants'
import { consola } from 'consola'
import type { FetchOptions } from 'ofetch'

export const useStrapiData = async <T>({
  path,
  query,
}: {
  path: string
  query: FetchOptions['query']
}) => {
  const { locale } = useI18n()
  const strapiFetch = useStrapiFetch()
  const route = useRoute()

  // data
  const requestError = ref()
  const queryLimit = +(route.query.limit ? route.query.limit : 100)
  const queryStart = +(route.query.start ? route.query.start : 0)

  try {
    // async data
    const asyncData = await strapiFetch<StrapiResult<T>>(path, {
      query: {
        locale: locale.value,
        'pagination[limit]': String(queryLimit),
        'pagination[start]': String(queryStart),
        ...query,
      },
      retry: FETCH_RETRY_AMOUNT,
    })
    const items = asyncData.data
    const paging = getPaging({
      items,
      itemsCountTotal: asyncData?.meta.pagination.total,
      query: route.query,
      start: queryStart,
      limit: queryLimit,
    })

    return { items, paging, requestError }
  } catch (error) {
    requestError.value = error
    consola.error(error)
    return { requestError }
  }
}
