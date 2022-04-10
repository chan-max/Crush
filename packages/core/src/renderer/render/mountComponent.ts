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

function createComponentInstance(options: any) {
    if (!options._isOptions) {
        initOptions(options)
    }

    const instance: any = {
        uid: getUid(),
        scope: getEmptyMap(),
        render: null,
        _scope: getEmptyMap(),
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

export const mountComponent = (container: Element, options: any) => {
    var instance: any = createComponentInstance(options)

    const {
        _scope
    } = instance

    callHook(LifecycleHooks.CREATE, instance, _scope)

    const render = options.renderCreator(instance, renderMethods)
    console.log(render);
    const currentTree = render()



    console.log(currentTree);

    return instance
}