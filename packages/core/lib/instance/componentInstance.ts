import { resolveOptions } from "./option";
import { ComponentType } from "./component";
import { getCurrentApp } from "../app/app";
import { emptyArray, emptyObject, isFunction, shallowCloneArray, uid } from "@crush/common";
import { injectMixins } from "./mixin";
import { reactive } from "@crush/reactivity";
import { createRenderScope, createScope, } from "./scope";
import { createInstanceEventEmitter, addInstanceListener, removeInstanceListener, onceInstanceListener } from "@crush/renderer/lib/render/componentListener";
import { emitInstancetEvent } from "@crush/renderer";

export const createComponentInstance = (options: any, parent: any): ComponentInstance => new ComponentInstance(options, parent)

// 用class 的话this指向有问题
export class ComponentInstance {
    update: any
    isMounted: any
    uid = uid()
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
    parent: any
    root: any
    beforePatch: any
    appearRecord: any
    constructor(options: any, parent: any) {
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
            beforePatch,
            mixins,
            components,
            directives,
            customOptions,
            propsOptions,
            emitsOptions,
        } = options
        this.parent = parent
        this.root = parent ? parent.root : this
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
        this.beforePatch = beforePatch
        this.propsOptions = propsOptions || emptyObject
        this.emitsOptions = emitsOptions || emptyObject
        this.components = components
        this.directives = directives
        this.render = render
        this.createRender = createRender
        let scope = createScope(this)
        this.scope = scope
        this.renderScope = createRenderScope(scope)
        let app = getCurrentApp()
        this.app = app
        injectMixins(this, mixins)
        injectMixins(this, app.mixins)
    }

}