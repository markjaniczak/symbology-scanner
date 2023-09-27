import { StandardSymbologyKey } from './symbologies'
import { Symbology } from './Symbology'

export type InternalHandler = (symbol: string, symbologies: string[]) => any | void

export type InternalConfig = {
  target?: () => EventTarget
  symbologies: Symbology[]
  ignoreRepeats: boolean
  enabled: boolean
  eventOptions: AddEventListenerOptions
  preventDefault: boolean
  scannerOptions: {
    prefix: string
    suffix: string
    maxDelay: number
  }
}

export type Target = EventTarget | { current: EventTarget | null }

export type Resolver = (v: any, key: string, config: any) => any
export type ResolverMap = { [k: string]: Resolver }

export type Config = {
  /** The DOM node or react ref to attach events to. Defaults to the document. */
  target?: Target
  /** Symbologies to check for at the end of each scan. Defaults to all supported symbologies. */
  symbologies?: Symbology[] | StandardSymbologyKey[]
  /** When set to true, repeated key strokes will clear the sequence. */
  ignoreRepeats?: boolean
  /** When set to false the handler will not fire. */
  enabled?: boolean
  /** Changes whether events are passive or captured */
  eventOptions?: AddEventListenerOptions
  /** When set to true, handler will call preventDefault on all keydown events. */
  preventDefault?: boolean
  scannerOptions?: {
    /** Character(s) that precede the scanned barcode value. */
    prefix?: string
    /** Character(s) that succeed the scanned barcode value. */
    suffix?: string
    /** Maximum amount of delay between characters during a scan. */
    maxDelay?: number
  }
}

export interface TypedEventTarget<EventMap> extends EventTarget {
  addEventListener<K extends keyof EventMap>(
    type: K,
    callback: (event: EventMap[K] extends Event ? EventMap[K] : never) => EventMap[K] extends Event ? void : never,
    options?: AddEventListenerOptions | boolean
  ): void

  addEventListener(
    type: string,
    callback: EventListenerOrEventListenerObject | null,
    options?: EventListenerOptions | boolean
  ): void

  removeEventListener<K extends keyof EventMap>(
    type: K,
    callback: (event: EventMap[K] extends Event ? EventMap[K] : never) => EventMap[K] extends Event ? void : never,
    options?: AddEventListenerOptions | boolean
  ): void

  removeEventListener(
    type: string,
    callback: EventListenerOrEventListenerObject | null,
    options?: EventListenerOptions | boolean
  ): void
}
