import { doFlat } from './doFlat'

function flatRules(ast: any) {
    return doFlat(ast, [])
}

export {
      flatRules
}