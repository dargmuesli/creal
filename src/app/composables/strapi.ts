import type { CollectionItem } from '@dargmuesli/nuxt-vio/shared/types/fetch'
import { FETCH_RETRY_AMOUNT } from '@dargmuesli/nuxt-vio/shared/utils/constants'
import { consola } from 'consola'
import type { FetchOptions } from 'ofetch'

// Strapi's REST API only returns `pageCount` for page-based pagination
// (`pagination[page]`/`pagination[pageSize]`), not for offset-based
// pagination - hence this narrower result type than `StrapiResult`.
type StrapiPageResult<T> = {
  data: CollectionItem<T>[]
  meta: {
    pagination: {
      page: number
      pageCount: number
      pageSize: number
      total: number
    }
  }
}

export const useStrapiData = async <T>({
  path,
  query,
}: {
  path: string
  query: FetchOptions['query']
}) => {
  const { locale } = useI18n({ useScope: 'global' })
  const strapiFetch = useStrapiFetch({ name: 'creal-strapi' })
  const route = useRoute()

  // data
  const requestError = ref()
  const queryPage = +(route.query.page ? route.query.page : 1)
  const queryPageSize = +(route.query.pageSize ? route.query.pageSize : 100)

  try {
    // async data
    const asyncData = await strapiFetch<StrapiPageResult<T>>(path, {
      query: {
        locale: locale.value,
        'pagination[page]': String(queryPage),
        'pagination[pageSize]': String(queryPageSize),
        ...query,
      },
      retry: FETCH_RETRY_AMOUNT,
    })
    const items = asyncData.data
    const paging = getPaging({
      itemsCountOnPage: items.length,
      pagination: asyncData.meta.pagination,
    })

    return { items, paging, requestError }
  } catch (error) {
    requestError.value = error
    consola.error(error)
    return { requestError }
  }
}
