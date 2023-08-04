import { Controller } from '@use-symbology-scanner/core'
import { Config, InternalHandler } from '@use-symbology-scanner/core/types'

export class SymbologyScanner {
  private _controller: Controller
  private _target: EventTarget

  constructor(handler: InternalHandler, config: Config = {}, target: EventTarget = document) {
    this._target = target
    this._controller = new Controller({ ...config, target }, handler)
    this._controller.effect()
  }

  destroy() {
    this._controller.clean()
  }

  setConfig(config: Config) {
    this._controller.clean()
    this._controller.applyConfig({ ...config, target: this._target })
    this._controller.effect()
  }
}
