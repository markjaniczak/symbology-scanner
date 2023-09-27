import { InternalHandler, Config } from '@use-symbology-scanner/core/types'
import { Controller } from '@use-symbology-scanner/core'
import { RefObject, useEffect, useMemo } from 'react'

export const useSymbologyScanner = (
  handler: InternalHandler,
  config: Config & { target?: RefObject<EventTarget> } = {}
): void => {
  const controller = useMemo(() => new Controller(), [])
  controller.applyHandler(handler)
  controller.applyConfig(config)

  useEffect(controller.effect.bind(controller))

  useEffect(() => {
    return controller.clean.bind(controller)
  }, [])
}
