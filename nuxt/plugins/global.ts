import { Context } from '@nuxt/types'
import { Inject } from '@nuxt/types/app'

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

const globals = {
  VALIDATION_SUGGESTION_TITLE_LENGTH_MAXIMUM,
  formPreSubmit,
}

export default (_: Context, inject: Inject) => {
  inject('global', globals)
}

declare module 'vue/types/vue' {
  interface Vue {
    $global: typeof globals
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $global: typeof globals
  }
  interface Context {
    $global: typeof globals
  }
}
