import { isArray, isString } from "@crush/common"


export function findStringFromArray(str: string, arr: any): boolean {
    let find = false
    for (let item of arr) {
        if (isArray(item)) {
            return findStringFromArray(str, item)
        } else if (isString(item)) {
            if (str === item) {
                find = true
                break
            }
        }
    }
    return find
}

export class Expression {

    // 记录表达式中用到的变量
    variables: any = []

    expression: string

    scope = '_' // 默认值

    constructor(expression: string) {
        this.expression = expression
    }

    scopeStack: any = []

    pushScope(scope: string | string[]) {
        this.scopeStack.push(scope)
    }

    popScope() {
        this.scopeStack.pop()
    }

    isVariable(variable: string) {
        return !findStringFromArray(variable, this.scopeStack)
    }

    setScope(variable: any, scope: any = this.scope) {
        if (this.isVariable(variable)) {
            this.variables.push(variable)
            return scope + '.' + variable
        } else {
            return variable
        }
    }

    scopedExpression(scoped: string) {
        this.scope = scoped
        return expressionWithScope(this.expression, this)
    }
}


export function createExpression(expression: string) {
    return new Expression(expression)
}


let isJsVarStart = (str: string) => /^[\$_a-zA-Z]/.test(str)

const jsVarRE = /[\$_A-Za-z][A-Za-z0-9]*/

export function expressionWithScope(expression: string, expressionContext: Expression) {
    let processingExpression = expression || ''
    let withScopedExpression = ''

    let lastIsVar = false // 记录上一个处理的是不是变量

    while (processingExpression = processingExpression.trim()) {

        let firstLetter = processingExpression[0]

        switch (firstLetter) {
            case '"':
            case "'":
                // string
                let stringEnd = processingExpression.indexOf(firstLetter, 1)
                let stringContent = processingExpression.slice(0, stringEnd + 1)
                withScopedExpression += stringContent
                processingExpression = processingExpression.slice(stringEnd + 1)
                lastIsVar = false
                break
            case '`':
                let templateStringEnd = findTemplateStringEnd(processingExpression)
                let templateString = processingExpression.slice(0, templateStringEnd + 1)
                let withScopedTemplateString = templateStringWithScope(templateString, expressionContext)
                withScopedExpression += withScopedTemplateString
                processingExpression = processingExpression.slice(templateStringEnd + 1)
                lastIsVar = false
                break
            case '{':
                // object
                let objectEnd = findNextCodeBlockClosingPosition(processingExpression)
                let object = processingExpression.slice(0, objectEnd + 1)
                let withScopedObject = objectExpressionWithScope(object, expressionContext)
                withScopedExpression += withScopedObject
                processingExpression = processingExpression.slice(objectEnd + 1)
                lastIsVar = false
                break
            case '[':
                if (lastIsVar) {
                    // dynamic object key
                    let dynamicObjectKeyEnd = findNextCodeBlockClosingPosition(processingExpression)
                    let dynamicObjectKey = processingExpression.slice(1, dynamicObjectKeyEnd)
                    let withScopedDynamicObjectKey = expressionWithScope(dynamicObjectKey, expressionContext)
                    withScopedExpression += `[${withScopedDynamicObjectKey}]`
                    processingExpression = processingExpression.slice(dynamicObjectKeyEnd + 1)
                    lastIsVar = true
                } else {
                    // array
                    let arrayEnd = findNextCodeBlockClosingPosition(processingExpression)
                    let array = processingExpression.slice(0, arrayEnd + 1)
                    let withScopedArray = arrayExpressionWithScope(array, expressionContext)
                    withScopedExpression += withScopedArray
                    processingExpression = processingExpression.slice(arrayEnd + 1)
                    lastIsVar = false
                }
                break
            case '(':
                let blockEnd = findNextCodeBlockClosingPosition(processingExpression)
                let blockContent = processingExpression.slice(1, blockEnd)
                let restContent = processingExpression.slice(blockEnd + 1)
                if (lastIsVar) {
                    // 函数调用  , 参数也应该设置作用域
                    withScopedExpression += `(${listExpressionWithScope(blockContent, expressionContext)})`
                    processingExpression = processingExpression.slice(blockEnd + 1)
                    lastIsVar = true
                } else if (restContent.trim().startsWith('=>')) {
                    // 箭头函数
                    let args = extractArrayFunctionArgs(blockContent) // 箭头函数的形参
                    let fnContent = restContent.trim().slice(2).trim()
                    expressionContext.pushScope(args)
                    let withScopedFnContent = expressionWithScope(fnContent, expressionContext)
                    expressionContext.popScope()
                    withScopedExpression += `(${args.join(',')})=>${withScopedFnContent}`
                    processingExpression = ''
                } else {
                    // 当做普通结构体处理
                    withScopedExpression += `(${expressionWithScope(blockContent, expressionContext)})`
                    processingExpression = processingExpression.slice(blockEnd + 1)
                }
                break
            case '.':
                let isObjectKey = isJsVarStart(processingExpression.slice(1))
                if (lastIsVar && isObjectKey) {
                    let jsVar = (jsVarRE.exec(processingExpression) as any)[0]
                    // 忽略该字符串
                    withScopedExpression += `.${jsVar}`
                    processingExpression = processingExpression.slice(jsVar.length + 1)
                    lastIsVar = true
                } else {
                    withScopedExpression += '.'
                    processingExpression = processingExpression.slice(1)
                    lastIsVar = false
                }
                break
            default:
                if (isJsVarStart(processingExpression)) {
                    // 合理的变量名开头
                    let jsVar = (jsVarRE.exec(processingExpression) as any)[0]
                    let restContent = processingExpression.slice(jsVar.length)

                    if (restContent.trim().startsWith('=>')) {
                        // array function
                        // 没有括号的情况只能有一个参数
                        let arg = jsVar
                        let fnContent = restContent.trim().slice(2).trim()
                        expressionContext.pushScope(arg)
                        let withScopedFnContent = expressionWithScope(fnContent, expressionContext)
                        expressionContext.popScope()
                        withScopedExpression += `${jsVar}=>${withScopedFnContent}`
                        processingExpression = '' // 直接介素
                        lastIsVar = false
                    } else {
                        // 普通的 js变量
                        withScopedExpression += expressionContext.setScope(jsVar)
                        processingExpression = processingExpression.slice(jsVar.length)
                        lastIsVar = true
                    }
                } else {
                    // 其他特殊符号
                    withScopedExpression += processingExpression.slice(0, 1)
                    processingExpression = processingExpression.slice(1)
                }
                break
        }
    }

    return withScopedExpression
}

export function extractArrayFunctionArgs(argsExpression: any): any {
    if (!argsExpression.trim()) {
        return []
    }
    let commaList = findFirstLevelComma(argsExpression)
    let items = devideString(argsExpression, commaList)
    let args: any = []
    items.forEach((item: string) => {
        item = item.trim()
        if (item.startsWith('{')) {
            item.slice(1, -1).split(',').forEach((_item: string) => {
                let deArgs: any = _item.split(':') // rename args
                if (deArgs.length === 1) {
                    args.push(deArgs[0])
                } else {
                    args.push(deArgs[1])
                }
            })
        } else {
            args.push(item)
        }
    })
    return args
}

export function objectExpressionWithScope(objectExpression: string, expressionContext: any) {
    objectExpression = objectExpression.trim()
    let objectContent = objectExpression.slice(1, objectExpression.length - 1)
    let positions = findFirstLevelComma(objectContent)

    // 去除首尾空格
    let objectTokens = devideString(objectContent, positions).map((token: string) => token.trim()).filter(Boolean)
    let withScopedKeyValue: string[] = []

    objectTokens.forEach((keyValue: string) => {
        if (keyValue.startsWith('[')) {
            // dynamic object key , dynamicKey 一定没有简写
            let dynamicKeyEndPosition = findNextCodeBlockClosingPosition(keyValue)
            let dynamicKey = keyValue.slice(1, dynamicKeyEndPosition) // 去掉中括号 
            let withScopedDynamicKey = '[' + expressionWithScope(dynamicKey, expressionContext) + ']'
            let value = keyValue.slice(dynamicKeyEndPosition + 1).trim().slice(1) // 去掉最开始冒号
            let withScopedValue = expressionWithScope(value, expressionContext)
            withScopedKeyValue.push(`${withScopedDynamicKey}:${withScopedValue}`)
        } else {
            let keyValueDeviderPosition = keyValue.indexOf(':')
            if (keyValueDeviderPosition === -1) {
                // 对象key简写
                withScopedKeyValue.push(`${keyValue}:${expressionContext.setScope(keyValue, expressionContext)}`)
            } else {
                let key = keyValue.slice(0, keyValueDeviderPosition)
                let value = keyValue.slice(keyValueDeviderPosition + 1)
                withScopedKeyValue.push(`${key}:${expressionWithScope(value, expressionContext)}`)
            }
        }
    })

    return `{${withScopedKeyValue.join(',')}}`
}

export function findTemplateStringEnd(templateString: string): any {
    // 必须以反引号开头
    let cursor = 1
    while (true) {
        // 当字符串没闭合时，会寻找
        let nextBackQuotePosition = templateString.indexOf('`', cursor)
        let templateStartPosition = templateString.indexOf('${', cursor)

        if (templateStartPosition === -1 || templateStartPosition > nextBackQuotePosition) {
            return nextBackQuotePosition
        } else {
            // 存在template
            let templateEnd = findNextCodeBlockClosingPosition(templateString, templateStartPosition + 1) // 会用 ${ 的 { 去寻找
            // 第一个template 结束
            cursor = templateEnd
        }
    }
}

function templateStringWithScope(templateString: string, expressionContext: any) {
    // 必须以反引号开头 结尾
    let result = '`'
    let cursor = 1
    while (cursor <= templateString.length - 1) {
        let nextBackQuotePosition = templateString.indexOf('`', cursor)
        let templateStartPosition = templateString.indexOf('${', cursor)
        if (templateStartPosition === -1 || templateStartPosition > nextBackQuotePosition) {
            // 只会执行一次
            let restStaticContent = templateString.slice(cursor, templateString.length)
            result += restStaticContent
            return result
        } else {
            // 存在template
            let templateEnd = findNextCodeBlockClosingPosition(templateString, templateStartPosition + 1) // 会用 ${ 的 { 去寻找
            // 第一个template 结束
            let staticContent = templateString.slice(cursor, templateStartPosition)
            let templateContent = templateString.slice(templateStartPosition + 2, templateEnd) // +2 是把 ${ 去掉
            let withScopedTempalteContent = expressionWithScope(templateContent, expressionContext)
            result += staticContent
            result += '${' + withScopedTempalteContent + '}'
            cursor = templateEnd + 1
        }
    }
    return result
}

// 使用 ， 分隔
function listExpressionWithScope(expression: string, expressionContext: Expression) {
    let commaList = findFirstLevelComma(expression)
    let items = devideString(expression, commaList)
    return items.map((item: string) => expressionWithScope(item, expressionContext)).join(',')
}

export function arrayExpressionWithScope(arrayExpression: string, expressionContext: Expression) {
    return `[${listExpressionWithScope(arrayExpression.slice(1, -1), expressionContext)}]`
}



function isCodeBlockOpening(letter: string) {
    return letter === '(' || letter === '[' || letter === '{'
}

function isCodeBlockClosing(letter: string) {
    return letter === ')' || letter === ']' || letter === '}'
}

const codeBlockOpeningToClosing: any = {
    '{': '}',
    '[': ']',
    '(': ')'
}

export function findNextCodeBlockClosingPosition(exp: string, findIndex: number = 0): any {

    let open = exp[findIndex]
    let close = codeBlockOpeningToClosing[open]
    let blockStack = 0
    for (let i = findIndex; i < exp.length; i++) {
        let letter = exp[i]

        // 忽视普通字符串
        if (letter === '"' || letter === "'") {
            let stringEnd = exp.indexOf(letter, i + 1)
            i = stringEnd
            continue
        }

        // 模板字符串
        if (letter === '`') {
            let rawTemplate = exp.slice(i)
            let templateStringEnd = findTemplateStringEnd(rawTemplate)
            // 忽略掉 template string
            i += templateStringEnd
        }

        if (letter === close && blockStack === 1) {
            return i
        }

        if (isCodeBlockOpening(letter)) {
            blockStack++
        } else if (isCodeBlockClosing(letter)) {
            blockStack--
        }
    }
}



function findFirstLevelComma(objectExpression: string) {
    let blockStack = 0
    let positions: number[] = []
    for (let i = 0; i < objectExpression.length; i++) {
        let letter = objectExpression[i]
        if (letter === ',') {
            // object devider
            if (blockStack == 0) { // 默认最外层也会计算在内
                positions.push(i)
            }
        } else if (isCodeBlockOpening(letter)) {
            blockStack++
        } else if (isCodeBlockClosing(letter)) {
            blockStack--
        }
    }
    return positions
}



function devideString(str: string, positions: number[]) {
    // 忽略 position 位置的字符
    let slicePositions = [-1, ...positions, str.length]
    let strs = []
    for (let i = 0; i < slicePositions.length - 1; i++) {
        strs.push(str.slice(slicePositions[i] + 1, slicePositions[i + 1]))
    }
    return strs
}

