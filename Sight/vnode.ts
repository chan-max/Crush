
function _createCommont(text:string){
    return {
        tagName:'!',
        text
    }
}

function _createTextNode(text:string){
    return {
        tagName:'',
        text
    }
}

function _createStyleRule(selector:string,declaration:Record<string,any>) {
    return {
        selector,
        declaration,
        type: 1,
        ref:null
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
    _createStyleRule
}