import { flatRules } from './flatRules'
import { Nodes } from '../../type/nodeType'

function doFlat(
    rules: any,
    flattedRules: any,
    isKeyframe = false
) {
    rules.forEach((rule: any) => {
        switch (rule.type) {
            case Nodes.STYLERULE:
                // process style and keyframe , cause parser dont
                if (isKeyframe) {
                    rule.type = Nodes.KEYFRAMERULE
                }
                debugger
                var { selector, parent, children } = rule
                rule.selectors = parent?.selectors ? [...parent.selectors, selector] : [selector] // extends the parent selector
                flattedRules.push(rule)
                if (children) {
                    doFlat(children, flattedRules)
                }
                break
            case Nodes.DECLARATION:
                (rule.parent.declaration ||= []).push(rule)
                break
            case Nodes.MEDIARULE:
            case Nodes.SUPPORTRULE:
                if (rule.children) {
                    rule.selectors = rule.parent?.selectors
                    rule.children = flatRules(rule.children) // emmmm 赋给children用于生成code
                    flattedRules.push(rule)
                }
                break
            case Nodes.FOR:
                // to down
                break
            case Nodes.IF:
                if (rule.children) {
                    // be a boat , mark the directives and redirect to the parent
                    rule.children.forEach(child => {
                        (child.dirs ||= []).push(rule)
                        child.parent = rule.parent
                    });
                    doFlat(rule.children, flattedRules)
                }
                break
            case Nodes.KEYFRAMESRULE:
                // should i ?
                if (rule.children) {
                    rule.selectors = null
                    rule.children = flatRules(rule.children, true) // emmmm 赋给children用于生成code
                    flattedRules.push(rule)
                }
                break
        }
    });
    return flattedRules
}

export {
    doFlat
}