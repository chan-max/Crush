import { flatRules } from './flatRules'
import { Nodes } from '../../type/nodeType'

function doFlat(rules: any, flattedRules: any) {
    rules.forEach((rule: any) => {
        switch (rule.nodeType) {
            case Nodes.STYLERULE:
                var { selector, parent, children } = rule
                rule.selectors = parent?.selectors ? [...parent.selectors, selector] : [selector] // extends the parent selector
                flattedRules.push(rule)
                if (children) {
                    doFlat(children, flattedRules)
                }
                break
            case Nodes.MEDIARULE :
            case Nodes.SUPPORTRULE :
            case Nodes.FOR :
            case Nodes.IF :
                if (rule.children){
                    rule.selectors = rule.parent?.selectors
                    rule.children = flatRules(rule.children) // emmmm 赋给children用于生成code
                    flattedRules.push(rule)
                }
                break
            case Nodes.KEYFRAMESRULE:
                break
        }
    });
    return flattedRules
}

export {
    doFlat
}