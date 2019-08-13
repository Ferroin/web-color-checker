import {ColorCard} from './app/color-card.js'
import {SwatchCard} from './app/swatch-card.js'
import {settings} from './app/settings.js'
import {
    generateCSSProperties,
    generateCSSClasses,
    generateSASS,
    generateLESS,
} from './app/code.js'

const colorCards = []
const swatchCards = []
const cache = {
    cssPropertiesCode: document.querySelector('#cssPropsData'),
    cssClassesCode: document.querySelector('#cssClassesData'),
    sassCode: document.querySelector('#sassData'),
    lessCode: document.querySelector('#lessData'),
}

function escapeHTML(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

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

$(document.querySelector('#codeModal')).on('show.bs.modal', () => {
    cache.cssPropertiesCode.innerHTML = escapeHTML(generateCSSProperties(colorCards))
    cache.cssClassesCode.innerHTML = escapeHTML(generateCSSClasses(colorCards))
    cache.sassCode.innerHTML = escapeHTML(generateSASS(colorCards))
    cache.lessCode.innerHTML = escapeHTML(generateLESS(colorCards))
})
