export function encodeKey(key: string) {
  switch (key) {
    case 'Enter':
      return '\n'
    case 'Tab':
      return '\t'
    case 'Spacebar':
      return ' '
    default:
      return key
  }
}

/**
 * Determines whether a regex pattern is a character class.
 */
export function isCharacterClass(value: RegExp | string) {
  const source = value instanceof RegExp ? value.source : value
  if (source.startsWith('[') && source.endsWith(']') && source.length > 2) return true // Character class
  return false
}