import { doFlat } from './doFlat'

function flatRules(rules: any, isKeyframe = false) {
    return doFlat(rules, [],isKeyframe)
}

export {
    flatRules
}