import { isNumber } from '../shared/dataType'

function rgb(red: number, green: number, blue: number) {
    return `rgb(${red},${green},${blue})`
}

function rgba(red: number, green: number, blue: number, opacity: number) {
    return `rgba(${red},${green},${blue},${opacity})`
}

function hsl(hue: number, saturation: number | string, lightness: number | string) {
    return `hsl(${hue},${isNumber(saturation) ? saturation + '%' : saturation},${isNumber(lightness) ? lightness + '%' : lightness})`
}

function url(url: string) {
    return `url(${url})`
}

export {
    rgb, rgba, hsl
}