import { Nodes } from "../../type/nodeType"

function createStyleRule(selector: string, declaration: any) {
    return {
        nodeType: Nodes.STYLERULE,
        selector, declaration
    }
}

function createMediaRule(media: string, rules: any) {
    return {
        nodeType: Nodes.MEDIARULE,
        media, rules
    }
}

function createKeyframesRule(name: string, rules: any) {
    return {
        nodeType: Nodes.KEYFRAMESRULE,
        name, rules
    }
}

function createKeyframeRule(frame: string, declaration: any) {
    return {
        nodeType: Nodes.KEYFRAMERULE,
        frame, declaration
    }
}

function createSupportsRule(support: string, rules: any) {
    return {
        nodeType: Nodes.SUPPORTRULE,
        support, rules
    }
}

export {
    createKeyframeRule,
    createSupportsRule,
    createKeyframesRule,
    createStyleRule,
    createMediaRule,
}

