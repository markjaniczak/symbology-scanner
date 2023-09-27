import { isCharacterClass } from "./utils"

export interface SymbologyOptions {
  name: string
  /** A regex pattern expressing the allowed characters of this symbology. Must be a character class.
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Regular_expressions/Character_class
   */
  allowedCharacters: RegExp | string
  /** The minimum character length of the symbology. Defaults to `1`. */
  minLength?: number
  /** The maximum character length of the symbology.  */
  maxLength?: number
}

export class Symbology {
  /** The name of the symbology */
  public name: string
  /** A regex pattern expressing the allowed characters of this symbology. */
  protected allowedCharacters: RegExp
  /** The minimum character length of the symbology. */
  protected minLength: number
  /** The maximum character length of the symbology.  */
  protected maxLength?: number

  constructor({ name, allowedCharacters, minLength = 1, maxLength }: SymbologyOptions) {
    this.name = name
    this.minLength = minLength
    if (maxLength && maxLength < minLength) throw new Error('maxLength must be greater than or equal to minLength')
    this.maxLength = maxLength
    if (!isCharacterClass(allowedCharacters))
      throw new Error('allowedCharacters must be a character class')
    const pattern = allowedCharacters instanceof RegExp ? allowedCharacters.source : allowedCharacters
    this.allowedCharacters = new RegExp(pattern)
  }

  protected get symbolPattern() {
    return new RegExp(`^${this.allowedCharacters.source}{${this.minLength},${this.maxLength ?? ''}}$`)
  }

  protected get characterPattern() {
    return new RegExp(`^${this.allowedCharacters.source}$`)
  }

  testCharacter(value: string) {
    return this.characterPattern.test(value)
  }

  testSymbol(value: string) {
    return this.symbolPattern.test(value)
  }
}
