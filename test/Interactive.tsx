import { Config, InternalHandler } from '@use-symbology-scanner/core/types'
import { useSymbologyScanner } from '@use-symbology-scanner/react'
import React, { useRef } from 'react'

export const Interactive = ({ config = {}, handler }: { config?: Config; handler: InternalHandler }) => {
  const ref = useRef<HTMLDivElement>(null)

  useSymbologyScanner(handler, {
    ...config,
    target: ref
  })

  return <div data-testid="test-el" ref={ref} />
}
