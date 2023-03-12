export const useGetServiceHref = () => {
  const host = useHost()
  const config = useRuntimeConfig()

  return (name?: string, port?: number) =>
    getServiceHref({ host, name, port, stagingHost: config.public.stagingHost })
}
