import { parseHTML } from "../parser/parseHTML"
import { analyzer } from "../parser/analyzer"
import { genCode } from "./codegen"

import {
    rfs,
    scope
} from './const'

const compile = (template: string) => {
    var ast = parseHTML(template)
    analyzer(ast)
    console.log('Ast', ast);
    var code = genCode(ast)
    console.log('Code',code);
    return new Function(scope, rfs, `with(${scope}){ 
        return ${code} 
    }`)
}

export {
    compile
}



