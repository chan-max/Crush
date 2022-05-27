import {
    getEmptyMap,
    uid
} from '@crush/common'
import { renderMethods } from '../../../../dev/node_modules/@crush/compiler'

import {
    reactive,
    effect
} from '../../reactivity/reactive'

import {
    callHook,
    LifecycleHooks
} from '../../instance/lifecycle'

import {
    initOptions
} from '../../instance/options'
import { patch } from './patch'
import {
    nextTickSingleWork
} from '../../scheduler/nextTickSingleWork'

import {
    processdom
} from '../common/processdom'
import { initScope } from '../../instance/scope'
import { getCurrentApp } from '../../..'
import { injectMixins } from '../../instance/mixin'
import { EMPTY_OBJ } from '@crush/common/src/value'

function createComponentInstance(options: any) {
    var app = getCurrentApp()
    if (!options._isOptions) {
        initOptions(options)
    }

    const instance: any = {
        uid: uid(),
        scope: reactive(initScope()),
        render: null,
        vnode: null,
        slots: null,
        props: null,
        createRender: options.createRender,
        components: options.components,
        directives: options.directives,
        // hooks will always be an array
        beforeCreate: options.beforeCreate && [...options.beforeCreate],
        create: options.create && [...options.create],
        created: options.created && [...options.created],
        beforeMount: options.beforeMount && [...options.beforeMount],
        mounted: options.mounted && [...options.mounted],
        beforeUnmount: options.beforeUnmount && [...options.beforeUnmount],
        unmounted: options.unmounted && [...options.unmounted],
        beforeUpdate: options.beforeUpdate && [...options.beforeUpdate],
        updated: options.updated && [...options.updated]
    }

    if (app.mixins) {
        injectMixins(instance, app.mixins)
    }
    return instance
}


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

export const mountComponent = (vnode: any, container: Element, anchor: any = null) => {
    var { tag, props, children } = vnode

    var instance: any = createComponentInstance(tag)

    instance.props = props || EMPTY_OBJ
    instance.slots = children || EMPTY_OBJ

    // 保存vnode上的组件实例
    vnode.instance = instance


    const { scope, createRender, } = instance;

    callHook(LifecycleHooks.BEFORE_CREATE, instance, scope, scope)

    // init instance , we only can use getCurrentInstance in create hook 
    setCurrentInstance(instance)
    callHook(LifecycleHooks.CREATE, instance, scope, scope)
    setCurrentInstance(null)

    callHook(LifecycleHooks.CREATED, instance, scope, scope)

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

        callHook(isMounted ? LifecycleHooks.BEFORE_UPDATE : LifecycleHooks.BEFORE_MOUNT, instance, scope, scope)
        patch(vnode, nextTree, container)
        callHook(isMounted ? LifecycleHooks.UPDATED : LifecycleHooks.MOUNTED, instance, scope, scope)

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