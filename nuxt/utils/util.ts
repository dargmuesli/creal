import { IncomingMessage } from 'node:http'

import { CombinedError } from '@urql/core'
import Clipboard from 'clipboard'
import { H3Event, getCookie } from 'h3'
import { mergeWith } from 'lodash-es'
import { ofetch } from 'ofetch'
import Swal from 'sweetalert2'
import { Ref } from 'vue'

import { TIMEZONE_COOKIE_NAME } from './constants'
import type { ApiData } from '~/types/api'

export type BackendError = CombinedError | { errcode: string; message: string }

export const VALIDATION_SUGGESTION_TITLE_LENGTH_MAXIMUM = 300

export function append(path: string, pathToAppend: string): string {
  return path + (path.endsWith('/') ? '' : '/') + pathToAppend
}

export function copyText(text: string) {
  return new Promise(function (resolve, reject) {
    const fakeElement = document.createElement('button')
    const clipboard = new Clipboard(fakeElement, {
      text: function () {
        return text
      },
      action: function () {
        return 'copy'
      },
      container: document.body,
    })
    clipboard.on('success', function (e) {
      clipboard.destroy()
      resolve(e)
    })
    clipboard.on('error', function (e) {
      clipboard.destroy()
      reject(e)
    })
    fakeElement.click()
  })
}

export async function formPreSubmit(
  api: ApiData,
  v$: any,
  isFormSent: Ref<boolean>
): Promise<boolean> {
  api.value.errors = []
  v$.value.$touch()

  const isFormValid = await v$.value.$validate()
  isFormSent.value = isFormValid

  if (!isFormValid) {
    throw new Error('Form is invalid!')
  }

  return isFormValid
}

export const getApiMeta = (
  queries?: {
    error: Ref<CombinedError | undefined>
    fetching: Ref<boolean>
  }[]
) => ({
  errors: queries
    ? queries.reduce((p, c) => {
        if (c.error.value) {
          return [...p, c.error.value]
        } else {
          return p
        }
      }, [] as BackendError[])
    : [],
  isFetching: queries
    ? queries.reduce((p, c) => p || c.fetching.value, false)
    : false,
})

export function getCombinedErrorMessages(
  errors: BackendError[],
  pgIds?: Record<string, string>
) {
  const errorMessages: string[] = []

  for (const error of errors) {
    if ('errcode' in error) {
      const translation = pgIds && pgIds[`postgres${error.errcode}`]

      if (translation) {
        errorMessages.push(translation)
      } else {
        errorMessages.push(error.message)
      }
    } else {
      const combinedError = error

      if (combinedError.networkError) {
        errorMessages.push(combinedError.message)
      }

      for (const graphqlError of combinedError.graphQLErrors) {
        errorMessages.push(graphqlError.message)
      }
    }
  }

  return errorMessages
}

export function getDomainTldPort(host: string) {
  const hostParts = host.split('.')

  if (/^localhost(:[0-9]+)?$/.test(hostParts[hostParts.length - 1]))
    return hostParts[hostParts.length - 1]

  if (hostParts.length === 1) throw new Error('Host is too short!')

  return `${hostParts[hostParts.length - 2]}.${hostParts[hostParts.length - 1]}`
}

export function getHost(req: IncomingMessage) {
  if (!req.headers.host) throw new Error('Host header is not given!')

  return req.headers.host
}

export function getQueryString(
  queryParametersObject: Record<string, any>
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

export const getTimezone = async (event: H3Event) =>
  getCookie(event, TIMEZONE_COOKIE_NAME) ||
  (
    await ofetch(
      `http://ip-api.com/json/${event.node.req.headers['x-real-ip']}`
    )
  ).timezone

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

export function serializeQueryString(object: any) {
  const playlistLinkParts: Array<string> = []

  for (const [key, value] of Object.entries(object)) {
    playlistLinkParts.push(!value ? key : `${key}=${value}`)
  }

  return `?${playlistLinkParts.join('&')}`
}

export function showToast({ title }: { title: string }) {
  Swal.fire({
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    },
    icon: 'success',
    position: 'bottom-right',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    title,
    toast: true,
  })
}
