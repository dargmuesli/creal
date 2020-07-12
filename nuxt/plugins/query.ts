import { Context } from '@nuxt/types'
import slugify from 'slugify'

export default (_context: Context, inject: any) => {
  inject('focusItem', (items: Array<any>, query: Record<any, any>) => {
    if (items !== null) {
      for (const item of items) {
        if (slugify(item.title) === query.q) {
          item.focused = true
          return item
        }
      }
    }
  })
}
