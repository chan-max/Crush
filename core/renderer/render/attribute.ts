import { Nodes } from "../../const/node";
import { EMPTY_OBJ } from "../../common/value";
import { keyOf } from "../../const/node";
import { nodeOps } from "./nodeOps";

export function updateClass(el: any, pClass: any, nClass: any,) {
    for (let className of unionKeys(pClass, nClass)) {
        var p = pClass[className]
        var n = nClass[className]
        p ? (
            n || nodeOps.removeClass(el, className)
        ) : (
            n && nodeOps.addClass(el, className)
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

function unionKeys(...maps: Record<string, any>[]): string[] {
    var _: Record<string, any> = {}
    for (let i in maps || EMPTY_OBJ) {
        for (let key in maps[i]) {
            _[key] = true
        }
    }
    return Object.keys(_)
}
export function mountAttributes(el: any, props: any) {
    updateAttributes(el, EMPTY_OBJ, props)
}
export function updateAttributes(el: any, pProps: any, nProps: any) {
    for (let propName of unionKeys(pProps, nProps)) {
        var pValue = pProps[propName]
        var nValue = nProps[propName]
        if (isEvent(propName)) {
            if (pValue !== nValue) {
                var { event, options } = parseHandlerKey(propName)
                nodeOps.removeEventListener(el, event, pValue, options)
                if (nValue) {
                    nodeOps.addEventListener(el, event, nValue, options)
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
            (pValue !== nValue) && nValue ? nodeOps.setAttribute(el, propName, nValue) : nodeOps.removeAttribute(el, propName)
        }
    }
}


// unmountAttribute

