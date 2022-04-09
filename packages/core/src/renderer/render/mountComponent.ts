import {
    getEmptyMap,
    getUid
} from '@crush/common'
import { renderMethods } from '../../../../dev/node_modules/@crush/compiler'

import {
    LifecycleHooks
} from '../../instance/lifecycle'

import {
    initOptions
} from '../../instance/options'

function createComponentInstance(options: any) {
    if (!options._isOptions) {
        initOptions(options)
    }

    const instance: any = {
        uid: getUid(),
        scope: getEmptyMap(),
        render: null,
        [LifecycleHooks.CREATE]: options[LifecycleHooks.CREATE] && [...options[LifecycleHooks.CREATE]],
        [LifecycleHooks.CREATED]: options[LifecycleHooks.CREATED] && [...options[LifecycleHooks.CREATED]],
        [LifecycleHooks.BEFORE_MOUNT]: options[LifecycleHooks.BEFORE_MOUNT] && [...options[LifecycleHooks.BEFORE_MOUNT]],
        [LifecycleHooks.MOUNTED]: options[LifecycleHooks.MOUNTED] && [...options[LifecycleHooks.MOUNTED]],
        [LifecycleHooks.BEFORE_UNMOUNT]: options[LifecycleHooks.BEFORE_UNMOUNT] && [...options[LifecycleHooks.BEFORE_UNMOUNT]],
        [LifecycleHooks.BEFORE_UPDATE]: options[LifecycleHooks.BEFORE_UPDATE] && [...options[LifecycleHooks.BEFORE_UPDATE]],
        [LifecycleHooks.UPDATED]: options[LifecycleHooks.UPDATED] && [...options[LifecycleHooks.UPDATED]]
    }

    instance.render = options.renderCreator(instance, renderMethods)
    return instance
}

export const mountComponent = (container: Element, options: any) => {
    var instance: any = createComponentInstance(options)

    const render = instance.render
    console.log(render);
    const currentTree = render()

    console.log(currentTree);
    
    
    return instance
}