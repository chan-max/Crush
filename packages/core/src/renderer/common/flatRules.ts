import { doFlat } from './doFlat'


function flatRules(rules: any[]) {
    console.log('unprocessed',rules)
    return doFlat(rules, [])
}

export {
    flatRules
}