import { Nodes } from "@crush/types"

function createNode(type: any, props: any, children: any) {
    return {
        type,
        props,
        children
    }
}

const createElement = (type: any, props: any, children: any) => createNode(type, props, children)

const createText = () => { }

const createSVGElement = () => { }

const createComment = () => { }

const createFragment = (children:any) => {
    return {
        type:Nodes.FRAGMENT,
        children
    }
 }

const createSheet = (props: any, children: any) => {
    return {
        type: Nodes.STYLE,
        props,
        children
    }
}

const createStyle = (selector: string, children: any) => {
    return {
        type: Nodes.STYLE_RULE,
        selector,
        children
    }
}

const createMedia = (media: string, children: any) => ({
    type: Nodes.MEDIA_RULE,
    media,
    children
})

const createKeyframes = (keyframes: any, children: any) => {
    return {
        type: Nodes.KEYFRAMES_RULE,
        keyframes,
        children
    }
}

const createKeyframe = (keyframe:any,children:any) => {
    return {
        type:Nodes.KEYFRAME_RULE,
        keyframe,
        children
    }
 }

 const createSupport = (support: string, children: any) => ({
    type: Nodes.SUPPORT_RULE,
    support,
    children
})

const createDeclaration = (children: any) => {
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
    createSupport
}