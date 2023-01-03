export const useStrapiFetch = () => {
  const getServiceHref = useGetServiceHref()

  return $fetch.create({
    baseURL: getServiceHref('creal_strapi', 1337) + '/api',
  })
}
