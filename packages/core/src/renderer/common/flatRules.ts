import { doFlat } from './doFlat'


function flatRules(rules: any[], parent = null) {
    console.log('unprocessed', rules)
    const flatted = doFlat(rules, [], parent)
    debugger
    return flatted
}

export {
    flatRules
}