import { uid } from "@crush/common"
import { Nodes } from "@crush/const"
import { createNode } from './dom'

var createStyleSheet = (props: any, children: any, key: any = uid()) => {
    var node = createNode(Nodes.STYLE)
    node.props = props
    node.children = children
    node.key = key
    node.type = 'style' // used for diff
    return node
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



var createSupports = (supports: string, children: any, key: any) => ({
    nodeType: Nodes.SUPPORTS_RULE,
    supports,
    children,
    key
})

var createDeclaration = (children: any, key: any) => {
    return {
        nodeType: Nodes.DECLARATION,
        /*
            render function 生成vdom时，会直接合并declaration和mixin，所以此时不再存在declaration group，而是用declaration替代 ， 在进行flat处理时也不会存在declarationgroup
        */
        //type: Nodes.DECLARATION_GROUP,
        children,
        key
    }
}

export {
    createStyleSheet,
    createStyle,
    createDeclaration,
    createKeyframe,
    createKeyframes,
    createMedia,
    createSupports,
}