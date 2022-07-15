import { uid } from "@crush/common"

import { Nodes } from "@crush/core"


var createStyleSheet = (props: any, children: any, key: any = uid()) => {
    return {
        nodeType: Nodes.STYLE,
        type: 'style',
        children,
        props,
        key,
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


export function createKeyframes(keyframes: any, children: any, key: any = uid()) {
    return {
        type: Nodes.KEYFRAMES_RULE,
        keyframes,
        children,
        key
    }
}

function createKeyframe(keyframe: any, children: any, key: any = uid()) {
    return {
        key,
        keyframe,
        children,
        nodeType: Nodes.KEYFRAME_RULE,
    }
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
    createMedia,
    createSupports,
}