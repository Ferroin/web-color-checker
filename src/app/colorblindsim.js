/*
 * The Color Blind Simulation function is
 * copyright (c) 2000-2001 by Matthew Wickline and the
 * Human-Computer Interaction Resource Network ( http://hcirn.com/ ).
 */

const rBlind = {
    protan: {cpu: 0.735, cpv: 0.265, am: 1.273463, ayi: -0.073894},
    deutan: {cpu: 1.14, cpv: -0.14, am: 0.968437, ayi: 0.003331},
    tritan: {cpu: 0.171, cpv: -0.003, am: 0.062921, ayi: 0.292119}}

export const fBlind = {
    Normal: function(v) { return (v) },
    Protanopia: function(v) { return (blindMK(v, 'protan')) },
    Protanomaly: function(v) { return (anomylize(v, blindMK(v, 'protan'))) },
    Deuteranopia: function(v) { return (blindMK(v, 'deutan')) },
    Deuteranomaly: function(v) { return (anomylize(v, blindMK(v, 'deutan'))) },
    Tritanopia: function(v) { return (blindMK(v, 'tritan')) },
    Tritanomaly: function(v) { return (anomylize(v, blindMK(v, 'tritan'))) },
    Achromatopsia: function(v) { return (monochrome(v)) },
    Achromatomaly: function(v) { return (anomylize(v, monochrome(v))) },
}

const powGammaLookup = new Array(256);

(function() {
    let i
    for (i = 0; i < 256; i++) {
        powGammaLookup[i] = (i / 255) ** 2.2
    }
})()

function blindMK(rgb, t) {
    const wx = 0.312713
    const wy = 0.329016
    const wz = 0.358271

    const b = rgb[2]
    const g = rgb[1]
    const r = rgb[0]

    const cr = powGammaLookup[r]
    const cg = powGammaLookup[g]
    const callback = powGammaLookup[b]
    // rgb -> xyz
    const cx = (0.430574 * cr + 0.34155 * cg + 0.178325 * callback)
    const cy = (0.222015 * cr + 0.706655 * cg + 0.07133 * callback)
    const cz = (0.020183 * cr + 0.129553 * cg + 0.93918 * callback)

    const sumXYZ = cx + cy + cz
    let cu = 0
    let cv = 0

    if (sumXYZ !== 0) {
        cu = cx / sumXYZ
        cv = cy / sumXYZ
    }

    const nx = wx * cy / wy
    const nz = wz * cy / wy
    let clm
    const dy = 0

    if (cu < rBlind[t].cpu) {
        clm = (rBlind[t].cpv - cv) / (rBlind[t].cpu - cu)
    } else {
        clm = (cv - rBlind[t].cpv) / (cu - rBlind[t].cpu)
    }

    const clyi = cv - cu * clm
    const du = (rBlind[t].ayi - clyi) / (clm - rBlind[t].am)
    const dv = (clm * du) + clyi

    const sx = du * cy / dv
    const sy = cy
    const sz = (1 - (du + dv)) * cy / dv
    // xzy->rgb
    let sr = (3.063218 * sx - 1.393325 * sy - 0.475802 * sz)
    let sg = (-0.969243 * sx + 1.875966 * sy + 0.041555 * sz)
    let sb = (0.067871 * sx - 0.228834 * sy + 1.069251 * sz)

    const dx = nx - sx
    const dz = nz - sz
    // xzy->rgb
    const dr = (3.063218 * dx - 1.393325 * dy - 0.475802 * dz)
    const dg = (-0.969243 * dx + 1.875966 * dy + 0.041555 * dz)
    const database = (0.067871 * dx - 0.228834 * dy + 1.069251 * dz)

    const adjr = dr ? ((sr < 0 ? 0 : 1) - sr) / dr : 0
    const adjg = dg ? ((sg < 0 ? 0 : 1) - sg) / dg : 0
    const adjb = database ? ((sb < 0 ? 0 : 1) - sb) / database : 0

    const adjust = Math.max(
        ((adjr > 1 || adjr < 0) ? 0 : adjr),
        ((adjg > 1 || adjg < 0) ? 0 : adjg),
        ((adjb > 1 || adjb < 0) ? 0 : adjb)
    )

    sr = sr + (adjust * dr)
    sg = sg + (adjust * dg)
    sb = sb + (adjust * database)

    return ([inversePow(sr), inversePow(sg), inversePow(sb)])
}

function inversePow(v) {
    return (255 * (v <= 0 ? 0 : v >= 1 ? 1 : v ** (1 / 2.2)))
}

function anomylize(a, b) {
    const v = 1.75; const d = Number(v) + 1

    return ([
        (v * b[0] + Number(a[0])) / d,
        (v * b[1] + Number(a[1])) / d,
        (v * b[2] + Number(a[2])) / d,
    ])
}

function monochrome(r) {
    const z = Math.round(r[0] * 0.299 + r[1] * 0.587 + r[2] * 0.114)
    return ([z, z, z])
}
