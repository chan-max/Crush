import { createComponentInstance, LifecycleHooks, callHook } from "@crush/core"

import { emptyObject } from "@crush/common"

import renderMethods from "../renderMethods"
import { processdom } from "../common/processdom"

import { processHook } from '@crush/core'

import {
    patch
} from './patch'
import {
    effect
} from '@crush/reactivity'

import {
    nextTickSingleWork
} from '@crush/scheduler'
import { mountComponentProps } from "./componentProps"

// rendering instance and creating instance
export var currentInstance: any = null
export function setCurrentInstance(instance: any) {
    currentInstance = instance
}
export function getCurrentInstance() {
    return currentInstance
}
export function getCurrentScope() {
    return getCurrentInstance().scope
}

export function mountComponent(component: any, container: Element, anchor: Element | null = null) {
    var { type, props, children } = component
    const instance = createComponentInstance(type)

    component.instance = instance

    processHook(LifecycleHooks.BEFORE_CREATE, component)

    // setup instance
    const scope = instance.scope

    // process props

    mountComponentProps(instance, props)

    // create 钩子只能 通过组件选项定义，无法通过指令或者节点钩子添加 , create 中可以查看props
    setCurrentInstance(instance)
    callHook(LifecycleHooks.CREATE, instance, { binding: scope }, scope)
    setCurrentInstance(null)


    // render function  
    setCurrentInstance(instance)
    const render = instance.render ||= instance.createRender(renderMethods)

    setCurrentInstance(null)

    processHook(LifecycleHooks.CREATED, component)

    // component update fn
    function update(next?: any) { // !传入next代表为非自更新
        const { isMounted, vnode } = instance
        // 每次 更新生成新树

        var p, n

        if (next) {
            p = component
            n = next
        } else {
            n = component
        }

        setCurrentInstance(instance)
        var nextTree = render()
        console.log(nextTree);
        setCurrentInstance(null)

        // 处理树
        nextTree = processdom(nextTree)

        processHook(isMounted ? LifecycleHooks.BEFORE_UPDATE : LifecycleHooks.BEFORE_MOUNT, n, p)
        patch(vnode, nextTree, container, anchor)
        processHook(isMounted ? LifecycleHooks.UPDATED : LifecycleHooks.MOUNTED, n, p)

        component = n
        instance.isMounted = true
        instance.vnode = nextTree
    }

    //  call at every update
    instance.update = update

    effect(() => {
        update()
    }, {
        scheduler: (effect: any) => {
            nextTickSingleWork(effect.fn)
        }
    })

    return instance

}