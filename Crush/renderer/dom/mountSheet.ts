import { Nodes } from "../../type/nodeType";
import {
    mountStyleRule,
    mountMediaRule,
    mountSupportsRule,
    mountKeyframesRule,
    mountKeyframeRule
} from "./mountRules";



export const mountSheet = (sheet: any, rules: any) => {
    var config = {
        unit: 'px'
    }
    rules.forEach((rule: any) => {
        var index = sheet.cssRules.length
        switch (rule.nodeType) {
            case Nodes.STYLERULE:
                mountStyleRule(sheet, rule, index, config)
                break
            case Nodes.MEDIARULE:
                mountMediaRule(sheet, rule, index)
                break
            case Nodes.SUPPORTRULE:
                mountSupportsRule(sheet, rule, index)
                break
            case Nodes.KEYFRAMESRULE:
                mountKeyframesRule(sheet, rule, index)
                break
            case Nodes.KEYFRAMERULE:
                mountKeyframeRule(sheet, rule, index, config)
                break
        }
    });
}