import {ColorCard} from './app/color-card.js'
import {SwatchCard} from './app/swatch-card.js'
import {settings} from './app/settings.js'

const colorCards = []
const swatchCards = []

settings.init()

colorCards.push(new ColorCard(document.querySelector('#baseColors')))

document.querySelector('#addColor').addEventListener('click', () => {
    const card = new ColorCard()

    for (const color of colorCards) {
        swatchCards.push(new SwatchCard(card, color))
    }

    colorCards.push(card)
    card.element.scrollIntoView(true)
})

document.querySelector('#colors').leave('.card', (element) => {
    let target = null

    for (const card of colorCards) {
        if (card.element === element) {
            target = card
            break
        }
    }

    if (!target) return true

    const index = colorCards.indexOf(target)
    if (index !== -1) colorCards.splice(index, 1)
})

document.querySelector('#charts .type-normal').leave('.card', (element) => {
    let target = null

    for (const card of swatchCards) {
        if (card.elements.contains(element)) {
            target = card
            break
        }
    }

    if (!target) return true

    const index = swatchCards.indexOf(target)
    if (index !== -1) swatchCards.splice(index, 1)
})
