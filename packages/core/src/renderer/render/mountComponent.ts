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

function createCommonComponentInstance(options: any) {
    if (!options._isOptions) {
        initOptions(options)
    }

    const instance: any = {
        uid: uid(),
        scope: reactive(initScope()),
        render: null,
        currentTree: null,
        createRender: options.createRender,
        components: options.components ,
        directives: options.direvtives ,
        // hooks will always be an array
        [LifecycleHooks.CREATE]: options[LifecycleHooks.CREATE] && [...options[LifecycleHooks.CREATE]],
        [LifecycleHooks.CREATED]: options[LifecycleHooks.CREATED] && [...options[LifecycleHooks.CREATED]],
        [LifecycleHooks.BEFORE_MOUNT]: options[LifecycleHooks.BEFORE_MOUNT] && [...options[LifecycleHooks.BEFORE_MOUNT]],
        [LifecycleHooks.MOUNTED]: options[LifecycleHooks.MOUNTED] && [...options[LifecycleHooks.MOUNTED]],
        [LifecycleHooks.BEFORE_UNMOUNT]: options[LifecycleHooks.BEFORE_UNMOUNT] && [...options[LifecycleHooks.BEFORE_UNMOUNT]],
        [LifecycleHooks.UNMOUNTED]: options[LifecycleHooks.UNMOUNTED] && [...options[LifecycleHooks.UNMOUNTED]],
        [LifecycleHooks.BEFORE_UPDATE]: options[LifecycleHooks.BEFORE_UPDATE] && [...options[LifecycleHooks.BEFORE_UPDATE]],
        [LifecycleHooks.UPDATED]: options[LifecycleHooks.UPDATED] && [...options[LifecycleHooks.UPDATED]]
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

export const mountComponent = (vnode: any, container: Element) => {
    var {
        type,
    } = vnode

    var instance: any = createCommonComponentInstance(type)

    const {
        scope,
        createRender,
    } = instance;

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
            currentTree
        } = instance

        // 每次更新生成新树

        var nextTree = render()


        // 处理fragment
        nextTree = processdom(nextTree)

        console.log('currentTree', currentTree);
        console.log('nextTree', nextTree);

        // test hooks

        callHook(isMounted ? LifecycleHooks.BEFORE_UPDATE : LifecycleHooks.BEFORE_MOUNT, instance, scope, scope)
        patch(currentTree, nextTree, container)
        callHook(isMounted ? LifecycleHooks.UPDATED : LifecycleHooks.MOUNTED, instance, scope, scope)

        instance.isMounted = true
        instance.currentTree = nextTree
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