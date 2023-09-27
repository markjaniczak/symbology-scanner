import { Symbology } from "./Symbology"

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

// prettier-ignore
const STANDARD_SYMBOLOGY_OPTIONS = {
  'UPC-A': {
    allowedCharacters: /[\d]/,
    minLength: 12,
    maxLength: 12
  },
  'UPC-E': {
    allowedCharacters: /[\d]/,
    minLength: 8,
    maxLength: 8
  },
  'EAN 8': {
    allowedCharacters: /[\d]/,
    minLength: 8,
    maxLength: 8
  },
  'EAN 13': {
    allowedCharacters: /[\d]/,
    minLength: 13,
    maxLength: 13
  },
  'Codabar': {
    allowedCharacters: /[\d\-\$\:\/\.\+]/,
  },
  'Code 11': {
    allowedCharacters: /[\d\-]/,
  },
  'Code 39': {
    allowedCharacters: /[\dA-Z\ \-\.\$\/\+\%]/,
  },
  'Code 93': {
    allowedCharacters: /[\dA-Z\ \-\.\$\/\+\%]/,
  },
  'Code 128': {
    allowedCharacters: /[ -~]/,
  },
  'Code 25 Interleaved': {
    allowedCharacters: /[\d]/,
  },
  'Code 25 Industrial': {
    allowedCharacters: /[\d]/,
  },
  'MSI Code': {
    allowedCharacters: /[\d]/,
  },
  'QR Code': {
    allowedCharacters: /[\x00-\x7F]/,
  },
  'PDF417': {
    allowedCharacters: /[\x00-\x7F]/,
  },
  'Data Matrix': {
    allowedCharacters: /[\x00-\x7F]/,
  },
  'Aztec Code': {
    allowedCharacters: /[\x00-\x7F]/,
  },
  'Dot Code': {
    allowedCharacters: /[\x00-\xFF]/,
  }
}

export type StandardSymbologies = {
  [K in (typeof STANDARD_SYMBOLOGY_KEYS)[number]]: Symbology
}

export const STANDARD_SYMBOLOGIES = Object.fromEntries(
  Object.entries(STANDARD_SYMBOLOGY_OPTIONS).map(([key, options]) => [key, new Symbology({ name: key, ...options })])
) as StandardSymbologies