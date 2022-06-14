import { resolveOptions } from "./option";
import { ComponentType } from "./component";
import { getCurrentApp } from "../app/app";
import { emptyArray, emptyObject, isFunction, shallowCloneArray, uid } from "@crush/common";
import { injectMixins } from "./mixin";
import { reactive } from "@crush/reactivity";
import { createScope, } from "./scope";
import { createInstanceEventEmitter } from "@crush/renderer/lib/render/componentListener";


export const createComponentInstance = (options: any): ComponentInstance => new ComponentInstance(options)

// 用class 的话this指向有问题
export class ComponentInstance {
    uid = uid()
    scope = createScope(this)
    render: any
    vnode: any
    slots: any
    props: any
    attrs: any
    customOptions: any
    propsOptions: any
    emitsOptions: any
    createRender: any
    components: any
    directives: any
    rootCreate: any
    // hooks will always be an array
    create: any
    beforeCreate: any
    created: any
    beforeMount: any
    mounted: any
    beforeUnmount: any
    unmounted: any
    beforeUpdate: any
    updated: any
    events: any
    app: any
    constructor(options: any) {
        const {
            render,
            createRender,
            create,
            beforeCreate,
            created,
            beforeMount,
            mounted,
            beforeUnmount,
            unmounted,
            beforeUpdate,
            updated,
            mixins,
            components,
            directives,
            customOptions,
            propsOptions,
            emitsOptions,
        } = options

        this.beforeCreate = shallowCloneArray(beforeCreate)
        this.create = shallowCloneArray(create)
        this.created = shallowCloneArray(created)
        this.beforeMount = shallowCloneArray(beforeMount)
        this.mounted = shallowCloneArray(mounted)
        this.beforeUpdate = shallowCloneArray(beforeUpdate)
        this.updated = shallowCloneArray(updated)
        this.beforeUnmount = shallowCloneArray(beforeUnmount)
        this.unmounted = shallowCloneArray(unmounted)
        this.customOptions = customOptions
        this.propsOptions = propsOptions || emptyObject
        this.emitsOptions = emitsOptions || emptyObject
        this.components = components
        this.directives = directives
        this.render = render
        this.createRender = createRender
        let app = getCurrentApp()
        this.app = app
        injectMixins(this, mixins)
        injectMixins(this, app.mixins)
    }
}