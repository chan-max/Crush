import {
    createScanner
} from './scanner'

import {
    parseSelector,
} from './parseSelector'

import {
    parseAttribute,
} from './parseAttribute'


const selectorRE = /^([^{};]*)(?<!\s)\s*{/


const declarationRE = /^([\$\w!\-\(\)\.]+)\s*:\s*([^;]+);/

const singleDeclarationRE = /([\$\w!-\(\)\.]+)\s*;/

const CSSCommentRE = /\/\*([\s\S]*?)\*\//

const AtGroupRuleRE = /^@([\w]+)(\s*[^{]+)?{/
const AtLineRuleRE = /^@([\w]+)\s*([\w]+)\s*;/

const CSSDir = /^([\w-]+)\s*(?:\(([^{]*)\))?\s*{/
/*
    判断是否已保留字开头，来决定是否为指令，不需要再用 '--' 标识
*/
const cssReservedWord = /^(if|else-if|else|for|elseIf)/

import {
    AstTypes
} from './parseTemplate'

import { parseIterator } from './parseIterator'


export const parseCSS = (source: string, context: any): any => {
    var scanner = createScanner(source)
    var ast: any = [], // 存储编译结果
        stack: any = [], // 保留层级结构
        exResult: any, // 尝试捕获
        current: any,
        parent = null,
        closing = false,
        declarationGroup: any

    while (scanner.source) {
        if (scanner.startsWith('}')) {
            closing = true
        } else if (scanner.startsWith('@')) {
            /*
                一个 at-rule 是一个CSS 语句，以 at 符号开头， '@'  后跟一个标识符，并包括直到下一个分号的所有内容， 或下一个 CSS 块，以先到者为准。 --mdn
            */
            let groupPosition = scanner.indexOf('{')
            let linePosition = scanner.indexOf(';')
            if (groupPosition > linePosition) {
                // line at rule
                const [key, content]: any = scanner.exec(AtLineRuleRE)
                // todo
            } else {
                // group at rule
                const [key, content]: any = scanner.exec(AtGroupRuleRE)
                switch (key) {
                    case 'media':
                        current = {
                            type: AstTypes.MEDIA_RULE,
                            media: content
                        }
                        break
                    case 'keyframes':
                        current = {
                            type: AstTypes.KEYFRAMES_RULE,
                            keyframes: content
                        }
                        break
                    case 'supports':
                        current = {
                            type: AstTypes.SUPPORTS_RULE,
                            keyframes: content
                        }
                        break
                    case 'screen':
                        // 转换为动态 media
                        current = {
                            type: AstTypes.MEDIA_RULE,
                            media: content.trim(),
                            appConfigMedia: true // 使用应用配置
                        }
                        break
                    default:
                        debugger
                        break
                }
            }
        } else if (scanner.expect('/*')) {
            /* comment */
            scanner.exec(CSSCommentRE)
            continue
        } else if (cssReservedWord.test(scanner.source)) {
            /*
                处理指令，指令不再需要通过标识符去判断
            */
            var [dir, content]: any = scanner.exec(CSSDir)
            switch (dir) {
                case 'for':
                    current = {
                        type: AstTypes.LIST_RENDER,
                        iterator: parseIterator(content)
                    }
                    break
                case 'if':
                    current = {
                        type: AstTypes.CONDITION_RENDER_IF,
                        condition: content,
                        isBranchStart: true
                    }
                    break
                case 'else-if':
                case 'elseIf':
                    current = {
                        type: AstTypes.CONDITION_RENDER_ELSE_IF,
                        condition: content,
                        isBranch: true
                    }
                    break
                case 'else':
                    current = {
                        type: AstTypes.CONDITION_RENDER_ELSE,
                        isBranch: true
                    }
                    break
            }
        } else if (exResult = scanner.exec(selectorRE)) {
            /*
                try to get the selector
            */
            current = {
                type: AstTypes.STYLE_RULE,
                selector: parseSelector(exResult[0])
            }
        } else if ((exResult = scanner.exec(declarationRE)) || (exResult = scanner.exec(singleDeclarationRE))) {

            /*
                the last declaration must end with  " ; "
            */

            var declaration: any = parseAttribute({ attribute: exResult[0], value: exResult[1] });


            if (!declaration.value) {
                declaration.value = declaration.property // 简写形式
            }

            if (declaration.flag === '...') {
                (declarationGroup ||= []).push({
                    type: AstTypes.MIXIN,
                    mixin: declaration.property
                })
                continue
            }

            switch (declaration.flag) {
                case '$':
                    declaration.isDynamicValue = true;

                    break
                case '$--':
                    declaration.isDynamicValue = true
                    declaration.property = '--' + declaration.property
                    declaration.illegalKey = true
                    break
                case '--':
                    declaration.property = '--' + declaration.property
                    declaration.illegalKey = true
                    break
            }

            //! important
            declaration.isImportant = declaration.endFlag === '!';

            (declarationGroup ||= []).push({
                declaration,
                type: AstTypes.DECLARATION
            })
            continue
        } else {
            /* error */
            debugger
        }

        // 一下代表层级结束或开启新的层级

        if (declarationGroup) {
            // 当前层级存在样式声明
            var dg: any = {
                type: AstTypes.DECLARATION_GROUP,
                children: declarationGroup,
                parent
            };
            (parent.children ||= []).push(dg)
            declarationGroup = null
        }

        // closing only
        if (closing) {
            stack.pop()
            parent = stack[stack.length - 1]
            scanner.move(1)
            closing = false
            continue
        }

        if (!parent) {
            // while there is no parent , the currentDeclaration is meaningless
            ast.push(current)
        } else {
            var parentChildren = parent.children ||= [];
            current.parent = parent
            parentChildren.push(current)
        }

        stack.push(current);
        parent = current
    }
    return ast
}
