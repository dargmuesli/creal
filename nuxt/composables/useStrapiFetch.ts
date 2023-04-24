export const useStrapiFetch = () => {
  const getServiceHref = useGetServiceHref()

  return $fetch.create({
    baseURL: getServiceHref({ name: 'creal_strapi', port: 1337 }) + '/api',
  })
}
