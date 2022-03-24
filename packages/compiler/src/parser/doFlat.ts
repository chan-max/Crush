import { flatRules } from './flatRules'
import { Nodes } from '@crush/types'
import {
    CSSNode
} from './parseCSS'
import { Selector } from './parseSelector';
import { parseIterator } from './parseIterator';

function doFlat(
    rules: CSSNode[],
    flattedRules: any,
    isKeyframe = false
) {
    rules.forEach((rule: CSSNode) => {
        switch (rule.type) {
            case Nodes.STYLE_RULE:
                // process style and keyframe , cause parser dont
                var { content, parent, children: _children } = rule
                /*
                    keyframe wont extend the selectors
                */
                if (isKeyframe) {
                    rule.type = Nodes.KEYFRAME_RULE
                } else {
                    rule.selectors = parent?.selectors ? [...parent.selectors, content] : [content] // extends the parent selector
                }
                flattedRules.push(rule)
                rule.children = []
                if (_children) {
                    doFlat(_children, flattedRules)
                }
                break
            case Nodes.DECLARATION:
                rule.parent?.children?.push(rule)
                break
            case Nodes.MIXIN:
                rule.parent?.children?.push(rule)
                break
            case Nodes.MEDIA_RULE:
            case Nodes.SUPPORT_RULE:
                if (rule.children) {
                    rule.selectors = rule.parent?.selectors
                    rule.children = flatRules(rule.children)
                    flattedRules.push(rule)
                }
                break
            case Nodes.FOR:
                if (rule.children) {
                    rule.children.forEach((childRule: CSSNode) => {
                        (childRule.dirs ||= []).push({
                            type: Nodes.FOR,
                            content: parseIterator(rule.content as string)
                        })
                        childRule.parent = rule.parent
                    })
                    doFlat(rule.children, flattedRules)
                }
                break
            case Nodes.IF:
                debugger
                break
            case Nodes.ELSE_IF:
                debugger
                break
            case Nodes.ELSE:
                debugger
                break
            case Nodes.KEYFRAMES_RULE:
                // should i ?
                if (rule.children) {
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