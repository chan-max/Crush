
import { emptyObject, isArray } from "@crush/common";
import { keyOf, Nodes } from "@crush/const";
import { removeClass, addClass, addEventListener, removeEventListener, setAttribute, removeAttribute } from "../dom";

import { unionkeys } from "./common";

export function updateClass(el: any, pClass: any, nClass: any,) {
    pClass ||= emptyObject
    nClass ||= emptyObject
    for (let className of unionkeys(pClass, nClass)) {
        var p = pClass[className]
        var n = nClass[className]
        p ? (
            n || removeClass(el, className)
        ) : (
            n && addClass(el, className)
        )
    }
}

export function mountClass(_class: any, el: HTMLElement) {
    updateClass(emptyObject, _class, el)
}

export function unmountClass(el: HTMLElement) {
    el.className = ''
}



import {
    parseNativeEventName,
    isEvent
} from '../common/event'

import { updateDeclaration } from "./declaration";
import { normalizeClass, normalizeStyle } from "@crush/core";


export function mountAttributes(el: any, props: any,isSVG:boolean) {
    updateAttributes(el, emptyObject, props,isSVG)
}

export function updateAttributes(el: any, pProps: any, nProps: any,isSVG = false) {
    pProps ||= emptyObject
    nProps ||= emptyObject
    for (let propName of unionkeys(pProps, nProps)) {
        var pValue = pProps[propName]
        var nValue = nProps[propName]
        if (propName.startsWith('_')) {
            // 保留属性
        } else if (isEvent(propName)) {
            var { event, options } = parseNativeEventName(propName)
            updateNativeEvents(el, event, pValue, nValue, options)
        } else if (propName === keyOf(Nodes.STYLE)) {
            updateDeclaration(el.style, normalizeStyle(pValue), normalizeStyle(nValue))
        } else if (propName === keyOf(Nodes.CLASS)) {
            updateClass(el, normalizeClass(pValue), normalizeClass(nValue))
        } else if (propName in el) { // dom props
            (pValue !== nValue) && (el[propName] = nValue)
        } else {
            // attribute
            (pValue !== nValue) && (nValue ? setAttribute(el, propName, nValue) : removeAttribute(el, propName))
        }
    }
}


// unmountAttribute
import { arrayHandler } from './componentListener'

/*
    原生侦听器支持一维数组格式，[a,b,c]
*/
function updateNativeEvents(el: HTMLElement, event: string, pHandler: any, nHandler: any, options: any) {
    arrayHandler(pHandler).forEach((ph: any) => {
        removeEventListener(el, event, ph, options)
    });
    arrayHandler(nHandler).forEach((nh: any) => {
        addEventListener(el, event, nh, options)
    });
}