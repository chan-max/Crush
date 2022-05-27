

// parse for codegen 

import { isArray } from "@crush/common"
import { isHTMLTag, isSVGTag } from "../../const/tag"

const context = {
    isHTMLTag,
    isSVGTag
}
  
export function processAst(ast: any) {
    if (isArray(ast)) {
        ast.forEach(processAst)
        return
    }



}