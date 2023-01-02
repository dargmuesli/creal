import { marked } from 'marked'

export default defineNuxtPlugin((_nuxtApp) => {
  return {
    provide: {
      marked: marked.parse,
    },
  }
})
