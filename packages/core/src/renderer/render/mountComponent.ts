import {
    getEmptyMap,
    getUid
} from '@crush/common'
import { renderMethods } from '../../../../dev/node_modules/@crush/compiler'

import {
    callHook,
    LifecycleHooks
} from '../../instance/lifecycle'

import {
    initOptions
} from '../../instance/options'
import { patch } from './patch'

function createComponentInstance(options: any) {
    if (!options._isOptions) {
        initOptions(options)
    }
    const instance: any = {
        uid: getUid(),
        scope: getEmptyMap(),
        render: null,
        _scope: getEmptyMap(),
        currentTree: null,
        createRender: options.createRender,
        components: options.components || getEmptyMap(),
        directives: options.direvtives || getEmptyMap(),
        [LifecycleHooks.CREATE]: options[LifecycleHooks.CREATE] && [...options[LifecycleHooks.CREATE]],
        [LifecycleHooks.CREATED]: options[LifecycleHooks.CREATED] && [...options[LifecycleHooks.CREATED]],
        [LifecycleHooks.BEFORE_MOUNT]: options[LifecycleHooks.BEFORE_MOUNT] && [...options[LifecycleHooks.BEFORE_MOUNT]],
        [LifecycleHooks.MOUNTED]: options[LifecycleHooks.MOUNTED] && [...options[LifecycleHooks.MOUNTED]],
        [LifecycleHooks.BEFORE_UNMOUNT]: options[LifecycleHooks.BEFORE_UNMOUNT] && [...options[LifecycleHooks.BEFORE_UNMOUNT]],
        [LifecycleHooks.BEFORE_UPDATE]: options[LifecycleHooks.BEFORE_UPDATE] && [...options[LifecycleHooks.BEFORE_UPDATE]],
        [LifecycleHooks.UPDATED]: options[LifecycleHooks.UPDATED] && [...options[LifecycleHooks.UPDATED]]
    }
    return instance
}

export var currentInstance: any = null
export const setCurrentInstance = (instance: any) => currentInstance = instance
export const getCurrentInstance = () => currentInstance
export const getCurrentScope = () => getCurrentInstance()._scope

export const mountComponent = (container: Element, options: any) => {
    var instance: any = createComponentInstance(options)
    // 当前
    currentInstance = instance
    const {
        _scope,
        createRender,
    } = instance

    // init instance
    callHook(LifecycleHooks.CREATE, instance, _scope)

    // render function
    const render = createRender(renderMethods)

    // 每次状态更新都会触发
    function update() {
        const {
            isMounted,
            currentTree
        } = instance
        var nextTree = render()
        console.log('currentTree', currentTree);
        console.log('nextTree', nextTree);

        patch(currentTree, nextTree, container)
    }

    update()

    return instance
}