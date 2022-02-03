import { parseHTML } from "../parser/parseHTML"
import { parseAst } from "../parser/coreParse"
import { genCode } from "./codegen"

import {
    rfs,
    scope
} from './const'

const compile = (template: string) => {
    var ast = parseHTML(template)
    parseAst(ast)
    console.log('Ast', ast);
    var code = genCode(ast)
    return new Function(scope, rfs, `with(${scope}){ 
        return ${code} 
    }`)
}

export {
    compile
}



