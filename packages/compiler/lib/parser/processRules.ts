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
                    let { selector, parent } = rule
                    if (selector.isDynamic) {
                        selector.selectorText = context.setRenderScope(selector.selectorText)
                    }
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
                rule.condition = context.setRenderScope(rule.condition)
                break
            case AstTypes.CONDITION_RENDER_ELSE_IF:
                rule.selectors = rule.parent?.selectors
                rule.condition = context.setRenderScope(rule.condition)
                break
            case AstTypes.CONDITION_RENDER_ELSE:
                rule.selectors = rule.parent?.selectors
                break
            case AstTypes.LIST_RENDER:
                rule.selectors = rule.parent?.selectors
                let iterator = rule.iterator
                iterator.iterable = context.setRenderScope(iterator.iterable)
                context.pushScope(iterator.items)
                shouldPopScope = true
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
                let declaration = rule.declaration
                if (declaration.isDynamicProperty) {
                    declaration.property = context.setRenderScope(declaration.property)
                }
                if (declaration.isDynamicValue) {
                    declaration.value = context.setRenderScope(declaration.value)
                }
                break
            case AstTypes.MIXIN:
                rule.mixin = context.setRenderScope(rule.mixin)
                break
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