import { camelize } from "../../common/transformString";
import { Nodes } from "../../type/nodeType";
import { parseIterator } from "./parseIterator";

const attributeExtractRE = /^([@$~])?(\()?([\w-]+)(\))?(\.)?([\w\.]+)?/

const reservedAttrMap = {
    ['~if']: Nodes.IF,
    ['~else']: Nodes.ELSE,
    ['~else-if']: Nodes.ELSEIF,
    ['~elseIf']: Nodes.ELSEIF,
    ['~for']: Nodes.FOR
}

var nativeEventOptions = ['capture', 'once', 'passive']

var handlers = /(\w+)(?:\((.*)\))?/
const parseHandlers = (exp: string) => {
    var [_, handler, args] = handlers.exec(exp)
    return {
        handler,
        argrs: args && args.split(/\s*,\s*/)
    }
}

/* 这里需要传入完整节点，根据不同的节点类型对属性进行不同的处理，对于特殊属性挂载到节点本身  */
export const parseAttr = (ast: any) => {
    ast.attrs.forEach((attr: any) => {
        switch (reservedAttrMap[attr.attribute]) {
            case Nodes.IF:
                ast.condition = attr.value
                break
            case Nodes.FOR:
                ast.iterator = parseIterator(attr.value)
                break
            default:
                var extracted = attributeExtractRE.exec(attr.attribute)
                var [
                    _,
                    flag,
                    l,
                    attrName,
                    r,
                    hasModifier,
                    modifiers
                ]: any = extracted
                attrName = camelize(attrName) //支持中划线命名
                modifiers = hasModifier && modifiers.split('.')
                var dynamicProperty = l && r
                var props = (ast.props ||= []);
                if (flag === '@') {
                    attr.nodeType = Nodes.EVENT;
                    var options
                    if (modifiers) {
                        modifiers = modifiers.filter((m: any) => {
                            if (nativeEventOptions.includes(m)) {
                                (options ||= {})[m] = true
                                return false
                            } else {
                                return true
                            }
                        })
                    }
                    props.push({
                        nodeType: Nodes.EVENT,
                        eventName: attrName,
                        modifiers,
                        options,
                        dynamicProperty,
                        ...parseHandlers(attr.value)
                    });
                } else if (flag === '~') {
                    attr.nodeType = Nodes.DIRECTIVE;
                    (ast.direvtives || (ast.directives = [])).push(attr)
                } else if (flag === '$' || !flag) {
                    attr.nodeType = Nodes.ATTRIBUTE;
                    (ast.attributes || (ast.attributes = [])).push(attr)
                }
        }
    });
}