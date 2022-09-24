
import { emptyObject, hyphenate, isArray } from "@crush/common";

import { removeClass, addClass, addListener, removeListener, setAttribute, removeAttribute } from "../dom";

import { unionkeys } from "./common";

// unmountAttribute
import { normalizeHandler } from './componentListener'

const beforeClassMountHooks: any = new Set()

export function onBeforeClassMount(hook: any) {
    beforeClassMountHooks.add(hook)
    return () => {
        beforeClassMountHooks.delete(hook)
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
            for (let beoforeClassMountHook of beforeClassMountHooks) {
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
    parseEventName,
    isEvent,
    isInlineEvent,
    parsePropertyName
} from '../common/property'

import { updateDeclaration } from "./declaration";
import { isElementLifecycleHook, normalizeClass, normalizeStyle } from "@crush/core";


export function mountAttributes(el: any, props: any, instance: any = null, isSVG: boolean) {
    updateElementAttributes(el, null, props, instance, isSVG)
}

import { withEventModifiers } from "../common/property";



export function updateElementAttributes(
    el: any,
    pProps: any,
    nProps: any,
    instance: any = null,
    isSVG = false,
    dynamicProps: any = null, // 标记动态的props，如果传入，只更新 dynamicProps
) {
    // 如果传了dynamicProps更新即可，没传的话就需要全部更新
    if (!pProps && !nProps) {
        return
    }
    pProps ||= emptyObject
    nProps ||= emptyObject
    for (let prop of (dynamicProps || unionkeys(pProps, nProps))) {
        var pValue = pProps[prop]
        var nValue = nProps[prop]
        switch (prop) {
            case 'style':
                updateDeclaration(el.style, normalizeStyle(pValue), normalizeStyle(nValue))
                break
            case 'class':
                updateClass(el, pValue, nValue)
                break
            case 'ref':
                if (instance) {
                    let refs = instance.refs ||= {}
                    if (nValue !== pValue) {
                        pValue && (refs[pValue] = null)
                        nValue && (refs[nValue] = el)
                    }
                }
                break
            default:
                if (prop.startsWith('_')) {
                    // 保留属性
                    continue
                } else if (isEvent(prop)) {
                    if (pValue === nValue) {
                        continue
                    }

                    const { event, _arguments, modifiers, filters } = parseEventName(prop)

                    if (isElementLifecycleHook(event)) {
                        // 生命周期钩子跳过
                        continue
                    }

                    // window 修饰符
                    el = modifiers && modifiers.includes('window') ? window : el

                    let options = {
                        once: modifiers && modifiers.includes('once'),
                        capture: modifiers && modifiers.includes('capture'),
                        passive: modifiers && modifiers.includes('passive')
                    }
                    let pHandler = normalizeHandler(pValue)
                    let nHandler = normalizeHandler(nValue)
                    // 保留原始事件和
                    let handlerMap = el._rawHandlerToModifiedHandler ||= new Map()

                    pHandler.forEach((handler: any) => {
                        if (!nHandler.includes(handler)) {
                            // remove
                            removeListener(el, event, el._rawHandlerToModifiedHandler.get(handler), options)
                        }
                    });
                    nHandler.forEach((handler: any) => {
                        if (!pHandler.includes(handler)) {
                            // add
                            let modifiedHandler = modifiers ? withEventModifiers(handler, modifiers) : handler
                            handlerMap.set(handler, modifiedHandler)
                            addListener(el, event, modifiedHandler, options)
                        }
                    });
                } else if (prop.startsWith('class')) {
                    debugger
                    // responsive layout
                } else {
                    // prop
                    let { property, _arguments, modifiers, filters } = parsePropertyName(prop)

                    let { prop: asProp, attr: asAttr } = modifiers

                    if (asProp) {
                        updateAsProperty(el, property, pValue, nValue)
                    } else if (asAttr) {
                        updateAsAttribute(el, property, pValue, nValue)
                    } else if (isSVG) {
                        updateAsAttribute(el, property, pValue, nValue)
                    } else if (prop in el) {
                        updateAsProperty(el, property, pValue, nValue)
                    } else {
                        updateAsAttribute(el, property, pValue, nValue)
                    }

                }
        }
    }
}


function updateAsAttribute(el: any, property: any, pValue: any, nValue: any) {
    property = hyphenate(property); // 连字符属性
    if (pValue !== nValue) {
        if (nValue) {
            setAttribute(el, property, nValue)
        } else if (pValue) {
            removeAttribute(el, property)
        }
    }
}

function updateAsProperty(el: any, property: any, pValue: any, nValue: any) {
    if (nValue !== pValue) {
        el[property] = nValue
    }
}