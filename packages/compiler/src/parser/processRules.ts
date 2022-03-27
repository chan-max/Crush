import { Nodes } from '@crush/types'
import {
    Asb
} from './ast'
import { parseIterator } from './parseIterator'

export const processRules = (rules: Asb[]) => {
    rules.forEach((rule: Asb) => {
        switch (rule.type) {
            case Nodes.STYLE_RULE:
                const { content, parent } = rule
                var extendSelectors = parent?.selectors
                if (extendSelectors) {
                    rule.selectors = [...extendSelectors, content]
                } else {
                    rule.selectors = [content]
                }
                break
            case Nodes.FOR:
                rule.selectors = rule.parent?.selectors
                rule.content = parseIterator(rule.content)
                rule.dirs = [rule]
                break
            case Nodes.IF:
            case Nodes.ELSE_IF:
            case Nodes.ELSE:
                rule.selectors = rule.parent?.selectors
                rule.dirs = [rule]
                break;
            case Nodes.MEDIA_RULE:
            case Nodes.SUPPORT_RULE:
                rule.selectors = rule.parent?.selectors
                break
        }
        if (rule.children) {
            processRules(rule.children)
        }
    })
}