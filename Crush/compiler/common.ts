const toFunctionCallString = (functionName: string, ...parameters: string[]) => `${functionName}(${parameters.join(',')})`
const toBackQuotesString = (_: string) => '`' + _ + '`'

export {
    toFunctionCallString,
    toBackQuotesString
}