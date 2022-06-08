import { initOptions } from "./option";
import { ComponentType } from "./component";
import { getCurrentApp } from "../app/app";
import { shallowCloneArray, uid } from "@crush/common";
import { injectMixins } from "./mixin";
import { reactive } from "@crush/reactivity";
import { initScope } from "./scope";


export type ComponentInstanceType = any

export function createComponentInstance(options: ComponentType): ComponentInstanceType {
    if (!options._isOptions) {
        initOptions(options)
    }
    var app = getCurrentApp()
    const instance: ComponentInstanceType = {
        uid: uid(),
        scope: reactive(initScope()),
        render: null,
        vnode: null,
        slots: null,
        props: null,
        customOptions: options.customOptions,
        propsOptions: options.propsOptions,
        emitsOptions: options.emitsOptions,
        createRender: options.createRender,
        components: options.components,
        directives: options.directives,
        // hooks will always be an array
        beforeCreate: shallowCloneArray(options.beforeCreate),
        create: shallowCloneArray(options.create),
        created: shallowCloneArray(options.created),
        beforeMount: shallowCloneArray(options.beforeMount),
        mounted: shallowCloneArray(options.mounted),
        beforeUnmount: shallowCloneArray(options.beforeUnmount),
        unmounted: shallowCloneArray(options.unmounted),
        beforeUpdate: shallowCloneArray(options.beforeUpdate),
        updated: shallowCloneArray(options.updated)
    }

    if (app.mixins) {
        injectMixins(instance, app.mixins)
    }
    return instance
}