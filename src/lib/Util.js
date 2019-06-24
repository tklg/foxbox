import colorContrast from 'color-contrast'

// https://gist.github.com/hteumeuleu/51b5a8ea95cb47e344b0cb47bc1f2289#file-darkmodehandler-ts-L131
function fixContrast (color, comparisonColor, bgColor) {
  const baseLValue = rgb2hsl(...hex2rgb(bgColor))[2]
  const ceilingDarkLValue = 50 // values above this can't contrast against 100
  const floorLightLValue = 50 + baseLValue // values below this can't contrast against baseLValue
  const midpointLValue = (floorLightLValue + ceilingDarkLValue) / 2

  const comparisonLValue = rgb2hsl(...hex2rgb(comparisonColor))[2]

  const c = rgb2hsl(...hex2rgb(color))

  let newLValue = c[2] * ((100 - baseLValue) / 100) + baseLValue

  if (comparisonLValue > midpointLValue) {
    // comparisonLValue isLight, newLValue should isDark
    newLValue = Math.min(newLValue, 2 * midpointLValue - newLValue)
    newLValue = ((newLValue - baseLValue) * (ceilingDarkLValue - baseLValue)) / (midpointLValue - baseLValue) + baseLValue
  } else {
    // comparisonLValue isDark, newLValue should isLight
    newLValue = Math.max(newLValue, 2 * midpointLValue - newLValue)
    newLValue = 100 - ((100 - newLValue) * (100 - floorLightLValue)) / (100 - midpointLValue)
  }
  return hsl2rgb(c[0], c[1], newLValue)
}

function validContrast (color, bg) {
  return colorContrast(color, bg) >= 7
}

function findAndFixColors (html, bg) {
  return html.replace(/color:\s*(.+?)([;"'])/g, function (matched, match, end) {
    if (/#\d{3}\d{3}?/.test(match)) {
      if (!validContrast(match, bg)) {
        return `color:rgb(${fixContrast(match, bg, bg).join(',')})${end}`
      } else return matched
    } else if (/rgb\(\d+,\s*\d+,\s*\d+\)/.test(match)) {
      const m = /rgb\((\d+),\s*(\d+),\s*(\d+)\)/.exec(match)
      const hex = rgb2hex(m[1], m[2], m[3])
      if (!validContrast(hex, bg)) {
        return `color:rgb(${fixContrast(hex, bg, bg).join(',')})${end}`
      } else return matched
    } else {
      return matched
    }
  })
}

function rgb2hsl (r, g, b) {
  r /= 255
  g /= 255
  b /= 255

  let cmin = Math.min(r, g, b)
  let cmax = Math.max(r, g, b)
  let delta = cmax - cmin
  let h = 0
  let s = 0
  let l = 0

  if (delta === 0) h = 0
  else if (cmax === r) h = ((g - b) / delta) % 6
  else if (cmax === g) h = (b - r) / delta + 2
  else { h = (r - g) / delta + 4 }

  h = Math.round(h * 60)
  if (h < 0) { h += 360 }

  l = (cmax + cmin) / 2
  s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1))

  s = +(s * 100).toFixed(1)
  l = +(l * 100).toFixed(1)

  return [h, s, l]
}

function hsl2rgb (h, s, l) {
  s /= 100
  l /= 100

  let c = (1 - Math.abs(2 * l - 1)) * s
  let x = c * (1 - Math.abs((h / 60) % 2 - 1))
  let m = l - c / 2
  let r = 0
  let g = 0
  let b = 0

  if (h >= 0 && h < 60) {
    r = c; g = x; b = 0
  } else if (h >= 60 && h < 120) {
    r = x; g = c; b = 0
  } else if (h >= 120 && h < 180) {
    r = 0; g = c; b = x
  } else if (h >= 180 && h < 240) {
    r = 0; g = x; b = c
  } else if (h >= 240 && h < 300) {
    r = x; g = 0; b = c
  } else if (h >= 300 && h < 360) {
    r = c; g = 0; b = x
  }
  r = Math.round((r + m) * 255)
  g = Math.round((g + m) * 255)
  b = Math.round((b + m) * 255)

  return [r, g, b]
}

function hex2rgb (h) {
  let r = 0
  let g = 0
  let b = 0

  if (h.length === 4) {
    r = '0x' + h[1] + h[1]
    g = '0x' + h[2] + h[2]
    b = '0x' + h[3] + h[3]
  } else if (h.length === 7) {
    r = '0x' + h[1] + h[2]
    g = '0x' + h[3] + h[4]
    b = '0x' + h[5] + h[6]
  }
  return [r, g, b]
}

function rgb2hex (r, g, b) {
  r = r.toString(16)
  g = g.toString(16)
  b = b.toString(16)

  if (r.length === 1) r = '0' + r
  if (g.length === 1) g = '0' + g
  if (b.length === 1) b = '0' + b

  return '#' + r + g + b
}

export {
  findAndFixColors
}
