import { configResolver, resolveWith } from './config'
import { Config, InternalConfig, InternalHandler } from './types'
import { encodeKey } from './utils'

export class Controller {
  /** Internal timer to  */
  private _timeout?: NodeJS.Timeout
  /** Sequence that stores the scanned barcode */
  private _sequence: string = ''
  /** Listeners attached to elements by this instance */
  private _listener?: () => void
  /** Time in milliseconds since page load when the last event was observed */
  private _lastEventTime: number = 0
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
  addToSequence(value: string) {
    this._sequence += encodeKey(value)
  }

  /**
   * Validates whether a sequence was performed by scanning hardware.
   * Returns true if so, false otherwise.
   */
  validateSequence() {
    const now = performance.now()
    const delay = now - this._lastEventTime

    const { prefix, suffix, maxDelay } = this.config.scannerOptions

    return this._sequence.startsWith(prefix) && this._sequence.endsWith(suffix) && delay <= maxDelay
  }

  /**
   * Evaluates the sequence against the configured symbologies.
   */
  evaluateSequence() {
    const { prefix, suffix } = this.config.scannerOptions
    const symbol = this._sequence.slice(prefix.length, suffix.length ? -1 * suffix.length : undefined)

    const symbologies = Object.entries(this.config.symbologies).flatMap(([symbologyKey, symbologyPattern]) => {
      const matches = symbol.match(symbologyPattern)
      return matches !== null ? [symbologyKey] : []
    })

    if (symbologies.length && this.handler) {
      this.handler(symbol, symbologies)
    }
  }

  /**
   * Resets the internal sequence to the default state.
   */
  resetSequence() {
    this._sequence = ''
  }

  keyDown(event: KeyboardEvent) {
    clearTimeout(this._timeout)

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
      this._lastEventTime = performance.now()
      this._timeout = setTimeout(() => {
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
        this._listener = undefined
      }
      this._listener = remove
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
    if (this._listener) this._listener()
    this._listener = undefined
    clearTimeout(this._timeout)
    this._timeout = undefined
  }
}
