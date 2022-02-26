import { doFlat } from './doFlat'

function flatRules(rules: any) {
    return doFlat(rules, [])
}

export {
    flatRules
}