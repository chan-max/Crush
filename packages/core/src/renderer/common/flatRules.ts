import { Nodes } from '@crush/types'
import { doFlat } from './doFlat'

import {
    mixin
} from '../common/mixin'

function flatRules(rules: any[], parent = null) {
    const flatted = doFlat(rules, [], parent)
    // 当一层平铺结束后 ， 处理declaration

    flatted.forEach((rule: any) => {
        if (rule.type === Nodes.STYLE_RULE) {
            const declarations: [any] = rule.children.map((r: any) => r.children)
            rule.children = mixin(...declarations)
        }
    })

    return flatted
}

export {
    flatRules
}