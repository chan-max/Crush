import {
    getEmptyMap,
    getUid
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
    dispatchSingleWork
} from '../../schduler/dispatchSingleWork'

function createCommonComponentInstance(options: any) {
    if (!options._isOptions) {
        initOptions(options)
    }
    const instance: any = {
        uid: getUid(),
        scope: reactive(getEmptyMap()),
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
export function getCurrentScope() {
    return getCurrentInstance().scope
}

export const mountComponent = (container: Element, options: any) => {
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

        // test hooks
        if (isMounted) {
            console.log('component is updating');
        } else {
            console.log('component is mounting');
        }

        var nextTree = render()

        console.log('currentTree', currentTree);
        console.log('nextTree', nextTree);
        patch(currentTree, nextTree, container)
        instance.currentTree = currentTree
    }

    //  call at every update
    instance.update = update

    

    effect(() => {
        dispatchSingleWork(update)
    })
    return instance
}