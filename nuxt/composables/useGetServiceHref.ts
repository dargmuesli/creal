export const useGetServiceHref = () => (name: string, port: number) => {
  const host = useHost()
  const config = useRuntimeConfig()

  if (config.public.stagingHost) {
    return `https://${name}.${config.public.stagingHost}`
  }

  if (process.server) {
    return `http://${name}:${port}`
  }

  return `https://${name}.${getDomainTldPort(host)}`
}
