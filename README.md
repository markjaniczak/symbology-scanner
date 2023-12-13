# @use-symbology-scanner

## Table of contents
- [Table of contents](#table-of-contents)
- [Introduction](#introduction)
- [Installation](#installation)
- [Usage](#usage)
- [Options](#options)
- [Symbologies](#symbologies)
    - [Standard Symbologies](#standard-symbologies)
    - [Custom Symbologies](#custom-symbologies)
- [Supported hardware](#supported-hardware)
- [Contributing](#contributing)
    - [Development](#development)
    - [Testing](#testing)
    - [Releasing](#releasing)
- [License](#license)

## Introduction

This package provides a simple way to listen for scanner input in the browser. It works by listening for `keydown` events and matching the input against a set of [symbologies](#symbologies).

## Installation

This package comes in two flavours; `react` and `vanilla`. The `react` package is a wrapper around the `vanilla` package that provides a React hook for listening to scanner input.

### Vanilla
```bash
npm install @use-symbology-scanner/vanilla
yarn add @use-symbology-scanner/vanilla
pnpm add @use-symbology-scanner/vanilla
```

### React
```bash
npm install @use-symbology-scanner/react
yarn add @use-symbology-scanner/react
pnpm add @use-symbology-scanner/react
```

## Usage

<details>
<summary>React</summary>

```jsx
import { useSymbologyScanner } from '@use-symbology-scanner/react';

export const App = () => {
    const ref = useRef(null)

    const handleSymbol = (symbol, matchedSymbologies) => {
        console.log(`Scanned ${symbol}`)
    }

    useSymbologyScanner(handleSymbol, { target: ref })

    return (
        <div ref={ref}>
        </div>
    )
}
```

</details>

<br/>

<details>
<summary>Vanilla</summary>

```html
<!-- index.html -->
<div id="el"></div>
```

```js
// script.js
const el = document.getElementById('id')

const handleSymbol = (symbol, matchedSymbologies) => {
    console.log(`Scanned ${symbol}`)
}

const scanner = new SymbologyScanner(handleSymbol, {}, el)

scanner.destroy() // clean up listeners
```

</details>

## Options

| Property | Type | Description | Default Value |
| --- | --- | --- | --- |
| target | EventTarget | DOM element to listen for keydown events in. | `window.document` |
| symbologies | Array<[Symbology](#symbology), StandardSymbologyKey> | Symbologies to match against. | [`STANDARD_SYMBOLOGIES`]((#standard-symbologies)) |
| enabled | boolean | Whether or not the scanner is enabled. | `true` |
| eventOptions | object | Options to pass to the `addEventListener` call. | `{ capture: false, passive: true }` |
| preventDefault | boolean | Whether or not to call `preventDefault` on the event. | `false` |
| ignoreRepeats | boolean | Whether or not to ignore repeated keydown events. | `true` |
| scannerOptions | object | Options that describe the behaviour of the hardware scanner. | `{ prefix: '', suffix: '', maxDelay: 20 }` |

## Symbologies

A Symbology is a defined method of representing numeric or alphabetic digits using bars and spaces that are easily scanned by computer systems. By default, all of the standard symbologies in the [table below](#standard-symbologies) are matched against the input.

### Standard Symbologies

| Symbology | Allowed Characters | Min Length | Max Length |
| --- | --- | --- | --- |
| UPC-A | `0-9` | `12` | `12` |
| UPC-E | `0-9` | `6` | `6` |
| EAN-8 | `0-9` | `8` | `8` |
| EAN 13 | `0-9` | `13` | `13` |
| Codabar | `0-9`, `-`, `.`, `$`, `:`, `/`, `+` | `4` | |
| Code 11 | `0-9`, `-` | `4` | |
| Code 39 | `0-9`, `A-Z`, ` `, `$`, `%`, `*`, `+`, `-`, `.`, `/` | `1` | |
| Code 93 | `0-9`, `A-Z`, ` `, `$`, `%`, `+`, `-`, `.` | `1` | |
| Code 128 | `0-9`, `A-Z`, ` `, `$`, `%`, `*`, `+`, `-`, `.`, `/` | `1` | |
| Code 25 Interleaved | `0-9` | `1` | |
| Code 25 Industrial | `0-9` | `1` | |
| MSI Code | `0-9` | `1` | |
| QR Code | `0-9`, `A-Z`, ` `, `$`, `%`, `*`, `+`, `-`, `.`, `/`, `:` | `1` | |
| PDF417 | `0-9`, `A-Z`, ` `, `$`, `%`, `*`, `+`, `-`, `.`, `/`, `:` | `1` | |
| Data Matrix | `0-9`, `A-Z`, ` `, `$`, `%`, `*`, `+`, `-`, `.`, `/`, `:` | `1` | |
| Aztec | `0-9`, `A-Z`, ` `, `$`, `%`, `*`, `+`, `-`, `.`, `/`, `:` | `1` | |
| Dot Code | `0-9`, `A-Z`, ` `, `$`, `%`, `*`, `+`, `-`, `.`, `/`, `:` | `1` | |

In order to only match against a subset of the standard symbologies, you can pass in an array of symbologies to the `symbologies` option:

```jsx
import { STANDARD_SYMBOLOGY_KEYS } from '@use-symbology-scanner/core';

const symbologies = [
    STANDARD_SYMBOLOGY_KEYS['EAN-8'],
    STANDARD_SYMBOLOGY_KEYS['EAN-13'],
]
```

Missing a common symbology or an issue with one of the standard symbologies? Feel free to open an issue or a pull request. Alternatively, you can define your own custom symbologies.

### Custom Symbologies

You can also define your own custom symbologies to match against the input.

| Property | Type | Description |
| --- | --- | --- |
| name | string | Name of the symbology. |
| allowedCharacters | RegExp | Allowed characters in the symbology. |
| minLength | number | Minimum length of the symbology. |
| maxLength | number | Maximum length of the symbology. |

`allowedCharacters` must only contain a character class. For example, `[0-9]` is valid, but `0-9` is not. You can define a custom symbology like so:

```js
import { Symbology } from '@use-symbology-scanner/core';

const customSymbology = new Symbology({
    name: 'Custom Symbology',
    allowedCharacters: '[0-9]',
    minLength: 1,
    maxLength: 10
})
```

## Supported hardware
This library has not yet been tested on any hardware. If you have a scanner that you would like to test this library with, please open an issue or a pull request. Generally, this library *should* work with any hardware that emits keydown events. You can tweak the `scannerOptions` to match the behaviour of your hardware. For example, if your scanner emits a newline character after each scan, you can configure the `scannerOptions` like so:

```js
const scannerOptions = {
    prefix: '',
    suffix: '\n',
    maxDelay: 20
}
```

Bluetooth scanners may require a longer `maxDelay` value due to latency. If you are using a bluetooth scanner, try increasing the `maxDelay` value to `100` or `200`.

## Contributing

### Development

```bash
git clone
cd @use-symbology-scanner/core
yarn install
yarn build
```

### Testing

```bash
yarn test
```

## License
MIT
