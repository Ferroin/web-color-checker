/* JS code for handling a color card in the theme. */

import {fBlind} from './colorblindsim.js'
import {contrast} from './wcag-sRGB-contrast.js'
import {
    hexToArray,
    arrayToHex,
} from './convert.js'

export class ColorCard {
    constructor(element) {
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
                    card: element,
                    bgInput: element.querySelector('.bg-color'),
                    textInput: element.querySelector('.text-color'),
                    samples: element.querySelectorAll('.sample-text > div'),
                },
            },
        })

        const card = this

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

    update() {
        this._cache.bgInput.value = this.bg
        this._cache.textInput.value = this.text

        for (let i = 0; i < this._cache.samples.length; i++) {
            const element = this._cache.samples[i]

            if (element.matches('.deuteranopia')) {
                element.style['color'] = this.textDeutan
                element.style['background-color'] = this.bgDeutan
                element.innerHTML = `Deuteranopia (red-green color blindness)<br />Contrast ratio: ${this.contrastDeutan}`
            } else if (element.matches('.protanopia')) {
                element.style['color'] = this.textProtan
                element.style['background-color'] = this.bgProtan
                element.innerHTML = `Protanopia (red-green color blindness)<br />Contrast ratio: ${this.contrastProtan}`
            } else if (element.matches('.tritanopia')) {
                element.style['color'] = this.textTritan
                element.style['background-color'] = this.bgTritan
                element.innerHTML = `Tritanopia (blue-yellow color blindness)<br />Contrast ratio: ${this.contrastTritan}`
            } else if (element.matches('.achromat')) {
                element.style['color'] = this.textAchromat
                element.style['background-color'] = this.bgAchromat
                element.innerHTML = `Achromatopsia (total color blindness)<br />Contrast ratio: ${this.contrastAchromat}`
            } else {
                element.style['color'] = this.text
                element.style['background-color'] = this.bg
                element.innerHTML = `Normal Vision<br />Contrast ratio: ${this.contrast}`
            }
        }
    }
}
