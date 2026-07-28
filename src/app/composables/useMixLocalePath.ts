// Works around an @nuxtjs/i18n bug: localePath() resolves the given path
// via router.resolve(), then re-resolves the *already-resolved* route
// object a second time to attach the localized route name. Vue Router's
// resolve() decodes (without re-encoding) the path when given an
// already-resolved object, corrupting any segment with characters like
// '#' — common in DJ mix titles, e.g. "Muesli-Mix #1". Since MIXES_PATH
// routes only ever need a locale *prefix* (this app's i18n strategy is
// prefix_except_default), prefixing it manually avoids the buggy path
// entirely instead of relying on localePath's general-purpose resolution.
export const useMixLocalePath = () => {
  const { locale } = useI18n({ useScope: 'global' })
  const { defaultLocale } = useRuntimeConfig().public.i18n

  return (path: string) =>
    locale.value === defaultLocale ? path : `/${locale.value}${path}`
}
