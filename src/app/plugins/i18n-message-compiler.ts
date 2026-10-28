import { compile, registerMessageCompiler } from '@intlify/core-base'

// Dynamic content (track names) can end up as i18n message values, e.g. the
// page-scoped `title` message on a mixes track page. ICU special characters
// such as `@` or `{` make message compilation throw, which propagates out of
// `t()` and 500s the SSR render. Wrapping the globally registered compiler
// (the one every composer, local or global scope, falls back to) renders
// unparseable messages as their raw string instead.
//
// The registration runs at module evaluation time because the i18n plugin
// captures the registered compiler when it calls `createI18n`, before any
// plugin setup that comes after it has run.
const tolerantCompile = (
  message: Parameters<typeof compile>[0],
  context: Parameters<typeof compile>[1],
): ReturnType<typeof compile> => {
  try {
    return compile(message, context)
  } catch {
    return (() => message) as ReturnType<typeof compile>
  }
}

registerMessageCompiler(tolerantCompile)

// The registration above is the whole plugin; Nuxt just needs the file in the
// plugin list so it is imported before the i18n plugin runs.
export default defineNuxtPlugin(() => {
  // no-op
})
