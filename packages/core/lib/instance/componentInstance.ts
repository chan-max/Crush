import { resolveOptions } from "./option";
import { ComponentType } from "./component";
import { getCurrentApp } from "../app/app";
import { emptyArray, emptyObject, createPureObject, isFunction, shallowCloneArray, shallowCloneObject, uid } from "@crush/common";
import { injectMixins } from "./mixin";
import { reactive } from "@crush/reactivity";
import { createRenderScope, createScope, } from "./scope";
import { createInstanceEmit, addInstanceListener, removeInstanceListener, onceInstanceListener, getInstanceEvents, createInstanceOn, createInstanceOff, createInstanceOnce } from "@crush/renderer/lib/render/componentListener";

import { createInstanceWatch } from "./watch";
import { getCurrentInstance } from "@crush/renderer";

export function useCurrentInstanceCache() {
    return getCurrentInstance().cache
}

export const createComponentInstance = (options: any, parent: any) => {
    let app = getCurrentApp()
    let instance: ComponentInstance = {
        app,
        parent,
        options, // 保存自身的配置来源
        cache: createPureObject(), // 缓存点啥
        uid: uid(),
        update: null,
        name: options.name, // name options
        componentName: null,
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
        provides: null,
        useScopedStyleSheet: options.useScopedStyleSheet,
        renderEffect: null,
        render: options.render,
        scopedId: options.scopedId,
        propsOptions: options.propsOptions || emptyObject,
        emitsOptions: options.emitsOptions || emptyObject,
        createRender: options.createRender,
        components: shallowCloneObject(options.components), // 不同组件定义的name可能不同
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
        activated: shallowCloneArray(options.activated),
        deactivated: shallowCloneArray(options.deactivated),
        beforeRouteEnter: shallowCloneArray(options.beforeRouteEnter),
        beforeRouteLeave: shallowCloneArray(options.beforeRouteLeave),
        beforeRouteUpdate: shallowCloneArray(options.beforeRouteUpdate)
    }

    injectMixins(instance, options.mixins)
    injectMixins(instance, app.mixins)
    instance.scope = createScope(instance)
    instance.renderScope = createRenderScope(instance.scope)
    instance.emit = createInstanceEmit(instance)
    instance.on = createInstanceOn(instance)
    instance.off = createInstanceOff(instance)
    instance.once = createInstanceOnce(instance)
    instance.events = getInstanceEvents(instance)
    instance.watch = createInstanceWatch(instance)
    
    if (parent) {
        instance.root = parent.root

        // 保留在父组件中的注册名称
        let parentComponents = parent.components || emptyObject
        for (let name in parentComponents) {
            if (parentComponents[name] === options) {
                instance.componentName = name
            }
        }
    } else {
        instance.root = instance // 根组件
    }

    return instance
}


export interface ComponentInstance {
    cache: any
    update: any
    isMounted: any,
    options: any
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
    propsOptions: any
    emitsOptions: any
    createRender: any
    components: any
    directives: any
    provides: any
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
    watch: any,
    renderEffect: any,
    activated: any,
    deactivated: any
    beforeRouteEnter: any,
    beforeRouteLeave: any
    beforeRouteUpdate: any
    scopedId: any,
    useScopedStyleSheet: any,
    name: any,
    componentName: any // 组件在父组件中定义的名称
}

