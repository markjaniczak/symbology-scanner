import { configResolver, resolveWith } from './config'
import { Config, InternalConfig, InternalHandler } from './types'
import { encodeKey } from './utils'

export class Controller {
  /** Internal timer to  */
  private timeout?: NodeJS.Timeout
  /** Sequence that stores the scanned barcode */
  private sequence: string = ''
  /** Listeners attached to elements by this instance */
  private listener?: () => void
  /** Time in milliseconds since page load when the last event was observed */
  private lastEventTime: number = 0
  public config = {} as InternalConfig
  public handler?: InternalHandler

  constructor(config: Config = {}, handler?: InternalHandler) {
    this.applyConfig(config)
    handler && this.applyHandler(handler)
  }

  /**
   * Adds character(s) to the internal sequence
   * @param value
   */
  private addToSequence(value: string) {
    const character = encodeKey(value)
    if (
      this.config.symbologies.some((symbology) => symbology.testCharacter(character)) ||
      this.config.scannerOptions.prefix === character ||
      this.config.scannerOptions.suffix === character
    ) {
      this.sequence += encodeKey(value)
    }
  }

  /**
   * Validates whether a sequence was performed by scanning hardware.
   * Returns true if so, false otherwise.
   */
  private validateSequence() {
    const now = performance.now()
    const delay = now - this.lastEventTime

    const { prefix, suffix, maxDelay } = this.config.scannerOptions

    return this.sequence.startsWith(prefix) && this.sequence.endsWith(suffix) && delay <= maxDelay
  }

  /**
   * Evaluates the sequence against the configured symbologies.
   */
  private evaluateSequence() {
    const { prefix, suffix } = this.config.scannerOptions
    const symbol = this.sequence.slice(prefix.length, suffix.length ? -1 * suffix.length : undefined)

    const symbologies = this.config.symbologies.flatMap((symbology) => {
      const isMatch = symbology.testSymbol(symbol)
      return isMatch ? [symbology.name] : []
    })

    if (symbologies.length && this.handler) {
      this.handler(symbol, symbologies)
    }
  }

  /**
   * Resets the internal sequence to the default state.
   */
  private resetSequence() {
    this.sequence = ''
  }

  private keyDown(event: KeyboardEvent) {
    clearTimeout(this.timeout)

    const { config } = this

    /** If config.preventDefault is true, then call preventDefault on the event */
    if (config.preventDefault) {
      event.preventDefault()
    }
    /** Repeating events are most likely triggered by human input.
     * If config.ignoreRepeats is true then reset the sequence.
     **/
    if (config.ignoreRepeats && event.repeat) {
      this.resetSequence()
    } else {
      this.addToSequence(event.key)
      this.lastEventTime = performance.now()
      this.timeout = setTimeout(() => {
        if (this.validateSequence()) {
          this.evaluateSequence()
        }
        this.resetSequence()
      }, config.scannerOptions.maxDelay)
    }
  }

  /**
   * Attaches a new handler to the controller.
   * @param handler
   */
  applyHandler(handler: InternalHandler) {
    this.handler = handler
  }

  /**
   * Attaches a new config to the controller.
   * @param config
   */
  applyConfig(config: Config) {
    this.config = resolveWith(config, configResolver)
  }

  bind() {
    let target: any
    if (this.config.target) {
      target = this.config.target()
    }

    if (this.config.enabled && target) {
      target.addEventListener('keydown', this.keyDown.bind(this), this.config.eventOptions)
      const remove = () => {
        target.removeEventListener('keydown', this.keyDown.bind(this), this.config.eventOptions)
        this.listener = undefined
      }
      this.listener = remove
      return remove
    }
  }

  /**
   * Executes side effects (attaching listeners to a `config.target`). Ran on
   * each render.
   */
  effect() {
    this.bind()
    return this.clean()
  }

  /**
   * Cleans all side effects (listeners, timeouts). When the symbology scanner is
   * destroyed (in React, when the component is unmounted.)
   */
  clean() {
    if (this.listener) this.listener()
    this.listener = undefined
    clearTimeout(this.timeout)
    this.timeout = undefined
  }
}
