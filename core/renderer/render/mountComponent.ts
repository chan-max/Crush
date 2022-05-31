import { createComponentInstance } from "../../instance/componentInstance"
import { LifecycleHooks } from "../../instance/lifecycle"
import { EMPTY_OBJ } from "../../common/value"
import {
    callHook
} from '../../instance/lifecycle'
import renderMethods from "../renderMethods"
import { processdom } from "../common/processdom"

import {
    patch
} from './patch'
import {
    effect
} from '../../reactivity/reactive'

import {
    nextTickSingleWork
} from '../../scheduler/nextTickSingleWork'

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

    instance.props = props || EMPTY_OBJ
    instance.slots = children || EMPTY_OBJ

    // 保存vnode上的组件实例
    component.instance = instance


    const { scope, createRender } = instance;

    // init instance , we only can use getCurrentInstance in create hook 
    setCurrentInstance(instance)
    callHook(LifecycleHooks.CREATE, instance, scope, scope)
    setCurrentInstance(null)


    // render function  
    setCurrentInstance(instance)
    const render = createRender(renderMethods)
    setCurrentInstance(null)

    instance.render = render

    // component update fn
    function update() {
        const {
            isMounted,
            vnode
        } = instance

        // 每次更新生成新树

        setCurrentInstance(instance)
        var nextTree = render()
        console.log('unprocessTree', nextTree);
        setCurrentInstance(null)

        // 处理fragment
        nextTree = processdom(nextTree)

        console.log('prevTree', vnode);
        console.log('nextTree', nextTree);

        // test hooks
        patch(vnode, nextTree, container)

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