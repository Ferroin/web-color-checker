/*
 * Convert between different color formats.
 */

/*
 * Converts from #RRGGBB format to an array of RGB values.
 */
export function hexToArray(color) {
    return [
        parseInt(color.slice(1, 3), 16),
        parseInt(color.slice(3, 5), 16),
        parseInt(color.slice(5, 7), 16),
    ]
}

/*
 * Converts from an array of RGB values to #RRGGBB format.
 */
export function arrayToHex(colorArray) {
    const red = `00${colorArray[0].toString(16)}`.slice(-2)
    const green = `00${colorArray[1].toString(16)}`.slice(-2)
    const blue = `00${colorArray[2].toString(16)}`.slice(-2)

    return `#${red}${green}${blue}`
}

/*
 * Converts from #RRGGBB format to Base64.
 */
export function hexToB64(color) {
    color = hexToArray(color)

    return btoa(`${String.fromCharCode(color[0])}${String.fromCharCode(color[1])}${String.fromCharCode(color[2])}`)
}

/*
 * Convert from Base64 to #RRGGBB format.
 */
export function b64ToHex(color) {
    const string = atob(color)

    return arrayToHex([
        string.charCodeAt(0),
        string.charCodeAt(1),
        string.charCodeAt(2),
    ])
}
