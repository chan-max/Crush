import { Nodes } from "@crush/types"


export const empty = ({
    type: Symbol('empty')
})

var createElement = (type: any, props: any, children: any, key: any) => {
    return {
        type,
        props,
        children,
        key,
        nodeType: Nodes.HTML_ELEMENT,
    }
}

var Text = Symbol('Text')
var createText = (children: any, key: any) => {
    return {
        key,
        type: Text,
        children,
        nodeType: Nodes.TEXT
    }
}

var createSVGElement = () => { }

var createComment = () => { }

var createFragment = (children: any) => {
    return {
        nodeType: Nodes.FRAGMENT,
        children
    }
}

var createStyleSheet = (props: any, children: any, key: any) => {
    return {
        nodeType: Nodes.STYLE,
        props,
        children,
        key
    }
}

var createStyle = (selector: string, children: any, key: any) => {
    return {
        nodeType: Nodes.STYLE_RULE,
        selector,
        children,
        key
    }
}

var createMedia = (media: string, children: any, key: any) => ({
    nodeType: Nodes.MEDIA_RULE,
    media,
    children,
    key
})

var createKeyframes = (keyframes: any, children: any, key: any) => {
    return {
        nodeType: Nodes.KEYFRAMES_RULE,
        keyframes,
        children,
        key
    }
}

var createKeyframe = (keyframe: any, children: any, key: any) => {
    return {
        nodeType: Nodes.KEYFRAME_RULE,
        keyframe,
        children,
        key
    }
}

const createComponent = (component: any, props: any, slots: any) => {
    return {
        nodeType: Nodes.COMPONENT,
        component,
        props,
        slots
    }
}

var createSupport = (support: string, children: any, key: any) => ({
    nodeType: Nodes.SUPPORT_RULE,
    support,
    children,
    key
})

var createDeclaration = (children: any) => {
    return {
        nodeType: Nodes.DECLARATION,
        /*
            render function 生成vdom时，会直接合并declaration和mixin，所以此时不再存在declaration group，而是用declaration替代 ， 在进行flat处理时也不会存在declarationgroup
        */
        //nodeType: Nodes.DECLARATION_GROUP,
        children
    }
}

export {
    createComment,
    createElement,
    createFragment,
    createKeyframe,
    createKeyframes,
    createMedia,
    createSVGElement,
    createStyleSheet,
    createStyle,
    createText,
    createDeclaration,
    createSupport,
    createComponent
}