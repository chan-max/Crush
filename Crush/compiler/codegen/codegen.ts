import { renderMethods, renderSource } from "./const"
import { Nodes } from "../../type/nodeType"
import {
    toFunctionCall,
    toBackQuotes,
    toArray,
    toTernaryExp,
    toString,
    objectStringify,
    toArrowFunction,
} from './stringify'
import { mergeSelectors } from "../../renderer/common/mergeSelector"

/* 针对不数量确定的节点，生成单个节点或者fragment */
export function genCode(ast: any) {
    return ast.length === 1 ? genNode(ast[0]) : genFragment(genChildren(ast))
}

function genNode(ast: any): string {
    var callFn: any
    var params: any = []
    switch (ast.nodeType) {
        case Nodes.FOR:
            return genFor(ast.iterator, genCode(ast.children))
        case Nodes.IF:
            var el = genCode(ast.children)
            return genIf(ast.condition, el)
        /* the normal element ,svgelement and component is almostly same as this  */
        case Nodes.HTMLELEMENT:
            var el = genElement(ast.tagName, ast.attrs, ast.children)
            if (ast.iterator) {
                return genFor(ast.iterator, el)
            } else {
                return el
            }
        /* text  */
        case Nodes.TEXT:
            return genText(ast.texts)
        /* style */
        case Nodes.STYLE:
            callFn = renderSource.ELEMENT
            params = [
                toString(ast.tagName),
                'null',
                toFunctionCall(renderSource.SHEET, [
                    'null',
                    ast.children ? genChildren(ast.rules) : 'null'
                ])
            ]
            break
        case Nodes.STYLERULE:
            callFn = renderSource.STYLERULE
            params = [
                genSelector(ast.selectors),
                genDeclaration(ast.declaration)
            ]
            break
        case Nodes.MEDIARULE:
            callFn = renderSource.MEDIARULE
            params = [
                toString(ast.mediaCondition),
                genChildren(ast.rules)
            ]
            break
        default:
            callFn = renderSource.ERROR
    }

    return toFunctionCall(callFn, params)
}

/* 将所有子元素包裹一层fragment */
function genFragment(ast: any) {
    return toFunctionCall(renderSource.FRAGMENT, [ast])
}

function genChildren(ast: any) {
    var children = ast.map((ast: any) => genNode(ast))
    return toArray(children)
}

/* for 循环必须用一个fragment包裹 */
function genFor(iterator: any, target: any) {
    return genFragment(
        toFunctionCall(renderSource.ITERATECALL, [
            iterator.iterable,
            toArrowFunction(target, iterator.items)
        ])
    )
}

function genIf(condition: string, target: string) {
    return toTernaryExp(condition, target, toFunctionCall(renderSource.EMPTY))
}

function genElement(tagName: string, props: any, children: any) {
    return toFunctionCall(renderSource.ELEMENT, [
        toString(tagName),
        'null',
        children ? genChildren(children) : 'null'
    ])
}

function genText(texts: any) {
    var textExp = texts.map((text: any) => {
        return text.dynamic ?
            toFunctionCall(renderSource.DATADISPLAY, [text.content]) :
            toBackQuotes(text.content)
    }).join('+')
    return toFunctionCall(renderSource.TEXT, [
        textExp
    ])
}



/* need rewrite */
function genProps(ast: any) {
    var props: any = {}
    if (ast.attributes) {
        props.attributes = {}
        ast.attributes.forEach((attribute: any) => {
            props.attributes[attribute.dynamicProperty ? `${attribute.property}` : attribute.property] = attribute.dynamicValue ? attribute.value : toString(attribute.value)
        });
    }
    if (ast.events) {
        props.events = {}
        ast.events.forEach((event: any) => {
            props.events[event.dynamicProperty ? `${event.property}` : event.property] = {
                handlers: event.dynamicValue ? event.value : toString(event.value),
                modifiers: event.modifiers.map(toString)
            }
        });
    }
    return objectStringify(props)
}

/*
    合并多个选择器，当选择其中有一个是动态的，那么所有的选择器会在运行时进行计算，并且每次更新都会重新计算
    不建议使用 ！！！
*/
function genSelector(selectors: Array<any>) {
    var contents: any = []
    var isStatic = selectors.every((selector: any) => {
        contents.push(selector.content)
        return !selector.dynamic
    })
    return isStatic ?
        toString(mergeSelectors(...contents)) :
        toFunctionCall(renderSource.MERGESELECTORS, contents.map(toBackQuotes))
}

/* 处理css样式声明和样式混入 */
function genDeclaration(declarations: any) {
    var collection: any = []
    var properties = {}
    declarations.forEach((declaration: any) => {
        if (declaration.nodeType === Nodes.DECLARATION) {
            properties[`[${declaration.dynamicProperty ? declaration.property : toString(declaration.property)}]`] = declaration.dynamicValue ? declaration.value : toString(declaration.value)
        } else if (declaration.nodeType === Nodes.MIXIN) {
            var part = objectStringify(properties)
            if (part !== '{}') {
                collection.push(part)
            }
            collection.push(declaration.mixin)
            properties = {}
        }
    });
    if (Object.keys(properties).length !== 0) {
        collection.push(objectStringify(properties))
    }
    return collection.length === 1 ? collection[0] : toFunctionCall(renderSource.PROPERTYMIXIN, collection)
}