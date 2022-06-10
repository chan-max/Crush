import { initOptions } from "./option";
import { ComponentType } from "./component";
import { getCurrentApp } from "../app/app";
import { emptyArray, emptyObject, isFunction, shallowCloneArray, uid } from "@crush/common";
import { injectMixins } from "./mixin";
import { reactive } from "@crush/reactivity";
import { initScope } from "./scope";


export type ComponentInstanceType = any

export function createComponentInstance(options: ComponentType | Function | any): ComponentInstanceType {

    //! 创建组件实例只支持 选项式组件 ，和返回值时render函数的函数组件 

    const isFunctional = isFunction(options)
    if (isFunctional) {
        options = emptyObject
    } else if (!options._isOptions) {
        initOptions(options)
    }

    const instance: ComponentInstanceType = {
        uid: uid(),
        scope: reactive(initScope()),
        render: options.render, // 手写render
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
        rootCreate: isFunctional ?  options : options.rootCreate,
        create: null,
        created: shallowCloneArray(options.created),
        beforeMount: shallowCloneArray(options.beforeMount),
        mounted: shallowCloneArray(options.mounted),
        beforeUnmount: shallowCloneArray(options.beforeUnmount),
        unmounted: shallowCloneArray(options.unmounted),
        beforeUpdate: shallowCloneArray(options.beforeUpdate),
        updated: shallowCloneArray(options.updated),
        isFunctional,
    }
    var app = getCurrentApp()
    if (app.mixins) {
        injectMixins(instance, app.mixins)
    }
    if (options.mixins) {
        injectMixins(instance, options.mixins)
    }
    return instance
}