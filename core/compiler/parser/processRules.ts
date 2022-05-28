import { Nodes } from "../../const/node"

/*
    extend the selectors and process keyframes
*/
export const processRules = (rules: any, isKeyframe = false) => {
    rules.forEach((rule: any) => {
        switch (rule.type) {
            case Nodes.STYLE_RULE:
                const { selector, parent } = rule
                if (isKeyframe) {
                    rule.type = Nodes.KEYFRAME_RULE
                } else {
                    var extendSelectors = parent?.selectors
                    if (extendSelectors) {
                        rule.selectors = [...extendSelectors, selector]
                    } else {
                        rule.selectors = [selector]
                    }
                }
                break
            case Nodes.IF:
            case Nodes.ELSE_IF:
            case Nodes.ELSE:
            case Nodes.FOR:
            case Nodes.MEDIA_RULE:
            case Nodes.SUPPORTS_RULE:
                rule.selectors = rule.parent?.selectors
                break;
            case Nodes.KEYFRAMES_RULE:
                isKeyframe = true
                break
        }
        if (rule.children) {
            processRules(rule.children, isKeyframe)
        }
    })
}