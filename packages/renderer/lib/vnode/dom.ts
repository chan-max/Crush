import { isFunction, isObject, mark, uid } from "@crush/common"
import { Nodes } from "@crush/const"
import { resolveOptions } from "@crush/core"
import { normalizeProps } from "../render/normalizeProps"

const COMPONENT_TYPE = Symbol('ComponentType')

function createComponent(
    type: any,
    props: any, children: any,
    key: any = uid(),
    dynamicProps: any = null,
    isDynamicComponent: any = false // 是否是动态组件生成的组件vnode
) {
    let componentFlag = type[COMPONENT_TYPE]
    if (!componentFlag) {
        // stateful component
        if (isObject(type)) {
            componentFlag = Nodes.COMPONENT
            resolveOptions(type)
        } else if (isFunction(type)) {
            // render component
            componentFlag = Nodes.RENDER_COMPONENT
        }
        mark(type, COMPONENT_TYPE, componentFlag)
    }

    // 记录组件被使用多少次
    if (type.count === undefined) {
        type.count = 0
    } else {
        type.count++
    }

    return {
        uid: uid(),
        nodeType: componentFlag,
        type,
        props: normalizeProps(props),
        isDynamicComponent,
        children,
        key,
        dynamicProps
    }
}

function createElement(type: string, props?: any, children?: any, key: any = uid(), dynamicProps: any = null, shouldUpdateChildren: any = true) {
    return {
        nodeType: Nodes.HTML_ELEMENT,
        type,
        props: normalizeProps(props),
        children,
        key,
        shouldUpdateChildren,
        dynamicProps
    }
}

export function createSVGElement(type: string, props: any, children: any, key: any = uid(), dynamicProps: any = null, shouldUpdateChildren: any = true) {
    return {
        nodeType: Nodes.SVG_ELEMENT,
        type,
        props: normalizeProps(props),
        children,
        key,
        shouldUpdateChildren,
        dynamicProps,
    }
}



export const Text = Symbol('Text')

// the key is for other node
function createText(children: any, key = uid(), isDynamic: any = false) {
    return {
        nodeType: Nodes.TEXT,
        children,
        key,
        isDynamic,
        type: Text
    }
}

export const Comment = Symbol('Comment')
export function createComment(text: any, key = uid()) {
    return {
        type: Comment,
        nodeType: Nodes.HTML_COMMENT,
        children: text,
        key
    }
}

function createFragment(children: any, key = uid()) {
    return {
        nodeType: Nodes.FRAGMENT,
        children,
        key
    }
}


export {
    createComponent,
    createElement,
    createText,
    createFragment,
}