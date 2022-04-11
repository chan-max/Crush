import { Nodes } from "@crush/types"

var createElement = (type: any, props: any, children: any) => {
    return {
        type,
        props,
        children,
        nodeType:Nodes.HTML_ELEMENT
    }
}

var Text = Symbol('Text')
var createText = (children: any) => {
    return {
        type: Text,
        children,
        nodeType:Nodes.TEXT
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

var createSheet = (props: any, children: any) => {
    return {
        type: Nodes.STYLE,
        props,
        children
    }
}

var createStyle = (selector: string, children: any) => {
    return {
        type: Nodes.STYLE_RULE,
        selector,
        children
    }
}

var createMedia = (media: string, children: any) => ({
    type: Nodes.MEDIA_RULE,
    media,
    children
})

var createKeyframes = (keyframes: any, children: any) => {
    return {
        type: Nodes.KEYFRAMES_RULE,
        keyframes,
        children
    }
}

var createKeyframe = (keyframe: any, children: any) => {
    return {
        type: Nodes.KEYFRAME_RULE,
        keyframe,
        children
    }
}

const createComponent = (component: any, props: any, slots: any) => {
    return {
        type: Nodes.COMPONENT,
        component,
        props,
        slots
    }
}

var createSupport = (support: string, children: any) => ({
    type: Nodes.SUPPORT_RULE,
    support,
    children
})

var createDeclaration = (children: any) => {
    return {
        type: Nodes.DECLARATIONS,
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
    createSheet,
    createStyle,
    createText,
    createDeclaration,
    createSupport,
    createComponent
}