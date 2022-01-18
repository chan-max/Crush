import { proprecessRules } from './proprecessRules'
import {NodeTypes} from '../types'

function flatNestingRules(ast: any, flatRules: any) {
    ast.forEach((rule: any) => {
        if (rule.type === NodeTypes.STYLE) {
            var { parent, declaration, children, selector } = rule
            var selectors /* selectors is the collection of all nesting selectors */
            if (parent) {
                selectors = [...parent.selectors, selector]
            } else {
                selectors = [selector]
            }
            rule.selectors = selectors
            flatRules.push({
                selectors, declaration,
                type: NodeTypes.STYLE
            })
            flatNestingRules(children, flatRules)
        } else if (rule.type === NodeTypes.MEDIA) {
            rule.selectors = rule.parent.selectors
            flatRules.push({
                media: rule.mediaCondition,
                rules: proprecessRules(rule.children),
                type: 'media'
            })
        } else if (rule.type === NodeTypes.KEYFRAMES) {
            flatRules.push({
                keyframesName: rule.keyframesName,
                keyframe: rule.children
            })
        }
    });
    return flatRules
}

export {
    flatNestingRules
}