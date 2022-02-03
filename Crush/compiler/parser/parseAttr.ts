import { camelize } from "../../common/transformString";
import { Nodes } from "../../type/nodeType";
import { parseIterator } from "./parseIterator";

const attributeExtractRE = /^([@$~])?(\[)?([\w-]+)(\])?(\.)?([\w\.]+)?/

/* 这里需要传入完整节点，根据不同的节点类型对属性进行不同的处理，对于特殊属性挂载到节点本身  */
export const parseAttr = (ast: any) => {
    ast.attrs.forEach((attr: any) => {
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
        attr.property = camelize(attrName)
        attr.modifiers = hasModifier && modifiers.split('.')
        attr.dynamicProperty = l && r
        attr.dynamicValue = flag
        if (flag === '@') {
            attr.nodeType = Nodes.EVENT;
            (ast.events || (ast.events = [])).push(attr)
        } else if (flag === '~') {
            if(attr.property === 'for'){
                ast.iterator = parseIterator(attr.value)
            }
            attr.nodeType = Nodes.DIRECTIVE;
            (ast.direvtives || (ast.directives = [])).push(attr)
        } else if (flag === '$' || !flag) {
            attr.nodeType = Nodes.ATTRIBUTE;
            (ast.attributes || (ast.attributes = [])).push(attr)
        }
    });
}