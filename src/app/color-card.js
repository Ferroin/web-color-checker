/* JS code for handling a color card in the theme. */

import {fBlind} from './colorblindsim.js'
import {contrast} from './wcag-sRGB-contrast.js'
import {
    hexToArray,
    arrayToHex,
} from './convert.js'

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

                const removeColor = new CustomEvent('removeColor', {detail: {target: card}})
                document.dispatchEvent(removeColor)
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

        this._cache.bgInput.addEventListener('change', (event) => {
            card.bg = event.target.value
        })

        this._cache.textInput.addEventListener('change', (event) => {
            card.text = event.target.value
        })

        this.update()
    }

    get bg() {
        return this._bg
    }

    set bg(v) {
        if (v !== this._bg) {
            this._bg = v
            this.update()
        }
    }

    get bgDeutan() {
        return arrayToHex(fBlind.Deuteranopia(hexToArray(this._bg)))
    }

    get bgProtan() {
        return arrayToHex(fBlind.Protanopia(hexToArray(this._bg)))
    }

    get bgTritan() {
        return arrayToHex(fBlind.Tritanopia(hexToArray(this._bg)))
    }

    get bgAchromat() {
        return arrayToHex(fBlind.Achromatopsia(hexToArray(this._bg)))
    }

    get text() {
        return this._text
    }

    set text(v) {
        if (v !== this._text) {
            this._text = v
            this.update()
        }
    }

    get textDeutan() {
        return arrayToHex(fBlind.Deuteranopia(hexToArray(this._text)))
    }

    get textProtan() {
        return arrayToHex(fBlind.Protanopia(hexToArray(this._text)))
    }

    get textTritan() {
        return arrayToHex(fBlind.Tritanopia(hexToArray(this._text)))
    }

    get textAchromat() {
        return arrayToHex(fBlind.Achromatopsia(hexToArray(this._text)))
    }

    get contrast() {
        return contrast(
            hexToArray(this.bg),
            hexToArray(this.text),
        )
    }

    get contrastDeutan() {
        return contrast(
            hexToArray(this.bgDeutan),
            hexToArray(this.textDeutan),
        )
    }

    get contrastProtan() {
        return contrast(
            hexToArray(this.bgProtan),
            hexToArray(this.textProtan),
        )
    }

    get contrastTritan() {
        return contrast(
            hexToArray(this.bgTritan),
            hexToArray(this.textTritan),
        )
    }

    get contrastAchromat() {
        return contrast(
            hexToArray(this.bgAchromat),
            hexToArray(this.textAchromat),
        )
    }

    get name() {
        return this._elementCache.name.value
    }

    set name(v) {
        this._elementCache.name.value = v
    }

    update() {
        this._cache.bgInput.value = this.bg
        this._cache.textInput.value = this.text

        for (let i = 0; i < this._cache.samples.length; i++) {
            const element = this._cache.samples[i]

            if (element.matches('.deuteranopia')) {
                element.style['color'] = this.textDeutan
                element.style['background-color'] = this.bgDeutan
                element.innerHTML = `Deuteranopia<br />Contrast ratio: ${this.contrastDeutan.toPrecision(4)}`
            } else if (element.matches('.protanopia')) {
                element.style['color'] = this.textProtan
                element.style['background-color'] = this.bgProtan
                element.innerHTML = `Protanopia<br />Contrast ratio: ${this.contrastProtan.toPrecision(4)}`
            } else if (element.matches('.tritanopia')) {
                element.style['color'] = this.textTritan
                element.style['background-color'] = this.bgTritan
                element.innerHTML = `Tritanopia<br />Contrast ratio: ${this.contrastTritan.toPrecision(4)}`
            } else if (element.matches('.achromat')) {
                element.style['color'] = this.textAchromat
                element.style['background-color'] = this.bgAchromat
                element.innerHTML = `Achromatopsia<br />Contrast ratio: ${this.contrastAchromat.toPrecision(4)}`
            } else {
                element.style['color'] = this.text
                element.style['background-color'] = this.bg
                element.innerHTML = `Normal Vision<br />Contrast ratio: ${this.contrast.toPrecision(4)}`
            }
        }
    }
}
