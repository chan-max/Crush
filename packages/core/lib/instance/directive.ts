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
/* 
    pervious 节点存在一定是更新 ， 但可能存在key不相同，此时需要进入节点的卸载和新节点的挂载
*/

function normalizeDirective(directive: any) {
    return isFunction(directive) ? {
        mounted: directive,
        updated: directive
    } : directive
}


function injectDirective(target: any, [directive, ...bindings]: any) {
    var directives = target.directives ||= new Map()
    directives.set(directive, bindings)
}

export function injectDirectives(target: any, directives: any[]) {
    directives.forEach((directive: any) => {
        injectDirective(target, directive)
    })
    return target
}

/*
    参数和修饰符是一个数组结构但自身挂载了所有的key，可以灵活运用
*/
function setOwnKey(arr: any[]) {
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

    var directives = vnode.directives
    if (directives) {
        for (let [dir, [value, _arguments, modifiers]] of directives) {
            var _dir = normalizeDirective(dir)
            var hook = _dir[type]
            if (hook) {
                var bindings: any = {
                    directive: dir, //保留原始指令
                    value,
                    _arguments: _arguments ? setOwnKey(_arguments) : emptyObject,
                    modifiers: modifiers ? setOwnKey(modifiers) : emptyObject,
                }
                if (pVnode) {
                    // 如果更新的话两个节点的指令应该完全相同
                    bindings.oldValue = pVnode.directives.get(dir)[0]
                }
                // 
                hook(scope, bindings, vnode, pVnode)
            }
        }
    }

    // 节点钩子
    const vnodeHook = vnode?.props?.[`on${initialUpperCase(type)}`]
    if (vnodeHook) {
        vnodeHook(scope)
    }
}

function processElementHook(type: LifecycleHooks, vnode: any, pVnode?: any) {
    let el = vnode.el
    var directives = vnode.directives
    if (directives) {
        for (let [dir, [value, _arguments, modifiers]] of directives) {
            var _dir = normalizeDirective(dir)
            var hook = _dir[type]
            if (hook) {
                var bindings: any = {
                    directive: dir, //保留原始指令
                    value,
                    _arguments: _arguments ? setOwnKey(_arguments) : emptyObject,
                    modifiers: modifiers ? setOwnKey(modifiers) : emptyObject,
                }
                if (pVnode) {
                    // 如果更新的话两个节点的指令应该完全相同
                    bindings.oldValue = pVnode.directives.get(dir)[0]
                }
                // 
                hook(el, bindings, vnode, pVnode)
            }
        }
    }

    // 节点钩子
    const vnodeHook = vnode?.props?.[`on${initialUpperCase(type)}`]
    if (vnodeHook) {
        vnodeHook(el)
    }
}

function processRenderComponentHook(type: LifecycleHooks, vnode: any, pVnode?: any) {
    var directives = vnode.directives
    if (directives) {
        for (let [dir, [value, _arguments, modifiers]] of directives) {
            var _dir = normalizeDirective(dir)
            var hook = _dir[type]
            if (hook) {
                var bindings: any = {
                    directive: dir, //保留原始指令
                    value,
                    _arguments: _arguments ? setOwnKey(_arguments) : emptyObject,
                    modifiers: modifiers ? setOwnKey(modifiers) : emptyObject,
                }
                if (pVnode) {
                    // 如果更新的话两个节点的指令应该完全相同
                    bindings.oldValue = pVnode.directives.get(dir)[0]
                }
                // 这里不能省略第一个参数，是为了和其他两种参数保持一致
                hook(null, bindings, vnode, pVnode)
            }
        }
    }

    // 节点钩子
    const vnodeHook = vnode?.props?.[`on${initialUpperCase(type)}`]
    if (vnodeHook) {
        vnodeHook()
    }
}