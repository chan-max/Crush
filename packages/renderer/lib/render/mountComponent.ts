import { createComponentInstance, LifecycleHooks, callHook, } from "@crush/core"

import { emptyFunction, emptyObject, error, isFunction, isObject, mark } from "@crush/common"

import renderMethods from "../renderMethodsExport"
import { processVnodePrerender } from "./processVnodePrerender"

import { processHook } from '@crush/core'

import {
    patch
} from './patch'
import {
    createReactiveEffect, reactive,
} from '@crush/reactivity'

import {
    queueJob
} from '@crush/scheduler'
import { mountComponentProps } from "./componentProps"

import { isPromise } from '@crush/common'


// rendering instance and creating instance
export var currentInstance: any = null
export function setCurrentInstance(instance: any) {
    currentInstance = instance
}
export function getCurrentInstance() {
    return currentInstance
}
// 清除当前组件引用
export function clearCurrentInstance() {
    currentInstance = null
}


export function getCurrentScope() {
    return getCurrentInstance().scope
}
export function getCurrentRenderScope() {
    return getCurrentInstance().renderScope
}



function setScopeData(scope: any, data: any) {
    if (!data) {
        return
    }
    if (isObject(data)) {
        for (let key in data) {
            // data 存在时应该警告
            let value = data[key]
            // 挂载到实例的promise会自动请求
            if (isPromise(value)) {
                value.then((result: any) => {
                    scope[key] = result
                })
            } else {
                scope[key] = value
            }
        }
    } else if (isPromise(data)) {
        // async create
        data.then((result: any) => {
            setScopeData(scope, result)
        })
    }
}


const keepAliveCache: any = {}

export function mountComponent(vnode: any, container: Element, anchor: any, parent: any) {

    let keepAliveOptions = vnode._keepAlive || vnode?.props?._keepAlive

    if (keepAliveOptions) {
        if (vnode.isDynamicComponent) {
            let keepAliveKey = vnode.key
            let cached = keepAliveCache[keepAliveKey]
            if (cached) {
                // 处理缓存
                return
            }
        }
    }

    const instance = createComponentInstance(vnode.type, parent)

    vnode.instance = instance
    instance.componentVnode = vnode

    const { scope, renderScope } = instance

    processHook(LifecycleHooks.BEFORE_CREATE, vnode)

    // create
    setCurrentInstance(instance)

    // 初次创建前应该把 slot props 方法等挂载到作用域上
    // 先挂载props ，这样 create hook中才能访问
    mountComponentProps(instance, vnode.props)
    instance.slots = vnode.children
    instance.props = reactive(vnode.props)
    // 处理mixins中的create钩子 ，rootCreate后处理 ，优先级更高 , 在处理props后处理，保证钩子中能访问到props等数据

    const createResults = callHook(LifecycleHooks.CREATE, instance, { binding: scope }, scope)

    // 注入 mixins 状态
    createResults?.forEach((data: any) => setScopeData(scope, data))

    // 组件根初始化方法
    /*
        render 优先级
        create 返回的渲染函数  > render > template , 暂时不支持无状态组件
    */

    let render = instance.render ? instance.render.bind(renderScope) : instance.createRender ? instance.createRender(renderMethods) : emptyFunction

    instance.render = render

    setCurrentInstance(null)

    processHook(LifecycleHooks.CREATED, vnode)

    // component update

    // component update fn
    function update() {
        const { isMounted, vnode: pVnode, componentVnode, updatingComponentVnode, render } = instance
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

        nVnode = processVnodePrerender(nVnode)
        instance.renderingVnode = nVnode

        processHook(isMounted ? LifecycleHooks.BEFORE_UPDATE : LifecycleHooks.BEFORE_MOUNT, nComponentVnode, pComponentVnode)

        callHook(LifecycleHooks.BEFORE_PATCH, instance, null, nVnode, pVnode,)

        patch(pVnode, nVnode, container, anchor, instance)

        instance.vnode = nVnode
        instance.isMounted = true
        instance.renderingVnode = null
        processHook(isMounted ? LifecycleHooks.UPDATED : LifecycleHooks.MOUNTED, nComponentVnode, pComponentVnode)
    }

    instance.update = update

    const rednerEffect = createReactiveEffect(update, queueJob)
    // 手动渲染
    instance.renderEffect = rednerEffect
    rednerEffect.run()
    return instance
}




