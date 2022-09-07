import { flatRules } from './flatRules'
import { Nodes } from '@crush/const'
import {
    createStyle
} from '../vnode/css'

/* 
    不会出现条件分支或循环，但会出现fragment，
    需要再次继承父选择器
*/

import {
    mixin
} from '../common/mixin'

export function doFlat(
    rules: any[],
    flattedRules: any[],
    parent: any = null, // 保存parent的作用主要是当遍历到declaration时
    key: any = null
) {

    for (let i = 0; i < rules.length; i++) {
        var rule = rules[i]
        if (!rule) {
            continue
        }

        // 使用传来的key生成唯一的key
        var _key = key ? key + '_' + rule.key : rule.key

        rule._key = _key
        rule.parent = parent

        switch (rule.nodeType) {
            case Nodes.STYLE_RULE:
                flattedRules.push(rule)
                var _children = rule.children
                rule.children = null // children 会用存储declaration
                if (_children) {
                    doFlat(_children, flattedRules, rule, _key)
                }
                break
            case Nodes.DECLARATION:
                if (!rule.parent) {
                    debugger
                    // 声明不再任何样式规则或媒体规则下时,应该报错
                } else if (rule.parent.nodeType === Nodes.STYLE_RULE) {
                    (rule.parent.children ||= []).push(rule)
                } else if (rule.parent.nodeType === Nodes.KEYFRAME_RULE) {
                    (rule.parent.children ||= []).push(rule)
                } else {
                    /*
                        当一条样式声明不时样式规则的子节点
                    */
                    if (rule.parent.nodeType === Nodes.MEDIA_RULE) {
                        /* 
                            一条声明直接存在媒体规则下，会继承媒体规则的选择器并新建一条 styleRule 
                            此时和一直寻找parent的选择器
                        */
                        var selector, parent = rule.parent
                        while (!selector && parent) { /* 当选择器没被找到，并且parent存在时才会继续寻找 */
                            selector = parent.selector
                            parent = parent.parent
                        }
                        if (!selector) {
                            debugger
                        } else {
                            // reset the declaration to styleRule
                            var newRule: any = createStyle(selector, rule.children, key)
                            newRule._key = _key
                            flattedRules.push(newRule)
                        }
                    }
                }
                continue
            case Nodes.MEDIA_RULE:
                rule.children = flatRules(rule.children, rule)
                flattedRules.push(rule)
                break
            case Nodes.SUPPORTS_RULE:
                rule.children = flatRules(rule.children)
                flattedRules.push(rule)
                break
            case Nodes.KEYFRAMES_RULE:
                rule.children = flatRules(rule.children)
                /*
                    在此处需要把动画下的每一帧的样式处理成对象形式
                */
                rule.children.forEach((keyframe: any) => {
                    const children: [any] = keyframe.children.map((r: any) => r.children)
                    keyframe.children = mixin(...children)
                });
                flattedRules.push(rule)
                break
            case Nodes.KEYFRAME_RULE:
                /* 需要和styleRule处理方式一样 */
                flattedRules.push(rule)
                var _children = rule.children
                rule.children = null
                if (_children) {
                    doFlat(_children, flattedRules, rule)
                }
                break
            case Nodes.FRAGMENT:
                // fragment wont be a parent
                doFlat(rule.children, flattedRules, rule.parent, rule._key)
                break
        }
    }
    return flattedRules
}