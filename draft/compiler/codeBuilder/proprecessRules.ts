import { flatNestingRules } from './flatNestingRules'

function proprecessRules(ast: any) {
    return flatNestingRules(ast, [])
}

export {
      proprecessRules
}