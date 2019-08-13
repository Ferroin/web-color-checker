/*
 * WCAG contrast ration calculation function.
 */

export function contrast(c0, c1) {
    const offset = 0.05
    const luma0 = sRGBRelativeLuminance(c0)
    const luma1 = sRGBRelativeLuminance(c1)

    return luma0 > luma1 ? (luma0 + offset) / (luma1 + offset) : (luma1 + offset) / (luma0 + offset)
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
