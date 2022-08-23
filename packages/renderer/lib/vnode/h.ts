import { isFunction, isObject, uid } from "@crush/common";
import { isHTMLTag, isSVGTag } from "@crush/const";
import { createKeyframe, createKeyframes } from "./css";
import { createComponent, createElement, createSVGElement } from "./dom";

export function keyframes(name: any, keyframes: any) {
    return createKeyframes(name, keyframes)
}

export function keyframe(name: any, keyframes: any) {
    return createKeyframe(name, keyframes)
}


// 手写渲染函数是时 ， 框架内部无法识别新旧dom树中是否为同一节点 ， 所以应该手动传入 唯一id ， 不然都会作为新节点，全部卸载，并全部重新挂载

export function h(type: any, props?: any, children?: any, key = uid()) {
    let vnode:any = null
    if (isObject(type) || isFunction(type)) {
        // 同时支持有状态组件和函数式组件
        if (children && !isObject(children)) {
            children = { default: children }
        }
        vnode = createComponent(type, props, children, key)
    } else if (isHTMLTag(type)) {
        vnode = createElement(type, props, children, key)
    } else if (isSVGTag(type)) {
        vnode = createSVGElement(type, props, children, key)
    }

    vnode.h = true
    return vnode
}

