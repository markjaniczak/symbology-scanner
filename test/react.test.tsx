import React from 'react'
import { render, screen, fireEvent, act, createEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Interactive } from './Interactive'
import { StandardSymbologyKey } from '@use-symbology-scanner/core/src/symbologies'

jest.useFakeTimers()

describe('controller', () => {
  test('should call the handler on a scanned symbol', () => {
    const mockFn = jest.fn()

    render(<Interactive handler={mockFn} />)

    ;[
      '1',
      '2',
      '3',
      '4',
      'Escape',
      '5',
      '6',
      '7',
      '8',
      '9',
      '0',
      'Shift',
      '1',
      '2',
      '3'
    ].forEach((key) => {
      fireEvent.keyDown(screen.getByTestId('test-el'), { key })
    })

    act(() => {
      jest.advanceTimersToNextTimer()
    })

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
  })

  test('should only accept configured symbologies', () => {
    const mockFn = jest.fn()

    render(<Interactive handler={mockFn} config={{ symbologies: ['EAN 8'] }} />)

    'https://test.com/test?key=value#anchor'.split('').forEach((key) => {
      fireEvent.keyDown(screen.getByTestId('test-el'), { key })
    })

    act(() => {
      jest.advanceTimersToNextTimer()
    })

    expect(mockFn).not.toHaveBeenCalled()
  })

  test('should check for a scanner prefix', () => {
    const mockFn = jest.fn()

    const symbol = '12345678'
    const symbologies = ['EAN 8'] satisfies StandardSymbologyKey[]

    render(<Interactive handler={mockFn} config={{ symbologies, scannerOptions: { prefix: '\t' } }} />)
    ;['Tab', ...symbol].forEach((key) => {
      fireEvent.keyDown(screen.getByTestId('test-el'), { key })
    })

    act(() => {
      jest.advanceTimersToNextTimer()
    })

    expect(mockFn).toHaveBeenCalledWith(symbol, symbologies)

    mockFn.mockClear()
    ;[...symbol].forEach((key) => {
      fireEvent.keyDown(screen.getByTestId('test-el'), { key })
    })

    act(() => {
      jest.advanceTimersToNextTimer()
    })

    expect(mockFn).not.toHaveBeenCalled()
  })

  test('should check for a scanner suffix', () => {
    const mockFn = jest.fn()

    const symbol = '12345678'
    const symbologies = ['EAN 8'] satisfies StandardSymbologyKey[]

    render(<Interactive handler={mockFn} config={{ symbologies, scannerOptions: { suffix: '\n' } }} />)
    ;[...symbol, "Enter"].forEach((key) => {
      fireEvent.keyDown(screen.getByTestId('test-el'), { key })
    })

    act(() => {
      jest.advanceTimersToNextTimer()
    })

    expect(mockFn).toHaveBeenCalledWith(symbol, symbologies)

    mockFn.mockClear()
    ;[...symbol].forEach((key) => {
      fireEvent.keyDown(screen.getByTestId('test-el'), { key })
    })

    act(() => {
      jest.advanceTimersToNextTimer()
    })

    expect(mockFn).not.toHaveBeenCalled()
  })

  test('should call preventDefault if config.preventDefault is true', () => {
    const mockFn = jest.fn()

    render(<Interactive handler={mockFn} config={{ preventDefault: true, eventOptions: { passive: false } }} />)

    const el = screen.getByTestId('test-el')

    const event = createEvent.keyDown(el, { key: 'A' })

    fireEvent(el, event)

    expect(event.defaultPrevented).toBe(true)
  })

  test('should ignore repeats if config.ignoreRepeats is true', () => {
    const mockFn = jest.fn()

    render(<Interactive handler={mockFn} config={{ ignoreRepeats: true }} />)

    for (let i = 0; i < 100; i++) {
      fireEvent.keyDown(screen.getByTestId('test-el'), { key: 'A', repeat: i > 0 })
    }

    act(() => {
      jest.advanceTimersToNextTimer()
    })

    expect(mockFn).not.toHaveBeenCalled()
  })
})
