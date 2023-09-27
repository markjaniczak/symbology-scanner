import { fireEvent, createEvent } from '@testing-library/dom'
import '@testing-library/jest-dom'
import { StandardSymbologyKey } from '@use-symbology-scanner/core/symbologies'
import { SymbologyScanner } from '@use-symbology-scanner/vanilla'

jest.useFakeTimers()

describe('vanilla', () => {
  test('should call the handler on a scanned symbol', () => {
    const mockFn = jest.fn()

    const scanner = new SymbologyScanner(mockFn)

    ;[
      '1',
      '2',
      '3',
      '4',
      { key: 'Shift', shiftKey: true },
      '5',
      '6',
      '7',
      '8',
      '9',
      '0',
      { key: 'Shift', shiftKey: true },
      '1',
      '2',
      '3'
    ].forEach((value) => {
      const event = typeof value === 'string' ? { key: value } : value
      fireEvent.keyDown(document, event)
    })

    jest.advanceTimersToNextTimer()

    expect(mockFn).toHaveBeenCalledWith('1234567890123', [
      'EAN 13',
      'Codabar',
      'Code 11',
      'Code 39',
      'Code 93',
      'Code 128',
      'Code 25 Interleaved',
      'Code 25 Industrial',
      'MSI Code',
      'QR Code',
      'PDF417',
      'Data Matrix',
      'Aztec Code',
      'Dot Code'
    ])

    scanner.destroy()
  })

  test('should only accept configured symbologies', () => {
    const mockFn = jest.fn()

    const scanner = new SymbologyScanner(mockFn, { symbologies: ['EAN 8'] })

    'https://test.com/test?key=value#anchor'.split('').forEach((key) => {
      fireEvent.keyDown(document, { key })
    })

    jest.advanceTimersToNextTimer()

    expect(mockFn).not.toHaveBeenCalled()

    scanner.destroy()
  })

  test('should check for a scanner prefix', () => {
    const mockFn = jest.fn()

    const symbol = '12345678'
    const symbologies = ['EAN 8'] satisfies StandardSymbologyKey[]

    const scanner = new SymbologyScanner(mockFn, { symbologies, scannerOptions: { prefix: '\t' } })

    ;['Tab', ...symbol].forEach((key) => {
      fireEvent.keyDown(document, { key })
    })

    jest.advanceTimersToNextTimer()

    expect(mockFn).toHaveBeenCalledWith(symbol, symbologies)

    mockFn.mockClear()
    ;[...symbol].forEach((key) => {
      fireEvent.keyDown(document, { key })
    })

    jest.advanceTimersToNextTimer()

    expect(mockFn).not.toHaveBeenCalled()

    scanner.destroy()
  })

  test('should check for a scanner suffix', () => {
    const mockFn = jest.fn()

    const symbol = '12345678'
    const symbologies = ['EAN 8'] satisfies StandardSymbologyKey[]

    const scanner = new SymbologyScanner(mockFn, { symbologies, scannerOptions: { suffix: '\n' } })
    ;[...symbol, 'Enter'].forEach((key) => {
      fireEvent.keyDown(document, { key })
    })

    jest.advanceTimersToNextTimer()

    expect(mockFn).toHaveBeenCalledWith(symbol, symbologies)

    mockFn.mockClear()
    ;[...symbol].forEach((key) => {
      fireEvent.keyDown(document, { key })
    })

    jest.advanceTimersToNextTimer()

    expect(mockFn).not.toHaveBeenCalled()

    scanner.destroy()
  })

  test('should call preventDefault if config.preventDefault is true', () => {
    const mockFn = jest.fn()

    const scanner = new SymbologyScanner(mockFn, { preventDefault: true, eventOptions: { passive: false } })

    const event = createEvent.keyDown(document, { key: 'A' })

    fireEvent(document, event)

    expect(event.defaultPrevented).toBe(true)

    scanner.destroy()
  })

  test('should ignore repeats if config.ignoreRepeats is true', () => {
    const mockFn = jest.fn()

    const scanner = new SymbologyScanner(mockFn, { ignoreRepeats: true })

    for (let i = 0; i < 100; i++) {
      fireEvent.keyDown(document, { key: 'A', repeat: i > 0 })
    }

    jest.advanceTimersToNextTimer()

    expect(mockFn).not.toHaveBeenCalled()

    scanner.destroy()
  })
})
