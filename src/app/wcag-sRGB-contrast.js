/*
 * WCAG contrast ration calculation function.
 */

export function contrast(c0, c1) {
    const offset = 0.05

    return (sRGBRelativeLuminance(c0) + offset) / (sRGBRelativeLuminance(c1) + offset)
}

function sRGBRelativeLuminance(color) {
    const threshold = 0.03928
    const low = (x) => x / 12.92
    const high = (x) => ((x + 0.055) / 1.055) ** 2.4
    const coefficients = [
        0.2126,
        0.7152,
        0.0722,
    ]
    const colorValues = [
        color[0],
        color[1],
        color[2],
    ]

    for (let i = 0; i < 3; i++) {
        colorValues[i] = colorValues[i] / 255
        colorValues[i] = colorValues[i] <= threshold ? low(colorValues[i]) : high(colorValues[i])
    }

    return colorValues.reduce((accumulator, value, index) => {
        accumulator += (coefficients[index] * value)
        return accumulator
    }, 0)
}
