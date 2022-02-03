import { nodeTypeOf } from '../base/nodeType'
import { Nodes } from '../../type/nodeType'
import { camelize } from '../../common/transformString'
import { isArray } from '../../common/dataType'
import { parseAttr } from './parseAttr'
import { parseCSS } from './parseCSS'
import { parseText } from './parseText'
import { proprecessRules } from './proprecessRules'
import {
    warn, error
} from '../../common/console'
import { parseIterator } from './parseIterator'

const getValueByAttriute = (attrs: any, keys: string[]) => {
    for (var item of attrs) {
        if (keys.includes(item.attribute)) {
            return item.value
        }
    }
}

const parseAst = (
    ast: any,
    nodeType?: any  /* the default nodeType , some situation dont need to use the nodetypeof */
) => {
    if (isArray(ast)) {
        var i = 0
        var l = ast.length
        for (i; i < l; i++) {
            parseAst(ast[i], nodeType)
        }
        return
    } // 递归处理子树
    var tagName = ast.tagName = camelize(ast.tag)
    /* mark the nodetype  */
    if (nodeType) {
        nodeType = tagName === '' ? Nodes.TEXT : nodeType // 处理svg标签中的文本标签
    } else {
        nodeType = nodeTypeOf(tagName)
    }
    ast.nodeType = nodeType
    switch (nodeType) {
        case Nodes.FOR:
            /* 筛选出迭代器属性，其他的抛弃 */
            for (var item of ast.attrs) {
                if (item.attribute === '~' || item.attribute === 'iterator') {
                    ast.iterator = parseIterator(item.value)
                    break
                }
            }
            parseAst(ast.children)
            break;
        case Nodes.IF:
            ast.condition = getValueByAttriute(ast.attrs, ['~', 'conditon'])
            break
        case Nodes.HTMLELEMENT:
            if (ast.attrs) {
                parseAttr(ast)
            }
            break;
        case Nodes.SVGELEMENT:
            if (ast.children) {
                parseAst(ast.children, Nodes.SVGELEMENT)
            }
            break
        case Nodes.STYLE:
            if (ast.children) {
                var rawSheet = parseCSS(ast.children[0].content)
                ast.rules = proprecessRules(rawSheet)
            }
            break
        case Nodes.TEXT:
            ast.texts = parseText(ast.content)
            break
    }

    if (ast.children) {
        parseAst(ast.children)
    }
}

export {
    parseAst
}