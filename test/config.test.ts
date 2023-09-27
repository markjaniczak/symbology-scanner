import { Controller } from '@use-symbology-scanner/core'
import { STANDARD_SYMBOLOGIES, STANDARD_SYMBOLOGY_KEYS } from '@use-symbology-scanner/core/symbologies'

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
      symbologies: STANDARD_SYMBOLOGY_KEYS.map((v) => STANDARD_SYMBOLOGIES[v]),
      scannerOptions: {
        prefix: '',
        suffix: '',
        maxDelay: 20
      },
      target: expect.any(Function)
    })
  })
})
