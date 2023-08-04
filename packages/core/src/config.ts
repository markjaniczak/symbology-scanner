import { StandardSymbologyKey, STANDARD_SYMBOLOGIES, Symbology } from './symbologies'
import { InternalConfig, Resolver, ResolverMap, Target } from './types'

export const DEFAULT_PREFIX = ''
export const DEFAULT_SUFFIX = ''
export const DEFAULT_MAX_DELAY = 20

export const configResolver: { [K in keyof InternalConfig]: Resolver } = {
  target(value: Target) {
    if (value) {
      return () => ('current' in value ? value.current : value)
    } else if (window) {
      return () => window.document
    } else {
      return undefined
    }
  },
  symbologies(value: Record<string, Symbology> | StandardSymbologyKey[] = STANDARD_SYMBOLOGIES) {
    if (Array.isArray(value)) {
      return value.reduce<Record<string, Symbology>>((result, symbology) => {
        if (symbology in STANDARD_SYMBOLOGIES) {
          result[symbology] = STANDARD_SYMBOLOGIES[symbology]
        } else {
          if (process.env.NODE_ENV === 'development') {
            console.warn(
              `[@use-symbology-scanner]: \`symbologies\` option received a non-standard symbology \`${symbology}\`.` +
                `Provide your own pattern for \`${symbology}\`.`
            )
          }
        }
        return result
      }, {})
    } else {
      return value
    }
  },
  enabled(value = true) {
    return value
  },
  eventOptions({ passive = true, capture = false } = {}) {
    return { passive, capture }
  },
  preventDefault(value = false) {
    return value
  },
  ignoreRepeats(value = true) {
    return value
  },
  scannerOptions({ prefix = DEFAULT_PREFIX, suffix = DEFAULT_SUFFIX, maxDelay = DEFAULT_MAX_DELAY } = {}) {
    return {
      prefix,
      suffix,
      maxDelay
    }
  }
}

export function resolveWith<T extends { [k: string]: any }, V extends { [k: string]: any }>(
  config: Partial<T> = {},
  resolvers: ResolverMap
): V {
  const result: any = {}

  for (const [key, resolver] of Object.entries(resolvers)) {
    result[key] = resolver.call(result, config[key], key, config)
  }

  return result
}
