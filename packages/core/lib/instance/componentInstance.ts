import { resolveOptions } from "./option";
import { ComponentType } from "./component";
import { getCurrentApp } from "../app/app";
import { emptyArray, emptyObject, isFunction, shallowCloneArray, uid } from "@crush/common";
import { injectMixins } from "./mixin";
import { reactive } from "@crush/reactivity";
import { createRenderScope, createScope, } from "./scope";
import { createInstanceEventEmitter, addInstanceListener, removeInstanceListener, onceInstanceListener, getInstanceEvents } from "@crush/renderer/lib/render/componentListener";

import { createInstanceWatch } from "./watch";

export const createComponentInstance = (options: any, parent: any) => {
    let app = getCurrentApp()
    let instance: ComponentInstance = {
        app,
        parent,
        uid: uid(),
        update: null,
        isMounted: false,
        scope: null,
        renderScope: null,
        vnode: null, // 当前所处的vnode
        componentVnode: null,//组件虚拟节点
        updatingComponentVnode: null,
        renderingVnode: null, // 即将挂载到页面的vnode
        slots: null,
        props: null,
        attrs: null,
        refs: null,
        events: null,
        root: null,
        appearRecord: null,
        emit: null,
        on: null,
        off: null,
        once: null,
        watch: null,
        render: options.render,
        customOptions: options.customOptions,
        propsOptions: options.propsOptions,
        emitsOptions: options.emitsOptions,
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
        updated: shallowCloneArray(options.updated),
        beforePatch: shallowCloneArray(options.beforePatch),
    }

    injectMixins(instance, options.mixins)
    injectMixins(instance, app.mixins)

    instance.root = parent ? parent.root : instance
    instance.scope = createScope(instance)
    instance.renderScope = createRenderScope(instance.scope)
    instance.emit = createInstanceEventEmitter(instance)
    instance.on = (event: string, handler: any) => addInstanceListener(instance, event, handler)
    instance.off = (event: string, handler: any) => removeInstanceListener(instance, event, handler)
    instance.once = (event: string, handler: any) => onceInstanceListener(instance, event, handler)
    instance.events = getInstanceEvents(instance)
    instance.watch = createInstanceWatch(instance)
    return instance
}


export interface ComponentInstance {
    update: any
    isMounted: any
    uid: number
    scope: any
    renderScope: any
    render: any
    vnode: any // 当前所处的vnode
    componentVnode: any//组件虚拟节点
    updatingComponentVnode: any
    renderingVnode: any // 即将挂载到页面的vnode
    slots: any
    props: any
    attrs: any
    refs: any
    customOptions: any
    propsOptions: any
    emitsOptions: any
    createRender: any
    components: any
    directives: any
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
    parent: any
    root: any
    beforePatch: any
    appearRecord: any,
    emit: any,
    on: any,
    off: any,
    once: any
    watch: any
}
