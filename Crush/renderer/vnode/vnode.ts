
enum NODE_TYPE {
    HTMLELEMENT,
    TEXT
}

function _createStyleRule(selector: string, declaration: Record<string, any>) {
    return {
        selector,
        declaration,
        type: 1,
        ref: null
    }
}

function createElement(tag: string, attrs: any, childNodes: Array<any>) {
    return {
        tag, attrs, childNodes,
        type: NODE_TYPE.HTMLELEMENT
    }
}

function createText(text:string) {
    return {
        type:NODE_TYPE.TEXT,
        text,
    }
}

function _createSVGElement(tag: string, attrs: Record<string, unknown>, childNodes: Array<any>) {
    return {
        tag, attrs, childNodes,
        type: 'SVGElement'
    }
}





function _createMediaRule(condition: string, ruleList: Array<any>) {
    return {
        condition,
        ruleList
    }
}

function _createKeyframesRule(name: string, ruleList: Array<any>) {
    return {
        name,
        ruleList
    }
}

export {
    createElement,
    createText
}

enum CSSRULE_TYPES{
    STYLE_RULE,
    MEDIA_RULE,
    KEYFRAMES_RULE
}