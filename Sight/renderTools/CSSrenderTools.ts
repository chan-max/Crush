// css render tools and virtual stylesheet , rules

const ST_CSSStyleRule = function (selector: string, declarations: Record<string, any>) {
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

let createRule = function (selector, declarations) {
    return new ST_CSSStyleRule(selector, declarations)
}

// CSSStyleSheet

const ST_CSSStyleSheet = function (st) {

}



export {
    createRule
}