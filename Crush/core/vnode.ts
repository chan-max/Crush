
enum NODE_TYPE {
    ELEMENT = 1
}

function _createStyleRule(selector:string,declaration:Record<string,any>) {
    return {
        selector,
        declaration,
        type: 1,
        ref:null
    }
}

function _createElement(tag:string,attrs:any,childNodes:Array<any>) {
    return {
        tag,attrs,childNodes,
        type:'ELEMENT'
    }
}

function _createSVGElement(tag:string,attrs:Record<string,unknown>,childNodes:Array<any>) {
    return {
        tag,attrs,childNodes,
        type:'SVGElement'
    }
}

function _createCommont(text:string){
    return {
        tag:'!',
        text,
        type:'COMMENT'
    }
}

function _createTextNode(text:string){
    return {
        tag:'',
        text,
        type:'TEXT'
    }
}

function _createMediaRule(condition:string,ruleList:Array<any>) {
    return {
        condition,
        ruleList
    }
}

function _createKeyframesRule(name:string,ruleList:Array<any>) {
    return {
        name,
        ruleList
    }
}

export {
    _createStyleRule,
    _createCommont,
    _createElement,
    _createSVGElement,
    _createTextNode
}