/*
 * Code generation functionality.
 */

function normalize(s) {
    return s.toLowerCase()
        .replace(/ /g, '_')
}

export function generateCSSProperties(items) {
    let ret = ':root {\n'

    const entry = (item) => `    --${normalize(item.name)}: ${item.bg};\n    --${normalize(item.name)}-text: ${item.text};\n`

    for (const item of items) {
        ret = `${ret}${entry(item)}`
    }

    ret = `${ret}}`

    return ret
}

export function generateCSSClasses(items) {
    let ret = ''

    const getClass = (item) => `.${normalize(item.name)} {\n    background-color: ${item.bg};\n    color: ${item.text};\n}\n`

    for (const item of items) {
        ret = `${ret}${getClass(item)}`
    }

    return ret
}

export function generateSASS(items) {
    let ret = '$colors = (\n'

    const getEntry = (item) => `    ${normalize(item.name)}: ${item.bg},\n    ${normalize(item.name)}-text: ${item.text},\n`

    for (const item of items) {
        ret = `${ret}${getEntry(item)}`
    }

    ret = `${ret})`

    return ret
}

export function generateLESS(items) {
    let ret = ''

    const getEntry = (item) => `@${normalize(item.name)}: ${item.bg};\n@${normalize(item.name)}-text: ${item.text};\n`

    for (const item of items) {
        ret = `${ret}${getEntry(item)}`
    }

    return ret
}
