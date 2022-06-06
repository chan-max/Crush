import { Nodes } from '@crush/const'
import { doFlat } from './doFlat'

import {
    mixin
} from '../common/mixin'
import { isArray } from '@crush/common'

function flatRules(
    rules: any[],
    parent = null,
    key = null
    /* 这里传入的key是为了避免由循环产生节点中，当第一层是fragment时，无法为子节点设置上唯一的key  */
) {
    const flatted = doFlat(rules, [], parent, key)

    /*
        当一层平铺结束后 ， 处理declaration
        stylesheet 的 vdom中不会存在fragment，因为在这已经处理完了
    */
    var result: any = []
    flatted.forEach((rule: any) => {
        if (rule.nodeType === Nodes.STYLE_RULE) {
            /*
                children有多个子元素时为在规则中含有其他规则或因为指令存在而打断连续性,
                并且 ， 最终生成的vdom中不会出现declaration类型，而是直接使用map结构代替,
                仅需要处理数组结构
            */

            if (isArray(rule.children)) {
                const children: [any] = rule.children.map((r: any) => r.children)
                rule.children = (rule.children.length === 0 ? null : mixin(...children))
            }
            // 去除没有children的 style rule
            if (rule.children) {
                result.push(rule)
            }
        } else {
            result.push(rule)
        }
    })
    return result
}

export {
    flatRules
}