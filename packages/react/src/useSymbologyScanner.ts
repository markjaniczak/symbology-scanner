import { InternalHandler, Config } from '@use-symbology-scanner/core/types'
import { Controller } from '@use-symbology-scanner/core'
import { RefObject, useEffect, useRef } from 'react'

export const useSymbologyScanner = (
  handler: InternalHandler,
  config: Config & { target?: RefObject<EventTarget> } = {}
): void => {
  const controllerRef = useRef<Controller | null>(null)

  useEffect(() => {
    const controller = controllerRef.current
    if (controller) {
      controller.applyHandler(handler)
      controller.applyConfig(config)
      return controller.effect()
    }
  })

  useEffect(() => {
    const controller = new Controller(config, handler)
    controllerRef.current = controller
    return controller.clean.bind(controller)
  }, [])
}
