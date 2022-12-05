import { IncomingMessage } from 'node:http'

import { mergeWith } from 'lodash-es'

type Dictionary<T> = { [key: string]: T } // import { Dictionary } from 'vue-router/types/router'

export const VALIDATION_SUGGESTION_TITLE_LENGTH_MAXIMUM = 300

export function formPreSubmit(that: any): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    that.graphqlError = undefined
    that.v$.touch()

    // Workaround until https://vuelidate-next.netlify.app/.
    const waitPending = () => {
      if (that.v$.$pending) {
        setTimeout(() => {
          waitPending()
        }, 100)
      } else {
        if (that.v$.$invalid) {
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

export function getDomainTldPort(host: string) {
  const hostParts = host.split('.')

  if (hostParts.length === 1 && !/^localhost(:[0-9]+)?$/.test(hostParts[0]))
    throw new Error(`Invalid input: ${host}`)

  if (hostParts.length <= 2) return host

  return `${hostParts[hostParts.length - 2]}.${hostParts[hostParts.length - 1]}`
}

export function getHost(req: IncomingMessage) {
  if (!req.headers.host) throw new Error('Host header is not given!')

  return req.headers.host
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

function isObject(a: any) {
  return !!a && a.constructor === Object
}

export function mergeByKey(target: any, source: any, key: string | number) {
  if (!key) {
    return
  }

  return mergeWith(target, source, (targetValue: any, srcValue: any) => {
    if (Array.isArray(targetValue) && Array.isArray(srcValue)) {
      let matchFound = false

      for (let j = 0; j < srcValue.length; j++) {
        for (let i = 0; i < targetValue.length; i++) {
          if (
            isObject(srcValue[j]) &&
            isObject(targetValue[i]) &&
            key in srcValue[j] &&
            key in targetValue[i] &&
            srcValue[j][key] === targetValue[i][key]
          ) {
            targetValue[i] = mergeByKey(targetValue[i], srcValue[j], key)
            matchFound = true
            break
          }
        }

        if (!matchFound) {
          targetValue.push(srcValue[j])
        } else {
          matchFound = false
        }
      }

      return targetValue
    } else {
      return undefined // Handle merge by lodash's merge function.
    }
  })
}
