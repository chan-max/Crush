import { nodeTypeOf } from '../base/nodeType'
import { Nodes } from '../../type/nodeType'
import { camelize } from '../../common/transformString'
import { isArray } from '../../common/dataType'
import { parseAttr } from './parseAttr'
import { parseCSS } from './parseCSS'
import { parseText } from './parseText'
import { flatRules } from './flatRules'
import {
    warn, error
} from '../../common/console'
import { parseIterator } from './parseIterator'

import {
    DOMAst,
    DOMAstNode,
    DOMAttr
} from './parseHTML'

const findAttr = (attrs: Array<DOMAttr>, keys: string[]) => {
    for (var item of attrs) {
        if (keys.includes(item.attribute)) {
            return item.value
        }
    }
}

const analyzer = (
    ast: DOMAst | DOMAstNode,
    type?: Nodes  /* the default type , some situation dont need to use the typeof */
): undefined => {
    if (isArray(ast)) {
        var i = 0
        var l = ast.length
        for (i; i < l; i++) {
            analyzer(ast[i], type)
        }
        return
    } // 递归处理子树
    /*
        tag和tagName的不同点在于一个是经过处理的
    */
    var tagName = ast.tagName = camelize(ast.tag)
    /* mark the type  */
    if (type) {
        type = tagName === '' ? Nodes.TEXT : type // 处理svg标签中的文本标签
    } else {
        type = nodeTypeOf(tagName)
    }
    ast.type = type
    switch (type) {
        case Nodes.FOR:
            /* 筛选出迭代器属性 */
            var rawIterator = findAttr(ast.attrs, ['--', 'iterator'])
            ast.iterator = parseIterator(rawIterator)
            break;
        case Nodes.IF:
            ast.condition = findAttr(ast.attrs, ['--', 'conditon'])
            break
        case Nodes.HTMLELEMENT:
            if (ast.attrs) {
                parseAttr(ast)
            }
            break;
        case Nodes.SVGELEMENT:
            if (ast.children) {
                analyzer(ast.children, Nodes.SVGELEMENT)
                /*
                    当一个标签是svg时，其所有子标签也为svg，不需要再进行判断
                */
                return
            }
            break
        case Nodes.STYLE:
            var styleTemplate = ast.children?.[0].content
            if (styleTemplate) {
                var rawSheet = parseCSS(styleTemplate)
                ast.children = flatRules(rawSheet) /* flat */
            }
            return
        case Nodes.TEXT:
            /* 
                分析text文本，将其中的动态文本分离出来
            */
            ast.texts = parseText(ast.content)
            break
    }

    if (ast.children) {
        analyzer(ast.children)
    }
}

export {
    analyzer
}