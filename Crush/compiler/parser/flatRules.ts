import { proprecessRules } from './proprecessRules'
import { Nodes } from '../../type/nodeType'

function flatRules(rules: any, flattedRules: any) {
    rules.forEach((rule: any) => {
        if (rule.nodeType === Nodes.STYLERULE) {
            var { selector, parent, children } = rule
            if (parent?.selectors) {
                rule.selectors = [...parent.selectors, selector]
            } else {
                rule.selectors = [selector]
            }
            flattedRules.push(rule)
            flatRules(children, flattedRules)
        } else if (rule.nodeType === Nodes.MEDIARULE || rule.nodeType === Nodes.SUPPORTRULE) {
            rule.selectors = rule.parent?.selectors
            rule.rules = proprecessRules(rule.children)
            flattedRules.push(rule)
        } else if (rule.type === Nodes.KEYFRAMESRULE) {
            flattedRules.push(rule)
        }
    });
    return flattedRules
}

export {
    flatRules
}