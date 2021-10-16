// css render tools and virtual stylesheet , rules

const ST_CSSStyleRule:any = function (this:any,selector: string, declarations:any) {
    this.type = 'styleRule'
    this.selector = selector
    this.declarations = declarations
}

ST_CSSStyleRule.prototype.getCSSText = function () {
    let selector = this.selector
    let declarations = this.declarations
    let declarationsString = Object.keys(declarations).reduce((res, key) => `${res}${key}:${declarations[key]};`, '')
    return `${selector}{${declarationsString}}`
}

let createRule = function (selector:string, declarations:any) {
    return new ST_CSSStyleRule(selector, declarations)
}

let x = new ST_CSSStyleRule()

// CSSStyleSheet




const styleRenderHelper = {
    createRule
}

export {
    styleRenderHelper
}