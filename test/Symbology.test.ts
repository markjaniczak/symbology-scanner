import { Symbology } from '@use-symbology-scanner/core'

describe('Symbology', () => {
  describe('constructor', () => {
    test('should create a new instance of Symbology', () => {
      const symbology = new Symbology({
        name: 'EAN 8',
        minLength: 8,
        maxLength: 8,
        allowedCharacters: /[\d]/
      })
      expect(symbology).toBeInstanceOf(Symbology)
    })

    test('should throw an error when maxLength is less than minLength', () => {
      const createSymbol = () =>
        new Symbology({
          name: 'EAN 13',
          minLength: 13,
          maxLength: 12,
          allowedCharacters: /[0123456789]/
        })

      expect(createSymbol).toThrowError('maxLength must be greater than or equal to minLength')
    })
  })
  describe('testCharacter', () => {
    const symbology = new Symbology({
      name: 'EAN 13',
      allowedCharacters: /[0123456789]/
    })
    it('should return true when the character is allowed', () => {
      expect(symbology.testCharacter('1')).toBe(true)
    })
    it('should return false when the character is not allowed', () => {
      expect(symbology.testCharacter('a')).toBe(false)
    })
  })
  describe('testSymbol', () => {
    const symbology = new Symbology({
      name: 'EAN 13',
      minLength: 13,
      maxLength: 13,
      allowedCharacters: /[\d]/
    })
    it('should return true when the symbol is allowed', () => {
      expect(symbology.testSymbol('1234567890123')).toBe(true)
    })
    it('should return false when the symbol is not allowed', () => {
      expect(symbology.testSymbol('123456789012a')).toBe(false)
    })
  })
})
