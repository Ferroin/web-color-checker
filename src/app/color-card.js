/* JS code for handling a color card in the theme. */

import {fBlind} from './colorblindsim.js'
import {contrast} from './wcag-sRGB-contrast.js'
import {
    hexToArray,
    arrayToHex,
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

        const bgBaseProp = `bg${types[0].shortName}`
        const bgHiddenProp = `_${bgBaseProp}`
        const textBaseProp = `text${types[0].shortName}`
        const textHiddenProp = `_${textBaseProp}`

        for (let i = 0; i < types.length; i++) {
            const bgProp = `bg${types[i].shortName}`
            const textProp = `text${types[i].shortName}`
            const contrastProp = `contrast${types[i].shortName}`

            Object.defineProperties(this, {
                [bgProp]: {
                    get() {
                        if (types[i].settable) {
                            return this[bgHiddenProp]
                        } else {
                            return arrayToHex(fBlind[types[i].longName](hexToArray(this[bgBaseProp])))
                        }
                    },
                    set(v) {
                        if (types[i].settable && v !== this[bgHiddenProp]) {
                            this[bgHiddenProp] = v
                            this.update()
                        }
                    },
                },

                [textProp]: {
                    get() {
                        if (types[i].settable) {
                            return this[textHiddenProp]
                        } else {
                            return arrayToHex(fBlind[types[i].longName](hexToArray(this[textBaseProp])))
                        }
                    },
                    set(v) {
                        if (types[i].settable && v !== this[textHiddenProp]) {
                            this[textHiddenProp] = v
                            this.update()
                        }
                    },
                },

                [contrastProp]: {
                    get() {
                        return contrast(
                            hexToArray(this[bgProp]),
                            hexToArray(this[textProp]),
                        )
                    },
                },
            })
        }

        this._cache.bgInput.addEventListener('change', (event) => {
            card.bg = event.target.value
            card.element.dispatchEvent(new Event('change'))
        })

        this._cache.textInput.addEventListener('change', (event) => {
            card.text = event.target.value
            card.element.dispatchEvent(new Event('change'))
        })

        this._cache.name.addEventListener('change', () => {
            card.element.dispatchEvent(new Event('change'))
        })

        this.update()
    }

    get name() {
        return this._cache.name.value
    }

    set name(v) {
        this._cache.name.value = v
    }

    update() {
        this._cache.bgInput.value = this.bg
        this._cache.textInput.value = this.text

        for (let i = 0; i < this._cache.samples.length; i++) {
            const element = this._cache.samples[i]

            for (let j = 0; j < types.length; j++) {
                if (element.matches(`.${types[j].className}`)) {
                    element.style['color'] = this[`text${types[j].shortName}`]
                    element.style['background-color'] = this[`bg${types[j].shortName}`]
                    element.innerHTML = `${types[j].longName}<br />Contrast ratio: ${this[`contrast${types[j].shortName}`].toPrecision(4)}`
                    break
                }
            }
        }
    }
}
