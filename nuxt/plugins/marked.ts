import { Inject } from '@nuxt/types-edge/app'
import { Context } from '@nuxt/types-edge'

import { marked } from 'marked'

export default (_: Context, inject: Inject) => {
  inject('marked', marked.parse)
}
