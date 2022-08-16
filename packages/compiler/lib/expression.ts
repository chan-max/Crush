

const jsVar = /[\$_A-Za-z][A-Za-z0-9]*/g

// 提取一段表达式中的所有变量
export function extractExpressionVariables(expression: string) {
    return new Expression(expression).variables
}

class Expression {

    expression = '' // 

    processingExpression = ''

    variables = []

    constructor(expression: string) {
        this.expression = expression
        this.processingExpression = expression
        while (this.processingExpression) {
            this.process()
        }
    }

    process() {
        this.processingExpression = this.processingExpression.trim()
        if (this.processingExpression[0] === "'" || this.processingExpression[0] === '"') {
            this.processString()
        } else if (this.processingExpression[0] === '`') {
            this.processTemplateString()
        }

    }

    

    processString() {
        let stringEnd = this.processingExpression.indexOf(this.processingExpression[0], 1)
        this.processingExpression = this.processingExpression.slice(stringEnd + 1)
    }

    processTemplateString() {
        debugger
    }

}

// { x:ad(x,y)}

