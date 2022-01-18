const toFunctionCallString = (functionName: string, parameters: string[]) => `${functionName}(${parameters.join(',')})`
const toBackQuotesString = (_: string): string => '`' + _ + '`'
const toTernaryExpression = (condition: string, expressionIfTrue: string, exprssionIfFalse: string): string => `${condition}?${expressionIfTrue}:${exprssionIfFalse}`


export {
    toFunctionCallString,
    toBackQuotesString,
    toTernaryExpression
}