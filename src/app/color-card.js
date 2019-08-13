/* JS code for handling a color card in the theme. */

import {fBlind} from './colorblindsim.js'
import {contrast} from './wcag-sRGB-contrast.js'
import {
    hexToArray,
    arrayToHex,
    hexToB64,
    b64ToHex,
} from './convert.js'
import {types} from './types.js'

const template = document.querySelector('#colorCard')
const colors = document.querySelector('#colors')

export class ColorCard {
    constructor(element) {
        const card = this

        if (!element) {
            colors.append(template.content.cloneNode(true))

            element = colors.lastElementChild

            element.querySelector('.close').addEventListener('click', () => {
                element.remove()
            })
            this.fixed = false
        } else {
            this.fixed = true
        }

        Object.defineProperties(this, {
            _bg: {
                value: '#ffffff',
                writable: true,
            },

            _text: {
                value: '#000000',
                writable: true,
            },

            _cache: {
                value: {
                    bgInput: element.querySelector('.bg-color'),
                    name: element.querySelector('.color-name'),
                    samples: element.querySelectorAll('.sample-text > div'),
                    textInput: element.querySelector('.text-color'),
                },
            },

            element: {
                value: element,
            },
        })

        const bgBaseProperty = `bg${types[0].shortName}`
        const bgHiddenProperty = `_${bgBaseProperty}`
        const textBaseProperty = `text${types[0].shortName}`
        const textHiddenProperty = `_${textBaseProperty}`

        for (const type of types) {
            const bgProperty = `bg${type.shortName}`
            const textProperty = `text${type.shortName}`
            const contrastProperty = `contrast${type.shortName}`

            Object.defineProperties(this, {
                [bgProperty]: {
                    get() {
                        if (type.settable) {
                            return this[bgHiddenProperty]
                        } else {
                            return arrayToHex(fBlind[type.longName](hexToArray(this[bgBaseProperty])))
                        }
                    },
                    set(v) {
                        if (type.settable && v !== this[bgHiddenProperty]) {
                            this[bgHiddenProperty] = v
                            this.update()
                        }
                    },
                },

                [textProperty]: {
                    get() {
                        if (type.settable) {
                            return this[textHiddenProperty]
                        } else {
                            return arrayToHex(fBlind[type.longName](hexToArray(this[textBaseProperty])))
                        }
                    },
                    set(v) {
                        if (type.settable && v !== this[textHiddenProperty]) {
                            this[textHiddenProperty] = v
                            this.update()
                        }
                    },
                },

                [contrastProperty]: {
                    get() {
                        return contrast(
                            hexToArray(this[bgProperty]),
                            hexToArray(this[textProperty]),
                        )
                    },
                },
            })
        }

        this._cache.bgInput.addEventListener('change', (event) => {
            card.bg = event.target.value
            document.dispatchEvent(new CustomEvent('updateState'))
        })

        this._cache.textInput.addEventListener('change', (event) => {
            card.text = event.target.value
            document.dispatchEvent(new CustomEvent('updateState'))
        })

        this._cache.name.addEventListener('change', () => {
            card.element.dispatchEvent(new Event('change'))
            document.dispatchEvent(new CustomEvent('updateState'))
        })

        this.update()
    }

    get name() {
        return this._cache.name.value
    }

    set name(v) {
        this._cache.name.value = v
    }

    get state() {
        const bg = hexToB64(this.bg)
        const text = hexToB64(this.text)

        const state = `${bg}${text}`
            .replace(/\//g, '_')
            .replace(/\+/g, '-')

        return `${state}${this.fixed ? '' : this.name}`
    }

    set state(v) {
        const colors = v.slice(0, 8)
            .replace(/_/g, '/')
            .replace(/-/g, '+')

        this.bg = b64ToHex(colors.slice(0, 4))
        this.text = b64ToHex(colors.slice(4, 8))
        if (!this.fixed) {
            this.name = v.slice(8)
        }
    }

    remove() {
        if (!this.fixed) {
            this.element.remove()
        }
    }

    update() {
        this._cache.bgInput.value = this.bg
        this._cache.textInput.value = this.text

        for (const element of this._cache.samples) {
            for (const type of types) {
                if (element.matches(`.${type.className}`)) {
                    element.style['color'] = this[`text${type.shortName}`]
                    element.style['background-color'] = this[`bg${type.shortName}`]
                    element.innerHTML = `${type.longName}<br />Contrast ratio: ${this[`contrast${type.shortName}`].toPrecision(4)}`
                    break
                }
            }
        }

        this.element.dispatchEvent(new Event('change'))
    }
}
