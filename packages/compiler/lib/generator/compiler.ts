
import {
    baseParseHTML
} from '../parser/baseParseHTML'

import {
    genNodes
} from './codegen'

import {
    toArrowFunction,
    declare,
    callFn,
    toBackQuotes
} from '../stringify'

import { uVar } from '@crush/common'
import { createExpression, expressionWithScope } from '../withScope'

export const createFunction = (content: string, ...params: string[]) => new Function(...params, `${content}`)

export class CodeGenerator {

    compilerOptions: any

    code: string

    // 记录使用的方法
    methods: any = {}
    components: any = {}
    directives: any = {}


    renderScope: any

    cache: any

    handlerWithCache(handlerExpression: string) {
        // let cacheId = uVar()
        // return `(${this.cache}.${cacheId} || (${this.cache}.${cacheId} = ${handlerExpression}))`
        return handlerExpression
    }

    // 记录模板中是否使用了scoped css
    useScopedStyleSheet = false

    constructor() {
        this.code = ''
    }

    getCode = () => {
        this.unshift(declare(`{${Object.keys(this.methods).join(',')}}`, 'renderMethods'))
        return this.code
    }

    push = (code: string) => this.code += code
    unshift = (code: string) => this.code = code + this.code
    newLine = () => this.code += '\n'
    tab = () => this.code += '\t'

    pushNewLine(code: string) {
        this.newLine()
        this.push(code)
    }

    pushComment(comment: string) {
        this.code += `/*#${comment}*/`
    }

    // input an expression and hoist to the context , and return the variable name
    hoistExpression(expression: string): string {
        var varname = uVar()
        this.pushNewLine(declare(varname, expression))
        return varname
    }

    callRenderFn(fn: string, ...args: string[]): string {
        this.methods[fn] = true
        return callFn(fn, ...args)
    }

    useComponent(name: string, isDynamic: boolean) {
        // return _id or getComponent(name)
        if (isDynamic) {
            return this.callRenderFn('getComponent', name)
        } else {
            if (this.components[name]) {
                return this.components[name]
            } else {
                let component = this.hoistExpression(this.callRenderFn('getComponent', toBackQuotes(name)))
                this.components[name] = component
                return component
            }
        }
    }

    useDirective(name: string, isDynamic: boolean) {
        if (isDynamic) {
            return this.callRenderFn('getDirective', name)
        } else {
            if (this.directives[name]) {
                return this.directives[name]
            } else {
                let directive = this.hoistExpression(this.callRenderFn('getDirective', toBackQuotes(name)))
                this.directives[name] = directive
                return directive
            }
        }
    }

    parseExpressionWithRenderScope(exp: string) {
        let expInstance = createExpression(exp)
        expInstance.pushScope(this.scopes)
        let setScopedExpression = expInstance.scopedExpression(this.renderScope)
        let variables = expInstance.variables
        return {
            expression: setScopedExpression,
            variables
        }
    }


    setRenderScope(exp: string) {
        let expInstance = createExpression(exp)
        expInstance.pushScope(this.scopes)
        return expInstance.scopedExpression(this.renderScope)
    }

    scopes: any = []

    pushScope(scope: any) {
        this.scopes.push(scope)
    }

    popScope() {
        this.scopes.pop()
    }
}

import { isHTMLTag, isSVGTag } from '@crush/const'

const compilerDefaultOptions: any = {
    isHTMLTag,
    isSVGTag
}

import { processTemplateAst } from '../parser/parseTemplate'
import { compilerWithErrorCapture } from '../common'



export const compile = compilerWithErrorCapture(baseCompiler)

export function baseCompiler(template: string, compilerOptions: any = compilerDefaultOptions) {

    let start = Date.now()

    var context = new CodeGenerator()

    context.compilerOptions = compilerOptions

    // 初始化渲染作用域
    context.renderScope = context.hoistExpression(context.callRenderFn('getCurrentRenderScope'))
    // 渲染函数使用的缓存
    context.cache = context.hoistExpression(context.callRenderFn('useCurrentInstanceCache'))

    var htmlAst = baseParseHTML(template)

    processTemplateAst(htmlAst, context)

    let renderCode: any = genNodes(htmlAst, context)

    const content = `return ${toArrowFunction(renderCode)}`

    context.pushNewLine(content)
    let code = context.getCode()

    let end = Date.now()
    let render: any = {
        createRender: null,
        useScopedStyleSheet: context.useScopedStyleSheet,
        cost: end - start
    }

    eval(`render.createRender = function createRender(renderMethods){${code}}`)
    console.log(render.createRender);

    return render
}

