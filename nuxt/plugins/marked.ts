import { Inject } from '@nuxt/types/app'
import { Context } from '@nuxt/types'

import marked from 'marked'

export default (_: Context, inject: Inject) => {
  inject('marked', marked)
}
