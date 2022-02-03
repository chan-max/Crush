import { flatRules } from './flatRules'

function proprecessRules(ast: any) {
    return flatRules(ast, [])
}

export {
      proprecessRules
}