
import { emptyObject, hyphenate, isArray } from "@crush/common";

import { removeClass, addClass, addListener, removeListener, setAttribute, removeAttribute } from "../dom";

import { unionkeys } from "./common";



const beoforeClassMountHooks: any = new Set()

export function onBeforeClassMount(hook: any) {
    beoforeClassMountHooks.add(hook)
    return () => {
        beoforeClassMountHooks.delete(hook)
    }
}

export function updateClass(el: Element, pClass: any, nClass: any,) {
    pClass = normalizeClass(pClass)
    nClass = normalizeClass(nClass)
    for (let className of unionkeys(pClass, nClass)) {
        var p = pClass[className]
        var n = nClass[className]

        if (!p === !n) {
            continue
        }

        if (p) {
            removeClass(el, className)
        }

        if (n) {
            for (let beoforeClassMountHook of beoforeClassMountHooks) {
                beoforeClassMountHook(className, el)
            }
            addClass(el, className)
        }
    }
}

export function mountClass(el: Element, _class: any) {
    updateClass(el, emptyObject, _class)
}

export function unmountClass(el: Element) {
    el.className = ''
}



import {
    parseNativeEventName,
    isEvent
} from '../common/event'

import { updateDeclaration } from "./declaration";
import { ComponentInstance, isElementLifecycleHook, normalizeClass, normalizeStyle } from "@crush/core";


export function mountAttributes(el: any, props: any, instance: any = null, isSVG: boolean) {
    updateElementAttributes(el, null, props, instance, isSVG,)
}

export function updateElementAttributes(el: any, pProps: any, nProps: any, instance: any = null, isSVG = false, dynamicProps: any = null) {
    // 如果传了dynamicProps更新即可，没传的话就需要全部更新
    if (!pProps && !nProps) {
        return
    }
    pProps ||= emptyObject
    nProps ||= emptyObject
    for (let propName of (dynamicProps || unionkeys(pProps, nProps))) {

        var pValue = pProps[propName]
        var nValue = nProps[propName]
        switch (propName) {
            case 'style':
                updateDeclaration(el.style, normalizeStyle(pValue), normalizeStyle(nValue))
                break
            case 'class':
            case 'className':
                updateClass(el, pValue, nValue)
                break
            case 'ref':
                if (!instance) {
                    continue
                }
                let refs = instance.refs ||= {}
                if (nValue !== pValue) {
                    pValue && (refs[pValue] = null)
                    nValue && (refs[nValue] = el)
                }
                break
            case 'bind':
                updateElementAttributes(el, pValue, nValue, instance, isSVG)
                break
            default:
                if (propName.startsWith('_')) {
                    // 保留属性
                    continue
                }

                if (isEvent(propName)) {
                    var { event, options } = parseNativeEventName(propName)
                    if (isElementLifecycleHook(event)) {
                        // 生命周期钩子跳过
                        continue
                    }
                    updateNativeEvents(el, event, pValue, nValue, options)
                } else if (propName in el && !isSVG) { // dom props
                    (pValue !== nValue) && (el[propName] = nValue)
                } else {
                    // attribute
                    propName = hyphenate(propName); // 连字符属性
                    (pValue !== nValue) && (nValue ? setAttribute(el, propName, nValue) : removeAttribute(el, propName))
                }
        }
    }
}


// unmountAttribute
import { normalizeHandler } from './componentListener'

/*
    原生侦听器支持一维数组格式，[a,b,c]
*/
function updateNativeEvents(el: HTMLElement, event: string, pHandler: any, nHandler: any, options: any) {
    normalizeHandler(pHandler).forEach((ph: any) => {
        removeListener(el, event, ph, options)
    });
    normalizeHandler(nHandler).forEach((nh: any) => {
        addListener(el, event, nh, options)
    });
}