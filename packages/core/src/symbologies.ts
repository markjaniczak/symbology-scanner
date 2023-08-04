/** A regex pattern expressing a symbology. */
export type Symbology = string

export const STANDARD_SYMBOLOGY_KEYS = [
  'UPC-A',
  'UPC-E',
  'EAN 8',
  'EAN 13',
  'Codabar',
  'Code 11',
  'Code 39',
  'Code 93',
  'Code 128',
  'Code 25 Interleaved',
  'Code 25 Industrial',
  'MSI Code',
  'QR Code',
  'PDF417',
  'Data Matrix',
  'Aztec Code',
  'Dot Code'
] as const

export type StandardSymbologyKey = (typeof STANDARD_SYMBOLOGY_KEYS)[number]

export type StandardSymbologies = {
  [K in (typeof STANDARD_SYMBOLOGY_KEYS)[number]]: Symbology
}

// prettier-ignore
export const STANDARD_SYMBOLOGIES: StandardSymbologies = {
  'UPC-A': '^[0-9]{12}$',
  'UPC-E': '^[0-9]{8}$',
  'EAN 8': '^[0-9]{8}$',
  'EAN 13': '^[0-9]{13}$',
  'Codabar': '^[0-9\-\$\:\/\.\+]+$',
  'Code 11': '^[0-9\-]+$',
  'Code 39': '^[0-9A-Z\ \-\.\$\/\+\%]+$',
  'Code 93': '^[0-9A-Z\ \-\.\$\/\+\%]+$',
  'Code 128': '^[ -~]+$',
  'Code 25 Interleaved': '^[0-9]+$',
  'Code 25 Industrial': '^[0-9]+$',
  'MSI Code': '^[0-9]+$',
  'QR Code': '^[\x00-\x7F]+$',
  'PDF417': '^[\x00-\x7F]+$',
  'Data Matrix': '^[\x00-\x7F]+$',
  'Aztec Code': '^[\x00-\x7F]+$',
  'Dot Code': '^[\x00-\xFF]+$'
}
