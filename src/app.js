import {ColorCard} from './app/color-card.js'
import {SwatchCard} from './app/swatch-card.js'
import {settings} from './app/settings.js'
import {
    generateCSSProperties,
    generateCSSClasses,
    generateSASS,
    generateLESS,
} from './app/code.js'

let colorCards = []
const swatchCards = []
const cache = {
    cssPropertiesCode: document.querySelector('#cssPropsData'),
    cssClassesCode: document.querySelector('#cssClassesData'),
    sassCode: document.querySelector('#sassData'),
    lessCode: document.querySelector('#lessData'),
}

function applyState() {
    const fragment = window.location.hash.slice(1).split(';')

    if (fragment.length <= 0) {
        settings.state = settings.default
    } else {
        settings.state = fragment[0]
    }

    for (const card of colorCards) {
        card.remove()
    }

    colorCards = []
    colorCards.push(new ColorCard(document.querySelector('#baseColors')))

    if (fragment.length > 1) {
        let first = true

        for (const state of fragment.slice(1)) {
            if (state === '') continue

            if (first) {
                colorCards[0].state = state
                first = false
            } else {
                const card = new ColorCard()

                for (const color of colorCards) {
                    swatchCards.push(new SwatchCard(card, color))
                }

                colorCards.push(card)
                card.state = state
            }
        }
    }
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

document.querySelector('#addColor').addEventListener('click', () => {
    const card = new ColorCard()

    for (const color of colorCards) {
        swatchCards.push(new SwatchCard(card, color))
    }

    colorCards.push(card)
    card.element.scrollIntoView(true)

    document.dispatchEvent(new CustomEvent('updateState'))
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

    document.dispatchEvent(new CustomEvent('updateState'))
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

document.addEventListener('updateState', () => {
    let fragment = `#${settings.state};`

    for (const card of colorCards) {
        fragment = `${fragment}${card.state};`
    }

    history.pushState(null, '', fragment)
})

window.addEventListener('popstate', () => {
    applyState()
})

window.addEventListener('hashchange', () => {
    applyState()
})

applyState()
