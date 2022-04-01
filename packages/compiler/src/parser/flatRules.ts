import { doFlat } from './doFlat'
import {
    Asb
} from './ast'


function flatRules(rules: Asb[]) {
    return doFlat(rules, [])
}

export {
    flatRules
}