export const useCrealHeadDefault = (
  input: Parameters<typeof useSeoMeta>[0],
  ogImageProps?: Parameters<typeof defineOgImage>[1],
) => {
  return useHeadDefault(input, {
    headline: SITE_NAME,
    ...ogImageProps,
  })
}
