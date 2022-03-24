import { doFlat } from './doFlat'
import {
    CSSNode
} from './parseCSS'


function flatRules(rules: CSSNode[], isKeyframe = false) {
    return doFlat(rules, [], isKeyframe)
}

export {
    flatRules
}