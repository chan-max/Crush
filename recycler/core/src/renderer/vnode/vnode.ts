import { uid } from "@crush/common"
import { Nodes } from "../../node/nodes"

function createNode(type: Nodes): any {
    return {
        type
    }
}


export const empty = ({
    type: Nodes.NULL,
    tag: Symbol('empty')
})

var createElement = (tag: any, props: any, children: any, key: any) => {
    return {
        tag,
        props,
        children,
        key,
        type: Nodes.HTML_ELEMENT,
    }
}

var Text = Symbol('Text')
var createText = (children: any, key: any) => {
    return {
        key,
        tag: Text,
        children,
        type: Nodes.TEXT
    }
}

var createSVGElement = () => { }

var createComment = () => { }

var createFragment = (children: any, key: any) => {
    return {
        type: Nodes.FRAGMENT,
        children,
        key
    }
}


var createStyleSheet = (props: any, children: any, key: any = uid()) => {
    var node = createNode(Nodes.STYLE)
    node.props = props
    node.children = children
    node.key = key
    node.tag = 'style' // used for diff
    return node
}

var createStyle = (selector: string, children: any, key: any) => {
    return {
        type: Nodes.STYLE_RULE,
        selector,
        children,
        key
    }
}

var createMedia = (media: string, children: any, key: any) => ({
    type: Nodes.MEDIA_RULE,
    media,
    children,
    key
})


var createKeyframes = (keyframes: any, children: any, key: any = uid()) => {
    var node = createNode(Nodes.KEYFRAMES_RULE)
    node.keyframes = keyframes
    node.children = children
    node.key = key
    return node
}

var createKeyframe = (keyframe: any, children: any, key: any = uid()) => {
    var node = createNode(Nodes.KEYFRAME_RULE)
    node.keyframe = keyframe
    node.children = children
    node.key = key
    return node
}

const createComponent = (tag: any, props: any, children: any, key: any = uid()) => {
    var node = createNode(Nodes.COMPONENT)
    node.tag = tag
    node.props = props
    node.children = children
    node.key = key
    return node
}

var createSupports = (supports: string, children: any, key: any) => ({
    type: Nodes.SUPPORTS_RULE,
    supports,
    children,
    key
})

var createDeclaration = (children: any, key: any) => {
    return {
        type: Nodes.DECLARATION,
        /*
            render function 生成vdom时，会直接合并declaration和mixin，所以此时不再存在declaration group，而是用declaration替代 ， 在进行flat处理时也不会存在declarationgroup
        */
        //type: Nodes.DECLARATION_GROUP,
        children,
        key
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
    createSupports,
    createComponent
}