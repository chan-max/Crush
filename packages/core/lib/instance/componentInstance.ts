import { resolveOptions } from "./option";
import { ComponentType } from "./component";
import { getCurrentApp } from "../app/app";
import { emptyArray, emptyObject, isFunction, shallowCloneArray, uid } from "@crush/common";
import { injectMixins } from "./mixin";
import { reactive } from "@crush/reactivity";
import { createScope, } from "./scope";
import { createInstanceEventEmitter } from "@crush/renderer/lib/render/componentListener";


export function createComponentInstance(options: ComponentType | Function | any) {
    const instance: any = {
        uid: uid(),
        scope: null,
        render: options.render, // 手写render
        vnode: null,
        slots: null,
        props: null,
        attrs: null,
        events: null,
        emit: null,
        root: null,
        parent: null,
        customOptions: options.customOptions,
        propsOptions: options.propsOptions || emptyObject,
        emitsOptions: options.emitsOptions || emptyObject,
        createRender: options.createRender,
        components: options.components,
        directives: options.directives,
        // hooks will always be an array
        create: shallowCloneArray(options.create),
        beforeCreate: shallowCloneArray(options.beforeCreate),
        created: shallowCloneArray(options.created),
        beforeMount: shallowCloneArray(options.beforeMount),
        mounted: shallowCloneArray(options.mounted),
        beforeUnmount: shallowCloneArray(options.beforeUnmount),
        unmounted: shallowCloneArray(options.unmounted),
        beforeUpdate: shallowCloneArray(options.beforeUpdate),
        updated: shallowCloneArray(options.updated)
    }
    instance.scope = createScope(instance)
    var app = getCurrentApp()
    instance.emit = createInstanceEventEmitter(instance)
    injectMixins(instance, app.mixins)
    injectMixins(instance, options.mixins)
    return instance
}


// export const createComponentInstance = (options: any) => new ComponentInstance(options)

// 用class 的话this指向有问题
export class ComponentInstance {
    uid = uid()
    scope = null
    render: any
    vnode: any
    slots: any
    props = null
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

        this.scope = createScope(this)
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
        injectMixins(this, mixins)
        injectMixins(this, app.mixins)
    }

    events: any = null
    emit(name: string, ...args: any[]) {
        debugger
        const handler = this.events[name]
        debugger
        if (handler) {
            handler(...args)
        }
    }

}