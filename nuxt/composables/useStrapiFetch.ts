import { ofetch } from 'ofetch'

export const useStrapiFetch = () => {
  const getServiceHref = useGetServiceHref()

  // TODO: switch back to $fetch (https://github.com/unjs/nitro/issues/470)
  return ofetch.create({
    baseURL: getServiceHref({ name: 'creal_strapi', port: 1337 }) + '/api',
  })
}
