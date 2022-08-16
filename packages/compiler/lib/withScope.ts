
/*
    examples
    x => scope.x
    x + y 
    x.y

*/


function setScope(variable: string, scope: string) {
    return scope + '.' + variable
}

type Expression = {
    content: string
    isStatic: boolean
}

function createExpression(content: string, isStatic: boolean = false): Expression {
    return {
        content,
        isStatic
    }
}

const extractString = /(['"])[^\1]*\1/g

function extractStringTokens(exp: string): Expression[] {
    let tokens: Expression[] = [], cursor = 0, token
    while (token = extractString.exec(exp)) {
        let str = token[0]
        let length = str.length
        let index = token.index
        if (token.index > cursor) {
            tokens.push(createExpression(exp.slice(cursor, index)))
        }
        tokens.push(createExpression(str, true))
        cursor = index + length
    }
    if (cursor < exp.length) {
        tokens.push(createExpression(exp.slice(cursor, exp.length)))
    }
    return tokens
}









const variableRE = /[\$_a-zA-Z][a-zA-Z0-9]*/g

function replaceVariable(expression: string, scope: string) {
    return expression.replace(variableRE, (variable) => {
        return setScope(variable, scope)
    })
}


const enum WithScopeSteps {
    START = 0,

    PROCESS_STRING,

    // PROCESS_TEMPLATE_STRING,

    REPLACE_VARIABLE,

}



function expressionTokensToResult(expressions: Expression[], scope: string, stepsIndex: number) {
    return expressions.reduce((result: string, { content, isStatic }: Expression) => {
        return result + (isStatic ? content : withScope(content, scope, stepsIndex))
    }, '')
}

export function withScope(expression: string, scope: string = 'Crush', stepsIndex = 0): string {
    switch (stepsIndex) {
        case WithScopeSteps.START:
            return withScope(expression, scope, stepsIndex + 1)
        case WithScopeSteps.PROCESS_STRING:
            let stringTokens = extractStringTokens(expression)
            return expressionTokensToResult(stringTokens, scope, stepsIndex + 1)
        case WithScopeSteps.REPLACE_VARIABLE:
            return replaceVariable(expression, scope)
    }
    return ''
}




