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
