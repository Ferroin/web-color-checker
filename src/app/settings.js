/*
 * Handling for app settings.
 */

import {b64} from './b64.js'

export const settings = {
    init() {
        this._form = document.querySelector('#settingsForm')
        this._inputs = this._form.querySelectorAll('input[data-target]')
        this._modal = document.querySelector('#settingsModal')

        Object.defineProperties(this, {
            _showNormal: {
                value: true,
                writable: true,
            },

            _showDeuteranopia: {
                value: true,
                writable: true,
            },

            _showProtanopia: {
                value: true,
                writable: true,
            },

            _showTritanopia: {
                value: true,
                writable: true,
            },

            _showAchromatopsia: {
                value: false,
                writable: true,
            },
        })

        for (let i = 0; i < this._inputs.length; i++) {
            const input = this._inputs[i]
            const target = input.getAttribute('data-target')

            if (input.type === 'checkbox') {
                input.checked = this[target]
            } else {
                input.value = this[target]
            }
        }

        this.sync()

        document.querySelector('#saveSettings').addEventListener('click', () => {
            settings.sync()
            $(settings._modal).modal('hide')
        })

        $(this._modal).on('hidden.bs.modal', () => {
            settings._form.reset()
        })
    },

    get state() {
        let state = 0

        state |= this.showNormal ? 0x01 : 0x00
        state |= this.showDeuteranopia ? 0x02 : 0x00
        state |= this.showProtanopia ? 0x04 : 0x00
        state |= this.showTritanopia ? 0x08 : 0x00
        state |= this.showAchromatopsia ? 0x10 : 0x00

        return b64[state]
    },

    set state(v) {
        const newState = b64.indexOf(v)

        if (newState === -1) return

        this.showNormal = Boolean(newState & 0x01)
        this.showDeuteranopia = Boolean(newState & 0x02)
        this.showProtanopia = Boolean(newState & 0x04)
        this.showTritanopia = Boolean(newState & 0x08)
        this.showAchromatopsia = Boolean(newState & 0x10)
    },

    get showNormal() {
        return this._showNormal
    },

    set showNormal(v) {
        this._showNormal = Boolean(v)

        if (this._showNormal) {
            document.documentElement.classList.remove('hide-normal')
        } else {
            document.documentElement.classList.add('hide-normal')
        }
    },

    get showDeuteranopia() {
        return this._showDeuteranopia
    },

    set showDeuteranopia(v) {
        this._showDeuteranopia = Boolean(v)

        if (this._showDeuteranopia) {
            document.documentElement.classList.remove('hide-deuteranopia')
        } else {
            document.documentElement.classList.add('hide-deuteranopia')
        }
    },

    get showProtanopia() {
        return this._showProtanopia
    },

    set showProtanopia(v) {
        this._showProtanopia = Boolean(v)

        if (this._showProtanopia) {
            document.documentElement.classList.remove('hide-protanopia')
        } else {
            document.documentElement.classList.add('hide-protanopia')
        }
    },

    get showTritanopia() {
        return this._showTritanopia
    },

    set showTritanopia(v) {
        this._showTritanopia = Boolean(v)

        if (this._showTritanopia) {
            document.documentElement.classList.remove('hide-tritanopia')
        } else {
            document.documentElement.classList.add('hide-tritanopia')
        }
    },

    get showAchromatopsia() {
        return this._showAchromatopsia
    },

    set showAchromatopsia(v) {
        this._showAchromatopsia = Boolean(v)

        if (this._showAchromatopsia) {
            document.documentElement.classList.remove('hide-achromat')
        } else {
            document.documentElement.classList.add('hide-achromat')
        }
    },

    sync() {
        for (let i = 0; i < this._inputs.length; i++) {
            const input = this._inputs[i]
            const target = input.getAttribute('data-target')

            if (input.type === 'checkbox') {
                this[target] = input.checked
                input.defaultChecked = this[target]
            } else {
                this[target] = input.value
                input.defaultValue = this[target]
            }
        }

        document.dispatchEvent(new CustomEvent('updateState'))
    },
}
