function ST_CSSStyleRule(selector,declarations){
    this.selector = selector
    this.declarations = declarations
}

function ST_CSSMediaRule(condition,cssRules){
    this.condition = condition
    this.cssRules = cssRules
}

function ST_CSSKeyframesRule(name, CSSKeyframeRules){
    this.name = name
    this.CSSKeyframeRules = CSSKeyframeRules
}

function ST_CSSKeyframeRule(key,declarations){
    this.key = key
    this.declarations = declarations
}

//--------------------------------------------------
function createStyle(selector,declarations){
    return new ST_CSSStyleRule(selector,declarations)
}

function createMedia(condition,cssRules){
    return new ST_CSSMediaRule(condition,cssRules)
}

function createKeyframes(name, CSSKeyframeRules){
    return new ST_CSSKeyframesRule(name, CSSKeyframeRules)
}

function createKeyframe(key,declarations){
    return new ST_CSSKeyframeRule(key,declarations)
}




export {
    createStyle,
    createMedia,
    createKeyframe,
    createKeyframes
}