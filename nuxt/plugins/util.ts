import { Context } from '@nuxt/types-edge'
import { Inject } from '@nuxt/types-edge/app'

type Dictionary<T> = { [key: string]: T } // import { Dictionary } from 'vue-router/types/router'

export const VALIDATION_SUGGESTION_TITLE_LENGTH_MAXIMUM = 300

export function formPreSubmit(that: any): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    that.graphqlError = undefined
    that.$v.$touch()

    // Workaround until https://vuelidate-next.netlify.app/.
    const waitPending = () => {
      if (that.$v.$pending) {
        setTimeout(() => {
          waitPending()
        }, 100)
      } else {
        if (that.$v.$invalid) {
          reject(Error('Form is invalid!'))
          return
        }

        that.form.sent = true

        resolve()
      }
    }

    waitPending()
  })
}

export function getQueryString(
  queryParametersObject: Dictionary<
    string | ((string | null)[] & { pw: 'lost' | 'found' })
  >
): string {
  return (
    '?' +
    Object.keys(queryParametersObject)
      .map((key) => {
        return (
          encodeURIComponent(key) +
          '=' +
          encodeURIComponent(queryParametersObject[key] as string)
        )
      })
      .join('&')
  )
}

const util = {
  VALIDATION_SUGGESTION_TITLE_LENGTH_MAXIMUM,
  formPreSubmit,
  getQueryString,
}

export default (_: Context, inject: Inject) => {
  inject('util', util)
}

declare module 'vue/types/vue' {
  interface Vue {
    $util: typeof util
  }
}

declare module '@nuxt/types-edge' {
  interface NuxtAppOptions {
    $util: typeof util
  }
  interface Context {
    $util: typeof util
  }
}
