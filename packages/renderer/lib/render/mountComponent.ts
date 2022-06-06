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
    const { scope, createRender } = instance;
    instance.props = props || emptyObject
    instance.slots = children || emptyObject

    // process props


    // create 钩子只能 通过组件选项定义，无法通过指令或者节点钩子添加
    setCurrentInstance(instance)
    callHook(LifecycleHooks.CREATE, instance, scope, scope)
    setCurrentInstance(null)


    // render function  
    setCurrentInstance(instance)
    const render = createRender(renderMethods)
    setCurrentInstance(null)

    processHook(LifecycleHooks.CREATED, component)

    instance.render = render

    // component update fn
    function update(p?: any, n?: any) { // 可能通过updateComponent传入旧节点
        const { isMounted, vnode } = instance
        // 每次更新生成新树

        if(n){
            component = n
        }

        setCurrentInstance(instance)
        var nextTree = render()
        setCurrentInstance(null)

        // 处理树
        nextTree = processdom(nextTree)

        // console.log('prevTree', vnode);
        console.log('nextTree', nextTree);
        /*
            这里发生的更新是自身状态变化发生的更新，不存在生成新节点
        */
        processHook(isMounted ? LifecycleHooks.BEFORE_UPDATE : LifecycleHooks.BEFORE_MOUNT, component, p)
        patch(vnode, nextTree, container)
        processHook(isMounted ? LifecycleHooks.UPDATED : LifecycleHooks.MOUNTED, component, p)
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