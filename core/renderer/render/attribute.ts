import { Nodes } from "../../const/node";
import { EMPTY_OBJ } from "../../common/value";
import { keyOf } from "../../const/node";
import { removeClass, addClass, addEventListener, removeEventListener, setAttribute, removeAttribute } from "../dom";

import { unionKeys } from "./common";

export function updateClass(el: any, pClass: any, nClass: any,) {
    pClass ||= EMPTY_OBJ
    nClass ||= EMPTY_OBJ
    for (let className of unionKeys(pClass, nClass)) {
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
    updateClass(EMPTY_OBJ, _class, el)
}

export function unmountClass(el: HTMLElement) {
    el.className = ''
}



import {
    parseHandlerKey,
    isEvent
} from '../common/event'
import { getReservedProp, isReservedProp } from "./common";
import { updateDeclaration } from "./declaration";


export function mountAttributes(el: any, props: any) {
    updateAttributes(el, EMPTY_OBJ, props)
}
export function updateAttributes(el: any, pProps: any, nProps: any) {
    pProps ||= EMPTY_OBJ
    nProps ||= EMPTY_OBJ
    for (let propName of unionKeys(pProps, nProps)) {
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
            updateDeclaration(el, pValue, nValue)
        } else if (propName === keyOf(Nodes.CLASS)) {
            updateClass(el, pValue, nValue)
        } else if (isReservedProp(propName)) {
            debugger
        } else {
            // attribute
            (pValue !== nValue) && nValue ? setAttribute(el, propName, nValue) : removeAttribute(el, propName)
        }
    }
}


// unmountAttribute

