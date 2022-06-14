import { createComponentInstance, LifecycleHooks, callHook, processComponent, COMPONENT_TYPE, Components } from "@crush/core"

import { emptyFunction, emptyObject, error, isFunction, isObject } from "@crush/common"

import renderMethods from "../renderMethods"
import { processdom } from "../common/processdom"

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


export function mountComponent(component: any, container: Element, anchor: Element | null = null) {
    switch (processComponent(component.type)[COMPONENT_TYPE]) {
        case Components.OPTIONS_COMPONENT:
            return mountStatefulComponent(component, container, anchor)
        case Components.RENDER_COMPONENT:
            return mountRenderComponent(component, container, anchor)
        case Components.ASYNC_COMPONENT:
            return mountAsyncComponent(component, container, anchor)
        case Components.RESOLVED_ASYNC_COMPONENT:
            return mountResolvedAsyncComponent(component, container, anchor)
    }
}


export function mountStatefulComponent(component: any, container: Element, anchor: Element | null = null) {

    const { type, props, children }: any = component

    const instance = createComponentInstance(type)

    const { scope } = instance

    callHook(LifecycleHooks.BEFORE_CREATE, instance, { binding: scope }, scope)

    component.instance = instance

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

    processHook(LifecycleHooks.CREATED, component)

    // component update

    let prevComponent: any = null, nextComponent = component
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
        nextTree = processdom(nextTree)

        processHook(isMounted ? LifecycleHooks.BEFORE_UPDATE : LifecycleHooks.BEFORE_MOUNT, nextComponent, prevComponent)
        patch(vnode, nextTree, container, anchor)
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




function mountRenderComponent(component: any, container: any, anchor: any) {
    debugger
}

function mountAsyncComponent(component: any, container: any, anchor: any) {
}

function mountResolvedAsyncComponent(component: any, container: any, anchor: any) {
}