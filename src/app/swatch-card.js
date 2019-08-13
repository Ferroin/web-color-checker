/*
 * Handling for the color comparison cards.
 */

import {types} from './types.js'
import {contrast} from './wcag-sRGB-contrast.js'
import {hexToArray} from './convert.js'

const targets = document.querySelectorAll('#charts > div.card-columns')
const template = document.querySelector('#swatchCard')

export class SwatchCard {
    constructor(color0, color1) {
        const card = this
        const elements = []

        for (const target of targets) {
            target.append(template.content.cloneNode(true))

            const element = target.lastElementChild

            elements.push(element)

            element.querySelector('.swatch-0').addEventListener('click', () => {
                card.color0.element.scrollIntoView(true)
            })

            element.querySelector('.swatch-1').addEventListener('click', () => {
                card.color1.element.scrollIntoView(true)
            })
        }

        Object.defineProperties(this, {
            color0: {
                value: color0,
            },

            color1: {
                value: color1,
            },

            elements: {
                value: elements,
            },
        })

        for (const type of types) {
            Object.defineProperty(this, `contrast${type.shortName}`, {
                get() {
                    return contrast(
                        hexToArray(this.color0[`bg${type.shortName}`]),
                        hexToArray(this.color1[`bg${type.shortName}`]),
                    )
                },
            })
        }

        function updateTrigger() {
            card.update()
        }

        this.color0.element.addEventListener('change', updateTrigger)
        this.color1.element.addEventListener('change', updateTrigger)

        document.querySelector('#colors').leave('.card', (element) => {
            if (element === this.color0.element || element === this.color1.element) {
                this.color0.element.removeEventListener('change', updateTrigger)
                this.color1.element.removeEventListener('change', updateTrigger)

                for (const element of this.elements) {
                    element.remove()
                }
            }
        })

        this.update()
    }

    update() {
        for (const element of this.elements) {
            element.querySelector('.swatch-name').textContent = `${this.color0.name} / ${this.color1.name}`

            for (const type of types) {
                if (element.matches(`.${type.className} .card`)) {
                    element.querySelector('.swatch-contrast').textContent = `Contrast ratio: ${this[`contrast${type.shortName}`].toPrecision(4)}`
                    element.querySelector('.swatch-0').style['background-color'] = this.color0[`bg${type.shortName}`]
                    element.querySelector('.swatch-1').style['background-color'] = this.color1[`bg${type.shortName}`]
                    break
                }
            }
        }
    }
}
