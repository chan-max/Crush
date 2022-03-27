import { doFlat } from './doFlat'
import {
    Asb
} from './ast'


function flatRules(rules: Asb[], isKeyframe = false) {
    return doFlat(rules, [], isKeyframe)
}

export {
    flatRules
}