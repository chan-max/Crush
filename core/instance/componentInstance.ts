import { initOptions } from "./option";
import { ComponentType } from "./component";
import { getCurrentApp } from "../app/app";
import { uid } from "@crush/common";
import { injectMixins } from "./mixin";
import { reactive } from "../reactivity/reactive";
import { initScope } from "./scope";


export type ComponentInstanceType = {

}

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
        createRender: options.createRender,
        components: options.components,
        directives: options.directives,
        // hooks will always be an array
        beforeCreate: options.beforeCreate && [...options.beforeCreate as Function[]],
        create: options.create && [...options.create as Function[]],
        created: options.created && [...options.created as Function[]],
        beforeMount: options.beforeMount && [...options.beforeMount as Function[]],
        mounted: options.mounted && [...options.mounted as Function[]],
        beforeUnmount: options.beforeUnmount && [...options.beforeUnmount as Function[]],
        unmounted: options.unmounted && [...options.unmounted as Function[]],
        beforeUpdate: options.beforeUpdate && [...options.beforeUpdate as Function[]],
        updated: options.updated && [...options.updated as Function[]]
    }

    if (app.mixins) {
        injectMixins(instance, app.mixins)
    }
    return instance
}