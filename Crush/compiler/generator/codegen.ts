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
    dynamicMapKey,
    callFn
} from './stringify'
import { mergeSelectors } from "../../renderer/common/mergeSelector"
import { important } from "../../renderer/common/important"

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
            var el = genElement(ast)
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
            return genSheet('null', ast.children)
        case Nodes.STYLERULE:
            return genStyleRule(ast)
        case Nodes.MEDIARULE:
            callFn = renderSource.MEDIARULE
            params = [
                toString(ast.mediaCondition),
                genChildren(ast.children)
            ]
            break
        case Nodes.SUPPORTRULE:
            callFn = renderSource.SUPPORTRULE
            params = [
                toString(ast.support),
                genChildren(ast.children)
            ]
            break
        case Nodes.KEYFRAMESRULE:
            callFn = renderSource.KEYFRAMESRULE
            params = [
                toString(ast.keyframesName),
                genChildren(ast.children)
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

function genProps(props: any) {
    var propsMap: any = {}
    props.forEach((prop: any) => {
        switch (prop.nodeType) {
            case Nodes.EVENT:
                var {
                    eventName,
                    modifiers,
                    dynamicProperty,
                    handler,
                    options,
                    argrs
                } = prop;
                if (argrs) {
                    handler = toArrowFunction(
                        toFunctionCall(handler, argrs),
                        ['$event']
                    )
                }
                if (modifiers) {
                    handler = toFunctionCall(renderSource.CREATEEVENT, [
                        handler,
                        toArray(
                            modifiers.map(toString)
                        )
                    ])
                }
                (propsMap.events ||= {})[
                    dynamicProperty ?
                        dynamicMapKey(eventName) :
                        eventName
                ] = {
                    handler,
                    options
                }
                break
        }
    })

    return objectStringify(propsMap)
}

function genElement(ast: any) {
    var params = [
        toString(ast.tagName)
    ]
    var hasProps = false
    if (ast.props) {
        hasProps = true
        params.push(genProps(ast.props))
    }
    if (ast.children) {
        if (!hasProps) {
            params.push('null')
        }
        params.push(
            genChildren(ast.children)
        )
    }
    return toFunctionCall(renderSource.ELEMENT, params)
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

function genSheet(props: any, rules: any) {
    return toFunctionCall(
        renderSource.SHEET,
        [
            props || 'null',
            genChildren(rules)
        ]
    )
}

/*
    合并多个选择器，当选择其中有一个是动态的，那么所有的选择器会在运行时进行计算，并且每次更新都会重新计算
    不建议使用 ！！！
*/
function genSelector(selectors: Array<any>) {
    if (selectors.length === 1) {
        return toBackQuotes(selectors[0].content)
    }

    //! one dynamic , all dynamic ,so use carefully

    var contents: any = []
    var isStatic = selectors.every((selector: any) => {
        contents.push(selector.content)
        return !selector.dynamic
    })
    return isStatic ?
        toString(mergeSelectors(...contents)) :
        callFn(renderSource.MERGESELECTORS, contents.map(toBackQuotes))
}

/* 处理css样式声明和样式混入 */
function genDeclaration(declarations: any) {
    var collection: any = []
    var properties = {}
    declarations.forEach((declaration: any) => {
        if (declaration.nodeType === Nodes.DECLARATION) {
            var property = `[${declaration.dynamicProperty ? declaration.property : toString(declaration.property)}]`
            var value = declaration.dynamicValue ? declaration.value : toString(declaration.value)
            value = declaration.important ? important(value) : value
            properties[property] = value
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

function genStyleRule(ast) {
    var callFn, selectors
    /*
        keframes will not extend the parentSelector,
        so , put into the root list
        and we can know which is the style and keyframe by 
        is there selectors or selector on the ast
    */
    if (ast.selectors) {
        callFn = renderSource.STYLERULE
        selectors = ast.selectors
    } else {
        callFn = renderSource.KEYFRAMESRULE
        selectors = [ast.selector]
    }
    return toFunctionCall(callFn, [
        genSelector(selectors),
        ast.declaration ? genDeclaration(ast.declaration) : renderSource.NULL
    ])
}
