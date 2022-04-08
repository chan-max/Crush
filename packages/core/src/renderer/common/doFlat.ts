import { flatRules } from './flatRules'
import { Nodes } from '@crush/types'

/* 
    不会出现条件分支或循环，但会出现fragment，
    需要再次继承父选择器
*/
export function doFlat(
    rules: any[],
    flattedRules: any[],
    parent: any = null
) {
    rules.forEach((rule: any) => {
        if (!rule) {
            // null
        } else {
            rule.parent = parent
            const type = rule.type
            switch (type) {
                case Nodes.STYLE_RULE:
                    flattedRules.push(rule)
                    if (rule.children) {
                        doFlat(rule.children, flattedRules, rule)
                    }
                    break
                case Nodes.DECLARATIONS:
                    break
                case Nodes.MEDIA_RULE:
                    debugger
                    rule.children = flatRules(rule.children, rule)
                    flattedRules.push(rule)
                    break
                case Nodes.SUPPORT_RULE:
                    rule.children = flatRules(rule.children)
                    flattedRules.push(rule)
                    break
                case Nodes.KEYFRAMES_RULE:
                    rule.children = flatRules(rule.children)
                    flattedRules.push(rule)
                    break
                case Nodes.KEYFRAME_RULE:
                    break
                case Nodes.FRAGMENT:
                    debugger
                    doFlat(rule.children, flattedRules)
                    break
            }
        }
    })
    return flattedRules
}