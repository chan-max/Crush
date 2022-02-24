import {
    isArray,
    isNumber,
} from '../../common/dataType'

import {
    mountSheet
} from './mountSheet'

function toStyleMapString(property: string, value: any, important: boolean, config: any): any {
    return `${property}:${isArray(value) ?
        value.reduce((res: string, valueItem: any) => res + ' ' + (isNumber(valueItem) ? valueItem + config.unit : valueItem), '') : isNumber(value) ?
            value + config.unit : value}${important ? ' !important' : ''};`
}

// mount single styleRule , for instance, body{...styleMap}
function createStyleRuleString(selector: string, declaration: any, config: any) {
    return `${selector}{${Object.entries(declaration).map(([property, value]: any) => {
        var important: any
        if (value.important) {
            important = true
            value = value.value
        }
        return toStyleMapString(property, value, important, config)
    }).join('')}}`
}

export const mountStyleRule = (sheet: any, rule: any, index: number, config: any) => {
    const {
        selector,
        declaration
    } = rule
    var ruleString: any = createStyleRuleString(selector, declaration, config)
    sheet.insertRule(ruleString, index)
}

export const mountMediaRule = (sheet: any, rule: any, index: number) => {
    const {
        media,
        rules
    } = rule
    sheet.insertRule(`@media ${media}{}`, index)
    mountSheet(sheet.cssRules[index], rules)
}

export const mountSupportsRule = (sheet: any, rule: any, index: number) => {
    const {
        support,
        rules
    } = rule
    sheet.insertRule(`@supports ${support}{}`, index)
    mountSheet(sheet.cssRules[index], rules)
}

export const mountKeyframesRule = (sheet: any, rule: any, index: number) => {
    const {
        name,
        rules
    } = rule
    sheet.insertRule(`@keyframes ${name}{}`, index)
    mountSheet(sheet.cssRules[index], rules)
}

export const mountKeyframeRule = (sheet: any, rule: any, index: number, config: any) => {
    const {
        frame,
        declaration
    } = rule
    var ruleString: any = createStyleRuleString(frame, declaration, config)
    sheet.appendRule(ruleString)
}