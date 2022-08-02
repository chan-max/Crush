import { uid } from "@crush/common"

import { Nodes } from "@crush/core"
import { normalizeProps } from "../render/normalizeProps"


var createStyleSheet = (props: any, children: any, key: any = uid()) => {
    return {
        nodeType: Nodes.STYLE,
        type: 'style',
        children,
        props: normalizeProps(props),
        key,
    }
}

var createStyle = (selector: string, children: any, key: any = uid) => {
    return {
        nodeType: Nodes.STYLE_RULE,
        selector,
        children,
        key
    }
}

var createMedia = (media: string, children: any, key: any = uid()) => ({
    nodeType: Nodes.MEDIA_RULE,
    media,
    children,
    key
})


function createKeyframes(keyframes: any, children: any, key: any = uid()) {
    return {
        nodeType: Nodes.KEYFRAMES_RULE,
        keyframes,
        children,
        key
    }
}

function createKeyframe(keyframe: any, children: any, key: any = uid()) {
    return {
        nodeType: Nodes.KEYFRAME_RULE,
        key,
        keyframe,
        children,
    }
}



var createSupports = (supports: string, children: any, key: any = uid()) => ({
    nodeType: Nodes.SUPPORTS_RULE,
    supports,
    children,
    key
})

var createDeclaration = (children: any, key: any = uid()) => {
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
    createMedia,
    createSupports,
    createKeyframes
}