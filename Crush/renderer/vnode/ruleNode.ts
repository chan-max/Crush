import { Nodes } from "../../type/nodeType"

function createSheet(config: any, rules: any) {
    return {
        nodeType: Nodes.SHEET,
        config,
        rules
    }
}

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

function createSupportRule(condition: string, rules: any) {
    return {
        nodeType: Nodes.SUPPORTRULE,
        condition, rules
    }
}

export {
    createKeyframeRule,
    createSupportRule,
    createKeyframesRule,
    createStyleRule,
    createMediaRule,
    createSheet
}

