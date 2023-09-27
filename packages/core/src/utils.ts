export function encodeKey(key: string) {
  switch (key) {
    case 'Enter':
      return '\n'
    case 'Tab':
      return '\t'
    default:
      return key
  }
}

/**
 * Determines whether a regex is a character class.
 */
export function isCharacterClass(value: RegExp) {
  if (value.source.startsWith('[') && value.source.endsWith(']') && value.source.length > 2) return true // Character class

  return false
}