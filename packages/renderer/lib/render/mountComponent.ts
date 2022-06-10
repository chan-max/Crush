import { createComponentInstance, LifecycleHooks, callHook } from "@crush/core"

import { emptyFunction, emptyObject, isFunction, isObject } from "@crush/common"

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

function asyncComponent() {
}

function pureComponent() {

}





function setScopeData(scope: any, data: any) {
    if (!isObject(data)) { return }
    for (let key in data) {
        // data 存在时应该警告
        scope[key] = data[key]
    }
}

export function mountComponent(component: any, container: Element, anchor: Element | null = null) {
    const { type, props, children } = component

    const instance = createComponentInstance(type)

    const { scope, rootCreate, isFunctional } = instance

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
    let rootCreateResult
    if (rootCreate) {
        debugger
        rootCreateResult = rootCreate(scope)
    }
    /*
        render 优先级
        create 返回的渲染函数  > render > template , 暂时不支持无状态组件
    */
    let render: any
    if (isFunctional) {
        // ! 初始化返回结果作为 render
        // 无论是options组件还还是函数式组件 ， 只有rootCreate返回结果是函数都会作为
        render = rootCreateResult
    } else {
        // ! 返回结果作为data
        if (instance.render) {
            render = instance.render
        } else if (instance.createRender) {
            render = instance.createRender(renderMethods)
        } else {
            render = emptyFunction
        }
        setScopeData(scope, rootCreateResult)
    }

    render = render.bind(scope) // 用于手写 render 时的 this

    setCurrentInstance(null)

    processHook(LifecycleHooks.CREATED, component)

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
    effect(() => {
        update()
    }, {
        scheduler: (effect: any) => {
            nextTickSingleWork(effect.fn)
        }
    })

    return instance
}