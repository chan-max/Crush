import { AstTypes } from "./parseTemplate"

/*
    extend the selectors and process keyframes
*/
export const processRules = (rules: any, context: any, isKeyframe = false) => {
    rules.forEach((rule: any) => {
        let shouldPopScope = false
        switch (rule.type) {
            case AstTypes.STYLE_RULE:
                if (isKeyframe) {
                    rule.type = AstTypes.KEYFRAME_RULE
                } else {
                    const { selector, parent } = rule
                    var extendSelectors = parent?.selectors
                    if (extendSelectors) {
                        rule.selectors = [...extendSelectors, selector]
                    } else {
                        rule.selectors = [selector]
                    }
                }
                break
            case AstTypes.CONDITION_RENDER_IF:
                rule.selectors = rule.parent?.selectors
                break
            case AstTypes.CONDITION_RENDER_ELSE_IF:
                rule.selectors = rule.parent?.selectors
                break
            case AstTypes.CONDITION_RENDER_ELSE:
                rule.selectors = rule.parent?.selectors
                break
            case AstTypes.LIST_RENDER:
                rule.selectors = rule.parent?.selectors
                break
            case AstTypes.MEDIA_RULE:
                rule.selectors = rule.parent?.selectors
                break
            case AstTypes.SUPPORTS_RULE:
                rule.selectors = rule.parent?.selectors
                break;
            case AstTypes.KEYFRAMES_RULE:
                isKeyframe = true
                break
            case AstTypes.DECLARATION:
            case AstTypes.DECLARATION_GROUP:
                break
        }
        if (rule.children) {
            processRules(rule.children, context, isKeyframe)
        }
        if (shouldPopScope) {
            context.popScope()
        }
    })
} 