

// if you are using css function with dynamic binding , use camelized function name 

import { isNumber } from "@crush/common"

function completionUnit(value: string | number, unit = '%') {
    return isNumber(value) ? `${value}unit` : value
}

function rgba(...rgba: number[]) {
    return `rgba(${rgba.join(',')})`
}

const rgb = rgba


/*
    in normal css , the saturation and lightness need to endwith % , but we support to use number , and auto fill %
*/
function hsla(h: number, s: number | string, l: number | string, a: number = 1) {
    return `hsla(
        ${h},
        ${completionUnit(s)},
        ${completionUnit(l)},
        ${a}
        )`
}

const hsl = hsla

/*
    var is a keyword in js , use $var instead
    :root{
        --bg:red;
        $--bg2:'blue';
    }
    body{
        background-color:var(--bg);
        $background-color:$var('--bg2');
    }
*/
function $var(variable: string) {
    return `var(${variable})`
}

function attr(attrName: string) {
    return `attr(${attrName})`
}

function calc(exp: string) {
    return `calc(${exp})`
}

function cubicBzier(x1: number, y1: number, x2: number, y2: number) {
    return `cubic-bezier(${x1},${y1},${x2},${y2})`
}


// color gradient

function conicGradient() {

}

function linearGradient() {

}

function radialGradient() {

}

const max = (...items: string[]) => `max(${items.join(',')})`
const min = (...items: string[]) => `min(${items.join(',')})`


/* 对于单位固定的函数只需要 */
function rotateY(deg: number) {

}

function translateX(t: string) {
    return `translateX(${t})`
}

function translateY(t: string) {
    return `translateY(${t})`
}

function scale(sx: number, sy?: number) {
    return 'scale(' + sx + (sy ? `,${sy}` : '') + ')'
}

export  {
    rgba,
    rgb,
    hsl,
    hsla,
    $var,
    attr,
    calc,
    cubicBzier,
    max,
    min,
    translateX,
    translateY,
    scale
}