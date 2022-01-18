import {
    toFunctionCallString,
    toBackQuotesString,
    toTernaryExpression
} from './common'
import { NodeTypes } from '../../common/tag-type/tagType'
import {
    createElementVNode,
    createFragment,
    createTextVNode,
    createComponentVNode
} from '../../renderer/vnode/vnode'




function transformAstToRenderString(ast: any) {
    switch (ast.type) {
        case NodeTypes.HTMLELEMENT:

        case NodeTypes.SVGELEMENT:

        case NodeTypes.TEXT:

        case NodeTypes.COMMENT:

        case NodeTypes.COMPONENT: 
    }

}


export {
    transformAstToRenderString
}


