import { STANDARD_SYMBOLOGIES } from '../packages/core/src/symbologies'

const values = [
  ['UPC-A', '012345678912'],
  ['UPC-E', '02345673'],
  ['EAN 8', '12345670'],
  ['EAN 13', '1134567890121'],
  ['Codabar', '12345678'],
  ['Code 11', '12345678'],
  ['Code 39', 'CODE-39'],
  ['Code 93', 'CODE-93'],
  ['Code 128', 'BC-1234-5678/44'],
  ['Code 25 Interleaved', '123456789012'],
  ['Code 25 Industrial', '123456789012'],
  ['MSI Code', '40001234'],
  ['QR Code', 'https://www.test.com/test.html?key=value#anchor'],
  ['PDF417', 'https://www.test.com/test.html?key=value#anchor'],
  ['Data Matrix', 'https://www.test.com/test.html?key=value#anchor'],
  ['Aztec Code', 'https://www.test.com/test.html?key=value#anchor'],
  ['Dot Code', 'https://www.test.com/test.html?key=value#anchor']
] as const

describe('testing symbology patterns', () => {
  test.each(values)('%s symbology pattern to match correctly', (symbologyKey, symbol) => {
    const symbology = STANDARD_SYMBOLOGIES[symbologyKey]
    expect(symbology.testSymbol(symbol)).toBe(true)
  })
})
