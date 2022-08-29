import { ComponentType } from "./component"
import { LifecycleHooks, injectHook } from "./lifecycle"
import { ComponentOptions } from "./option"

export type MixinType = {
    beforeCreate?: Function
    create?: Function // setup 
    created?: Function
    beforeMount?: Function
    mounted?: Function
    beforeUpdate?: Function
    updated?: Function
    beforeUnmount?: Function
    unmounted?: Function
    mixins?: MixinType[]
}



export function injectMixin(options: ComponentType, mixin: MixinType) {
    for (let key in mixin) {
        switch (key) {
            case 'mixins':
                injectMixins(options, options[key])
                break
            case 'beforeCreate':
            case 'create':
            case 'created':
            case 'beforeMount':
            case 'mounted':
            case 'beforeUpdate':
            case 'updated':
            case 'beforeUnmount':
            case 'unmounted':
                injectHook(key as any, options, mixin[key] as Function | Function[])
                break
            default:
                debugger
        }
    }
    // 
    return options
}

export function injectMixins(target: any, mixins?: MixinType[]) {
    if (!mixins) return
    mixins.forEach((mixin: MixinType) => {
        injectMixin(target, mixin)
    })
    return target
}