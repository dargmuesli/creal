export const useGetServiceHref = () => {
  const host = useHost()
  const config = useRuntimeConfig()

  return ({
    isSsr = true,
    name,
    port,
  }: {
    isSsr?: boolean
    name?: string
    port?: number
  }) =>
    getServiceHref({
      host,
      isSsr,
      name,
      port,
      stagingHost: config.public.stagingHost,
    })
}
