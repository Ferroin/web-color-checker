import {ColorCard} from './app/color-card.js'
import {settings} from './app/settings.js'

const colorCards = []

settings.init()

colorCards.push(new ColorCard(document.querySelector('#baseColors')))

document.querySelector('#addColor').addEventListener('click', () => {
    const card = new ColorCard()

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
