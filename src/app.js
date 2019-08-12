import {ColorCard} from './app/color-card.js'
import {settings} from './app/settings.js'

settings.init()

const baseColors = new ColorCard(document.querySelector('#baseColors'))

baseColors.bg = '#ffffff'
baseColors.text = '#000000'
