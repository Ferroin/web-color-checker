import {ColorCard} from './app/color-card.js'
import {settings} from './app/settings.js'

const elementCache = {
    colorCardTemplate: document.querySelector('#colorCard'),
    colors: document.querySelector('#colors'),
}
const cards = []

settings.init()

cards.push(new ColorCard(document.querySelector('#baseColors')))

document.querySelector('#addColor').addEventListener('click', () => {
    elementCache.colors.appendChild(elementCache.colorCardTemplate.content.cloneNode(true))

    const target = elementCache.colors.lastElementChild
    const wrapper = new ColorCard(target)

    cards.push(wrapper)

    target.querySelector('.close').addEventListener('click', () => {
        const index = cards.indexOf(wrapper)
        if (index !== -1) cards.splice(index, 1)
        target.remove()
    })
})
