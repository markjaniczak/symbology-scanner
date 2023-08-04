import { Controller } from '@use-symbology-scanner/core'
import { STANDARD_SYMBOLOGIES } from '@use-symbology-scanner/core/symbologies'

describe('config', () => {
  test('should use the default config', () => {
    const controller = new Controller()

    expect(controller.config).toMatchObject({
      enabled: true,
      preventDefault: false,
      eventOptions: {
        passive: true,
        capture: false
      },
      ignoreRepeats: true,
      symbologies: STANDARD_SYMBOLOGIES,
      scannerOptions: {
        prefix: '',
        suffix: '',
        maxDelay: 20
      },
      target: expect.any(Function)
    })
  })
})
