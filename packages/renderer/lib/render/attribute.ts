
import { emptyObject } from "@crush/common";
import { keyOf, Nodes } from "@crush/const";
import { removeClass, addClass, addEventListener, removeEventListener, setAttribute, removeAttribute } from "../dom";

import { getUnionkeys } from "./common";

export function updateClass(el: any, pClass: any, nClass: any,) {
    pClass ||= emptyObject
    nClass ||= emptyObject
    for (let className of getUnionkeys(pClass, nClass)) {
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
    parseHandlerKey,
    isEvent
} from '../common/event'
import { isReservedProp } from "./common";
import { updateDeclaration } from "./declaration";
import { normalizeClass, normalizeStyle } from "@crush/core";


export function mountAttributes(el: any, props: any) {
    updateAttributes(el, emptyObject, props)
}
export function updateAttributes(el: any, pProps: any, nProps: any) {
    pProps ||= emptyObject
    nProps ||= emptyObject
    for (let propName of getUnionkeys(pProps, nProps)) {
        var pValue = pProps[propName]
        var nValue = nProps[propName]
        if (isEvent(propName)) {
            if (pValue !== nValue) {
                var { event, options } = parseHandlerKey(propName)
                removeEventListener(el, event, pValue, options)
                if (nValue) {
                    addEventListener(el, event, nValue, options)
                }
            }
        } else if (propName === keyOf(Nodes.STYLE)) {
            updateDeclaration(el.style, normalizeStyle(pValue), normalizeStyle(nValue))
        } else if (propName === keyOf(Nodes.CLASS)) {
            updateClass(el, normalizeClass(pValue), normalizeClass(nValue))
        } else if (isReservedProp(propName)) {
  
        } else {
            // attribute
            (pValue !== nValue) && (nValue ? setAttribute(el, propName, nValue) : removeAttribute(el, propName))
        }
    }
}


// unmountAttribute

