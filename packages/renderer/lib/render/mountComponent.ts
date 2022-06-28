import { createComponentInstance, LifecycleHooks, callHook, } from "@crush/core"

import { emptyFunction, emptyObject, error, isFunction, isObject, mark } from "@crush/common"

import renderMethods from "../renderMethodsExport"
import { processRenderResult } from "../common/processRenderResult"

import { processHook } from '@crush/core'

import {
    patch
} from './patch'
import {
    createReactiveEffect,
} from '@crush/reactivity'

import {
    queueJob
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

export function getCurrentRenderScope() {
    return getCurrentInstance().renderScope
}

function setScopeData(scope: any, data: any) {
    if (!isObject(data)) { return }
    for (let key in data) {
        // data 存在时应该警告
        scope[key] = data[key]
    }
}


export function mountComponent(vnode: any, container: Element, anchor: any, parent: any) {

    const { type, props, children }: any = vnode

    const instance = createComponentInstance(type, parent)

    const { scope, renderScope } = instance

    callHook(LifecycleHooks.BEFORE_CREATE, instance, { binding: scope }, scope)

    vnode.instance = instance
    instance.componentVnode = vnode
    setCurrentInstance(instance)

    // 初次创建前应该把 slot props 方法等挂载到作用域上
    // 先挂载props ，这样 create hook中才能访问
    mountComponentProps(instance, props)
    instance.slots = children

    // 处理mixins中的create钩子 ，rootCreate后处理 ，优先级更高 , 在处理props后处理，保证钩子中能访问到props等数据

    const createResults = callHook(LifecycleHooks.CREATE, instance, { binding: scope }, scope)

    // 注入 mixins 状态
    createResults?.forEach((data: any) => setScopeData(scope, data))

    // 组件根初始化方法
    /*
        render 优先级
        create 返回的渲染函数  > render > template , 暂时不支持无状态组件
    */
    let render: any
    if (instance.render) {
        render = instance.render.bind(renderScope)
    } else if (instance.createRender) {
        render = instance.createRender(renderMethods)
    } else {
        render = emptyFunction
    }

    instance.render = render

    setCurrentInstance(null)

    processHook(LifecycleHooks.CREATED, vnode)

    // component update

    // component update fn
    function update() { // !传入next代表为非自更新
        const { isMounted, vnode: pVnode, beforePatch, componentVnode, updatingComponentVnode, render } = instance
        // 每次 更新生成新树
        setCurrentInstance(instance)
        let nVnode = render(scope)
        setCurrentInstance(null)
        // 处理树

        let pComponentVnode, nComponentVnode

        if (updatingComponentVnode) { // 非自更新，两个节点对比更新
            nComponentVnode = updatingComponentVnode
            pComponentVnode = componentVnode
            // 把新节点存到实例上
            instance.componentVnode = nComponentVnode
        } else {
            nComponentVnode = componentVnode
        }

        // 清理vnode 
        instance.updatingComponentVnode = null

        nVnode = processRenderResult(nVnode)
        instance.renderingVnode = nVnode
        processHook(isMounted ? LifecycleHooks.BEFORE_UPDATE : LifecycleHooks.BEFORE_MOUNT, nComponentVnode, pComponentVnode)

        if (beforePatch) { beforePatch(pVnode, nVnode) }
        
        patch(pVnode, nVnode, container, anchor, instance)

        instance.vnode = nVnode
        instance.isMounted = true

        processHook(isMounted ? LifecycleHooks.UPDATED : LifecycleHooks.MOUNTED, nComponentVnode, pComponentVnode)
    }

    //  call at every update
    instance.update = update

    const rednerEffect = createReactiveEffect(update, queueJob)
    // 手动渲染
    rednerEffect.run()
    return instance
}




