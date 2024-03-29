

// if you are using css function with dynamic binding , use camelized function name 

import { isNumber, isString } from "@crush/common"


export function toPositiveValue<T>(value: any): any {
    if (isNumber(value)) {
        return value < 0 ? -value : value
    } else {
        return value.startsWith('-') ? value.slice(1) : value
    }
}

export function toNegativeValue(value: any): any {
    if (isNumber(value)) {
        return value > 0 ? -value : value
    } else {
        return value.startsWith('-') ? value : '-' + value
    }
}

export function toAbsoluteValue(value: any): any {
    if (isNumber(value)) {
        return Math.abs(value as number)
    } else {
        return value.startsWith('-') ? value.slice(1) : value
    }
}



function addUnit(value: string | number, unit: string) {
    return isNumber(value) ? `${value + unit}` : value
}



function rgba(...rgba: number[]) {
    return `rgba(${rgba.join(',')})`
}

 function rgb(...rgb: number[]) {
    return `rgb(${rgb.join(',')})`
}


/*
    in normal css , the saturation and lightness need to endwith % , but we support to use number , and auto fill %
*/
function hsla(h: number, s: number | string, l: number | string, a: number = 1) {
    return `hsla(${h},${addUnit(s, '%')},${addUnit(l, '%')},${a})`
}

function hsl(h: number, s: number | string, l: number | string) {
    return `hsl(${h},${addUnit(s, '%')},${addUnit(l, '%')})`
}

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

function cubicBezier(x1: number, y1: number, x2: number, y2: number) {
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



function rotateY(deg: number) {
    return `rotateY(${addUnit(deg, 'deg')})`
}

function translateX(t: string) {
    return `translateX(${t})`
}

function translateY(t: string) {
    return `translateY(${t})`
}

function translate3d(x: string | number, y: string | number, z: string | number) {
    return `translate3d(${x},${y},${z})`
}

function scale(sx: number, sy?: number) {
    return 'scale(' + sx + (sy ? `,${sy}` : '') + ')'
}

function scale3d(sx: number, sy: number, sz: number) {
    return `scale3d(${sx},${sy},${sz})`
}

function rotate3d(x: number, y: number, z: number, a: number | string) {
    return `rotate3d(${x},${y},${z},${addUnit(a, 'deg')})`
}

function rotate(a: number | string) {
    return `rotate(${addUnit(a, 'deg')})`
}

function perspective(l: string) {
    return `perspective(${l})`
}

function skewX(x: number | string) {
    return `skewX(${addUnit(x, 'deg')})`
}

function skewY(y: number | string) {
    return `skewX(${addUnit(y, 'deg')})`
}

function skew(x: number | string, y: number | string) {
    return `skew(${addUnit(x, 'deg')},${addUnit(y, 'deg')})`
}

function scaleY(n: number) {
    return `scaleY(${n})`
}

function scaleX(n: number) {
    return `scaleX(${n})`
}

export {
    rgba,
    rgb,
    hsl,
    hsla,
    $var,
    attr,
    calc,
    cubicBezier,
    max,
    min,
    translateX,
    translateY,
    scale,
    rotate3d,
    translate3d,
    rotate,
    perspective,
    scale3d,
    skew,
    skewX,
    skewY,
    scaleY,
    scaleX,
    rotateY,
    conicGradient,
    linearGradient,
    radialGradient
}