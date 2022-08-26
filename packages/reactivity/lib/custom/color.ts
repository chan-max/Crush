
const hexColorRE = /^#([0-9a-fA-F]{6})$/
const shortHexColorRE = /^#([0-9a-fA-F]{3})$/

export function isHexColor(color: string) {
    return hexColorRE.test(color.trim())
}

export function isShortHexColor(color: string) {
    return shortHexColorRE.test(color)
}

const rgbColorRE = /^rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)$/

const hslColorRE = /^hsl\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})%\s*,\s*([0-9]{1,3})%\s*\)$/

export function isHslColor(color: string) {
    return hslColorRE.test(color)
}

export function parseHslColor(color: string) {
    let [_, hue, saturation, lightness] = hslColorRE.exec(color) as any
    return {
        hue, saturation, lightness
    }
}

export function parseRgbToBaseColor(color: string) {
    let [_, red, green, blue] = rgbColorRE.exec(color) as any
    return {
        red,
        green,
        blue
    }
}

export function shortHexToHex(color: string) {
    return `#${color[1].repeat(2) + color[2].repeat(2) + color[3].repeat(2)}`
}


export function isRgbColor(color: string) {
    return rgbColorRE.test(color)
}

export function parseHexToBaseColor(hexColor: string) {
    hexColor = hexColor.trim()
    let isShort = hexColor.length === 4
    return {
        red: toDec(isShort ? hexColor[1] : hexColor.slice(1, 3)),
        blue: toDec(isShort ? hexColor[2] : hexColor.slice(3, 5)),
        green: toDec(isShort ? hexColor[3] : hexColor.slice(5, 7)),
    }
}



export function normalizeToHexColor(color: string) {
    if (colors[color]) {
        return colors[color]
    } else if (isHexColor(color)) {
        return color
    } else if (isShortHexColor(color)) {
        return shortHexToHex(color)
    } else if (isRgbColor(color)) {
        return rgbToHex(color)
    } else if (isHslColor(color)) {
        return hslToHex(color)
    } else {
        // 默认
        return '#000000'
    }
}

export function rgbToHex(color: string) {
    let rgb = parseRgbToBaseColor(color)
    return baseRgbToHex(rgb)
}

function baseRgbToHex({ red, green, blue }: any) {
    return '#' + toHex(red) + toHex(green) + toHex(blue)
}

export function hslToHex(color: string) {
    let hsl = parseHslColor(color)
    let rgb = parseHslToRgb(hsl)
    return baseRgbToHex(rgb)
}

export function hexToRgb(color: string) {
    let { red, green, blue } = parseHexToBaseColor(color)
    return `rgb(${red},${green},${blue})`
}

export function hexToHsl(color: string) {
    let rgb = parseHexToBaseColor(color)
    let { hue, saturation, lightness } = parseRgbToHsl(rgb)
    return `hsl(${hue},${saturation}%,${lightness}%)`
}



export const toHex = (num: number | string) => {
    let hex = Number(num).toString(16)
    return hex.length === 1 ? '0' + hex : hex
}

export const toDec = (num: number | string) => parseInt(String(num), 16)

export function parseHslToRgb(hslColor: any) {
    let { hue, saturation, lightness } = hslColor
    hue = hue / 360
    saturation = saturation / 100
    lightness = lightness / 100
    var red, green, blue;

    if (saturation == 0) {
        red = green = blue = lightness;
    } else {
        function t(p: any, q: any, t: any) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        }

        var q = lightness < 0.5 ? lightness * (1 + saturation) : lightness + saturation - lightness * saturation;
        var p = 2 * lightness - q;
        red = t(p, q, hue + 1 / 3);
        green = t(p, q, hue);
        blue = t(p, q, hue - 1 / 3);
    }
    return {
        red: Math.round(red * 255),
        green: Math.round(green * 255),
        blue: Math.round(blue * 255)
    };
}

export function parseRgbToHsl(rgbColor: any) {
    let { red, green, blue } = rgbColor
    red = red / 255
    green = green / 255
    blue = blue / 255

    let max = Math.max(red, green, blue)
    let min = Math.min(red, green, blue)

    let hue, saturation, lightness = 0.5 * (max + min)

    if (max === min) {
        hue = 0
    }

    if (max === red) {
        if (green >= blue) {
            hue = 60 * ((green - blue) / (max - min)) + 0
        } else {
            hue = 60 * ((green - blue) / (max - min)) + 360
        }
    }

    if (max === green) {
        hue = 60 * ((blue - red) / (max - min)) + 120
    }

    if (max === blue) {
        hue = 60 * ((red - green) / (max - min)) + 240
    }

    if (lightness === 0 || max === min) {
        saturation = 0
    } else if (lightness > 0 && lightness <= 0.5) {
        saturation = (max - min) / (2 * lightness)
    } else {
        saturation = (max - min) / (2 - 2 * lightness)
    }

    return {
        hue: Math.floor(hue as number),
        saturation: Math.round(saturation * 100),
        lightness: Math.round(lightness * 100),
    }
}





// name to hex
export const colors: any = {
    'aliceblue': '#f0f8ff',
    'antiquewhite': '#faebd7',
    'aqua': '#00ffff',
    'aquamarine': '#7fffd4',
    'azure': '#f0ffff',
    'beige': '#f5f5dc',
    'bisque': '#ffe4c4',
    'black': '#000000',
    'blanchedalmond': '#ffebcd',
    'blue': '#0000ff',
    'blueviolet': '#8a2be2',
    'brown': '#a52a2a',
    'burlywood': '#deb887',
    'cadetblue': '#5f9ea0',
    'chartreuse': '#7fff00',
    'chocolate': '#d2691e',
    'coral': '#ff7f50',
    'cornflowerblue': '#6495ed',
    'cornsilk': '#fff8dc',
    'crimson': '#dc143c',
    'cyan': '#00ffff',
    'darkblue': '#00008b',
    'darkcyan': '#008b8b',
    'darkgoldenrod': '#b8860b',
    'darkgray': '#a9a9a9',
    'darkgrey': '#a9a9a9',
    'darkgreen': '#006400',
    'darkkhaki': '#bdb76b',
    'darkmagenta': '#8b008b',
    'darkolivegreen': '#556b2f',
    'darkorange': '#ff8c00',
    'darkorchid': '#9932cc',
    'darkred': '#8b0000',
    'darksalmon': '#e9967a',
    'darkseagreen': '#8fbc8f',
    'darkslateblue': '#483d8b',
    'darkslategray': '#2f4f4f',
    'darkslategrey': '#2f4f4f',
    'darkturquoise': '#00ced1',
    'darkviolet': '#9400d3',
    'deeppink': '#ff1493',
    'deepskyblue': '#00bfff',
    'dimgray': '#696969',
    'dimgrey': '#696969',
    'dodgerblue': '#1e90ff',
    'firebrick': '#b22222',
    'floralwhite': '#fffaf0',
    'forestgreen': '#228b22',
    'fuchsia': '#ff00ff',
    'gainsboro': '#dcdcdc',
    'ghostwhite': '#f8f8ff',
    'gold': '#ffd700',
    'goldenrod': '#daa520',
    'gray': '#808080',
    'grey': '#808080',
    'green': '#008000',
    'greenyellow': '#adff2f',
    'honeydew': '#f0fff0',
    'hotpink': '#ff69b4',
    'indianred': '#cd5c5c',
    'indigo': '#4b0082',
    'ivory': '#fffff0',
    'khaki': '#f0e68c',
    'lavender': '#e6e6fa',
    'lavenderblush': '#fff0f5',
    'lawngreen': '#7cfc00',
    'lemonchiffon': '#fffacd',
    'lightblue': '#add8e6',
    'lightcoral': '#f08080',
    'lightcyan': '#e0ffff',
    'lightgoldenrodyellow': '#fafad2',
    'lightgray': '#d3d3d3',
    'lightgrey': '#d3d3d3',
    'lightgreen': '#90ee90',
    'lightpink': '#ffb6c1',
    'lightsalmon': '#ffa07a',
    'lightseagreen': '#20b2aa',
    'lightskyblue': '#87cefa',
    'lightslategray': '#778899',
    'lightslategrey': '#778899',
    'lightsteelblue': '#b0c4de',
    'lightyellow': '#ffffe0',
    'lime': '#00ff00',
    'limegreen': '#32cd32',
    'linen': '#faf0e6',
    'magenta': '#ff00ff',
    'maroon': '#800000',
    'mediumaquamarine': '#66cdaa',
    'mediumblue': '#0000cd',
    'mediumorchid': '#ba55d3',
    'mediumpurple': '#9370d8',
    'mediumseagreen': '#3cb371',
    'mediumslateblue': '#7b68ee',
    'mediumspringgreen': '#00fa9a',
    'mediumturquoise': '#48d1cc',
    'mediumvioletred': '#c71585',
    'midnightblue': '#191970',
    'mintcream': '#f5fffa',
    'mistyrose': '#ffe4e1',
    'moccasin': '#ffe4b5',
    'navajowhite': '#ffdead',
    'navy': '#000080',
    'oldlace': '#fdf5e6',
    'olive': '#808000',
    'olivedrab': '#6b8e23',
    'orange': '#ffa500',
    'orangered': '#ff4500',
    'orchid': '#da70d6',
    'palegoldenrod': '#eee8aa',
    'palegreen': '#98fb98',
    'paleturquoise': '#afeeee',
    'palevioletred': '#d87093',
    'papayawhip': '#ffefd5',
    'peachpuff': '#ffdab9',
    'peru': '#cd853f',
    'pink': '#ffc0cb',
    'plum': '#dda0dd',
    'powderblue': '#b0e0e6',
    'purple': '#800080',
    'rebeccapurple': '#663399',
    'red': '#ff0000',
    'rosybrown': '#bc8f8f',
    'royalblue': '#4169e1',
    'saddlebrown': '#8b4513',
    'salmon': '#fa8072',
    'sandybrown': '#f4a460',
    'seagreen': '#2e8b57',
    'seashell': '#fff5ee',
    'sienna': '#a0522d',
    'silver': '#c0c0c0',
    'skyblue': '#87ceeb',
    'slateblue': '#6a5acd',
    'slategray': '#708090',
    'slategrey': '#708090',
    'snow': '#fffafa',
    'springgreen': '#00ff7f',
    'steelblue': '#4682b4',
    'tan': '#d2b48c',
    'teal': '#008080',
    'thistle': '#d8bfd8',
    'tomato': '#ff6347',
    'turquoise': '#40e0d0',
    'violet': '#ee82ee',
    'wheat': '#f5deb3',
    'white': '#ffffff',
    'whitesmoke': '#f5f5f5',
    'yellow': '#ffff00',
    'yellowgreen': '#9acd32'
};