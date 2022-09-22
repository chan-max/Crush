import { Nodes } from '@crush/const'

export type DirectiveType = {
    beforeCreate?: Function
    created?: Function
    beforeMount?: Function
    mounted?: Function
    beforeUpdate?: Function
    updated?: Function
    beforeUnmount?: Function
    unmounted?: Function
    // dom el only
    childrenMounted?: Function
} | Function


import {
    LifecycleHooks
} from './lifecycle'

import { isFunction, emptyArray, emptyObject, initialUpperCase } from '@crush/common'
import { callHook } from './lifecycle'
import { normalizeHandler } from '@crush/renderer'
/* 
    pervious 节点存在一定是更新 ， 但可能存在key不相同，此时需要进入节点的卸载和新节点的挂载
*/

function normalizeDirective(directive: any) {
    return isFunction(directive) ? {
        mounted: directive,
        updated: directive
    } : directive
}


/*
    参数和修饰符是一个数组结构但自身挂载了所有的key，可以灵活运用
*/
function processModifiers(arr: any) {
    for (let key of arr) {
        arr[key] = true
    }
    return arr
}


export function processHook(type: LifecycleHooks, vnode: any, pVnode: any = null) {
    switch (vnode.nodeType) {
        case Nodes.COMPONENT:
            processComponentHook(type, vnode, pVnode)
            break
        case Nodes.RENDER_COMPONENT:
            processRenderComponentHook(type, vnode, pVnode)
            break
        case Nodes.STYLE:
        case Nodes.HTML_ELEMENT:
        case Nodes.SVG_ELEMENT:
            processElementHook(type, vnode, pVnode)
            break
    }
}


function processComponentHook(type: LifecycleHooks, vnode: any, pVnode?: any) {
    const instance = vnode.instance
    // 组件需要处理实例钩子
    const scope = instance.scope
    callHook(type, instance, { binding: scope }, scope)
    let hookKey = `on${initialUpperCase(type)}`
    for (let key in (vnode.props || emptyObject)) {
        if (key.startsWith('_directive')) {
            let bindings = vnode.props[key]
            if (bindings.directive) {
                return
            }
            let directive = normalizeDirective(bindings.directive)
            let hook = directive[type]
            if (hook) {
                bindings._arguments ? processModifiers(bindings._arguments) : bindings._arguments = emptyArray
                bindings.filters ? processModifiers(bindings.filters) : bindings.filters = emptyArray
                bindings.modifiers ? processModifiers(bindings.modifiers) : bindings.modifiers = emptyArray
                if (pVnode) {
                    let pBindings = pVnode.props[key]
                    let oldValue = pBindings.value
                    bindings.oldValue = oldValue
                }
                hook(scope, bindings, vnode, pVnode)
            }
        } else if (key.startsWith(hookKey)) {
            if (key.startsWith(hookKey + '$modelValue')) {
                // 组件的 model
                let modelKey = key.split('_')[1]
                // 每次更新需要对比 新旧值，如果变化通过setter传递到父组件
                let setParentModelValue = vnode.props[key]
                setParentModelValue(scope[modelKey])
            } else {
                // 普通的 属性钩子, 支持数组
                normalizeHandler(vnode.props[key]).forEach((handler: any) => handler(scope))
            }
        }
    }
}

function processElementHook(type: LifecycleHooks, vnode: any, pVnode?: any) {
    let hookKey = `on${initialUpperCase(type)}`
    for (let key in (vnode.props || emptyObject)) {
        if (key.startsWith('_directive')) {
            let bindings = vnode.props[key]
            if (bindings.directive) {
                return
            }
            let directive = normalizeDirective(bindings.directive)
            let hook = directive[type]
            if (hook) {
                bindings._arguments ? processModifiers(bindings._arguments) : bindings._arguments = emptyArray
                bindings.filters ? processModifiers(bindings.filters) : bindings.filters = emptyArray
                bindings.modifiers ? processModifiers(bindings.modifiers) : bindings.modifiers = emptyArray
                if (pVnode) {
                    let pBindings = pVnode.props[key]
                    let oldValue = pBindings.value
                    bindings.oldValue = oldValue
                }
                hook(vnode.el, bindings, vnode, pVnode)
            }
        } else if (key.startsWith(hookKey)) {
            normalizeHandler(vnode.props[key]).forEach((handler: any) => handler(vnode.el))
        }
    }
}

function processRenderComponentHook(type: LifecycleHooks, vnode: any, pVnode?: any) {
    let hookKey = `on${initialUpperCase(type)}`
    for (let key in (vnode.props || emptyObject)) {
        if (key.startsWith('_directive')) {
            let bindings = vnode.props[key]
            if (bindings.directive) {
                return
            }
            let directive = normalizeDirective(bindings.directive)
            let hook = directive[type]
            if (hook) {
                bindings._arguments ? processModifiers(bindings._arguments) : bindings._arguments = emptyArray
                bindings.filters ? processModifiers(bindings.filters) : bindings.filters = emptyArray
                bindings.modifiers ? processModifiers(bindings.modifiers) : bindings.modifiers = emptyArray
                if (pVnode) {
                    let pBindings = pVnode.props[key]
                    let oldValue = pBindings.value
                    bindings.oldValue = oldValue
                }
                hook(null, bindings, vnode, pVnode)
            }
        } else if (key.startsWith(hookKey)) {
            normalizeHandler(vnode.props[key]).forEach((handler: any) => handler())
        }
    }
}