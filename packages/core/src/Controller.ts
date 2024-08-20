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

  public config = {} as InternalConfig
  public handler?: InternalHandler

  constructor(config: Config = {}, handler?: InternalHandler) {
    this.applyConfig(config)
    handler && this.applyHandler(handler)
  }

  /**
   * Adds character(s) to the internal sequence. Returns true if the sequence was reset in the process.
   */
  private addToSequence(event: KeyboardEvent) {
    // Ignore modifier keys
    if (event.shiftKey && event.key === 'Shift') return
    if (event.ctrlKey && event.key === 'Control') return
    if (event.altKey && event.key === 'Alt') return
    if (event.metaKey && event.key === 'Meta') return

    const character = encodeKey(event.key)

    const matchesOneSymbology = this.config.symbologies.some((symbology) => symbology.testCharacter(character))
    const matchesPrefix = character === this.config.scannerOptions.prefix
    const matchesSuffix = character === this.config.scannerOptions.suffix

    if (matchesOneSymbology || matchesPrefix || matchesSuffix) {
      this.sequence += character
      if (matchesSuffix) {
        clearTimeout(this.timeout)
        this.evaluateSequence()
        this.resetSequence()
        return true
      }
    } else {
      this.resetSequence()
      return true
    }
  }

  /**
   * Evaluates the sequence against the configured symbologies.
   */
  private evaluateSequence() {
    const { prefix, suffix } = this.config.scannerOptions

    const isValid = this.sequence.startsWith(prefix) && this.sequence.endsWith(suffix)

    if (!isValid) return

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

  /**
   * Handles the `keydown` event.
   */
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
      const isReset = this.addToSequence(event)
      if (!isReset) {
        this.timeout = setTimeout(() => {
          this.evaluateSequence()
          this.resetSequence()
        }, config.scannerOptions.maxDelay)
      }
    }
  }

  /**
   * Attaches a new handler to the controller.
   */
  applyHandler(handler: InternalHandler) {
    this.handler = handler
  }

  /**
   * Attaches a new config to the controller.
   */
  applyConfig(config: Config) {
    this.config = resolveWith(config, configResolver)
  }

  /**
   * Attaches a listener to the `config.target` element.
   */
  bind() {
    let target: any
    if (this.config.target) {
      target = this.config.target()
    }

    if (this.config.enabled && target) {
      const onKeyDown = this.keyDown.bind(this)
      target.addEventListener('keydown', onKeyDown, this.config.eventOptions)
      const remove = () => {
        target.removeEventListener('keydown', onKeyDown, this.config.eventOptions)
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
    return () => this.clean()
  }

  /**
   * Cleans all side effects (listeners, timeouts). When the symbology scanner is
   * destroyed (in React, when the component is unmounted.)
   */
  clean() {
    this.resetSequence()
    if (this.listener) this.listener()
    this.listener = undefined
    clearTimeout(this.timeout)
    this.timeout = undefined
  }
}
