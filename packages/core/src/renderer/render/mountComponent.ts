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
        components: options.components || getEmptyMap(),
        directives: options.direvtives || getEmptyMap(),
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

export var currentInstance: any = null
export const setCurrentInstance = (instance: any) => currentInstance = instance
export const getCurrentInstance = () => currentInstance
export const getCurrentScope = () => getCurrentInstance().scope

export const mountComponent = (vnode: any, container: Element) => {
    var {
        type: options
    } = vnode

    var instance: any = createCommonComponentInstance(options)
    // 当前
    currentInstance = instance
    const {
        scope,
        createRender,
    } = instance;

    // init instance
    callHook(LifecycleHooks.CREATE, instance, scope, scope)
    callHook(LifecycleHooks.CREATED, instance, scope, scope)
    // render function
    const render = createRender(renderMethods)
    instance.render = render

    // component update fn
    function update() {
        const {
            isMounted,
            currentTree
        } = instance

        var nextTree = render()

        // 处理fragment
        nextTree = processdom(nextTree)

        console.log('currentTree', currentTree);
        console.log('nextTree', nextTree);

        // test hooks
        if (isMounted) {
            callHook(LifecycleHooks.BEFORE_UPDATE, instance, scope, scope)
            patch(currentTree, nextTree, container)
            callHook(LifecycleHooks.UPDATED, instance, scope, scope)
        } else {
            callHook(LifecycleHooks.BEFORE_MOUNT, instance, scope, scope)
            patch(currentTree, nextTree, container)
            callHook(LifecycleHooks.MOUNTED, instance, scope, scope)
            instance.isMounted = true
        }
        instance.currentTree = nextTree
    }

    //  call at every update
    instance.update = update

    effect(() => {
        update()
    }, {
        scheduler: (fn: any) => {
            nextTickSingleWork(fn)
        }
    })

    return instance
}