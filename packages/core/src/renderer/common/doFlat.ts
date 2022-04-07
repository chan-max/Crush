import { flatRules } from './flatRules'
import { Nodes } from '@crush/types'


export function doFlat(
    rules: any[],
    flattedRules: any[],
    parent = null
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
            }
        }
    })
    return flattedRules
}