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

/*
    comment : ! 66666
*/



export function h(type: any, props?: any, children?: any, key = uid()) {
    if (isObject(type) || isFunction(type)) {
        // 同时支持有状态组件和函数式组件
        if (children && !isObject(children)) {
            children = {default: children }
        }
        return createComponent(type, props, children, key)
    } else if (isHTMLTag(type)) {
        return createElement(type, props, children, key)
    } else if (isSVGTag(type)) {
        return createSVGElement(type, props, children, key)
    }
}