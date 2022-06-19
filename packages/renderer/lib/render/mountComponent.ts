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

    const { scope } = instance

    callHook(LifecycleHooks.BEFORE_CREATE, instance, { binding: scope }, scope)

    vnode.instance = instance

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
        render = instance.render.bind(scope)
    } else if (instance.createRender) {
        render = instance.createRender(renderMethods)
    } else {
        render = emptyFunction
    }

    setCurrentInstance(null)

    processHook(LifecycleHooks.CREATED, vnode)

    // component update

    let prevComponent: any = null, nextComponent = vnode
    // component update fn
    function update(next?: any) { // !传入next代表为非自更新
        const { isMounted, vnode } = instance
        // 每次 更新生成新树

        if (next) {
            prevComponent = nextComponent
            nextComponent = next
        } else {
            // 自更新时重置 prevComponent ， 防止钩子调用出错
            prevComponent = null
        }

        setCurrentInstance(instance)
        var nextTree = render()
        console.log(nextTree);
        setCurrentInstance(null)

        // 处理树
        nextTree = processRenderResult(nextTree)

        processHook(isMounted ? LifecycleHooks.BEFORE_UPDATE : LifecycleHooks.BEFORE_MOUNT, nextComponent, prevComponent)
        patch(vnode, nextTree, container, anchor, instance)
        processHook(isMounted ? LifecycleHooks.UPDATED : LifecycleHooks.MOUNTED, nextComponent, prevComponent)

        instance.isMounted = true
        instance.vnode = nextTree
    }

    //  call at every update
    instance.update = update

    const rednerEffect = createReactiveEffect(update, queueJob)
    // 手动渲染
    rednerEffect.run()
    return instance
}




