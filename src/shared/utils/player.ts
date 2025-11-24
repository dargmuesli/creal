import { mergeWith } from 'lodash-es'

const isObject = (a: unknown) => !!a && a.constructor === Object

export const mergeByKey = (
  target: unknown,
  source: unknown,
  key: string | number,
) =>
  key
    ? mergeWith(target, source, (targetValue: unknown, srcValue: unknown) => {
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
    : undefined
