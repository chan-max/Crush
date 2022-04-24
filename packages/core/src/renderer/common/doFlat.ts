import { flatRules } from './flatRules'
import { Nodes } from '@crush/types'

/* 
    不会出现条件分支或循环，但会出现fragment，
    需要再次继承父选择器
*/
export function doFlat(
    rules: any[],
    flattedRules: any[],
    parent: any = null, // 保存parent的作用主要是当遍历到declaration时
    key: any = null
) {
    for (let i = 0; i < rules.length; i++) {
        var rule = rules[i]
        if (!rule) {
            // null
        } else {
            rule.parent = parent
            const nodeType = rule.nodeType
            switch (nodeType) {
                case Nodes.STYLE_RULE:
                    flattedRules.push(rule)
                    const _children = rule.children
                    rule.children = null
                    if (_children) {
                        doFlat(_children, flattedRules, rule)
                    }
                    break
                case Nodes.DECLARATION:
                    if (!rule.parent) {
                        debugger
                        // 声明不再任何样式规则或媒体规则下时
                    } else if (rule.parent.nodeType === Nodes.STYLE_RULE) {
                        (rule.parent.children ||= []).push(rule)
                    } else {
                        debugger
                    }
                    continue
                case Nodes.MEDIA_RULE:
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
                    // fragmen wont be a parent
                    doFlat(rule.children, flattedRules, rule.parent, rule.key)
                    break
            }
            if (key) {
                rule.patchKey = key + '_' + rule.key
            } else {
                rule.patchKey = rule.key
            }
        }
    }
    return flattedRules
}