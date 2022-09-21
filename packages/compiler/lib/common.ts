
export function compilerWithErrorCapture(compiler: any) {
    return (...args: any) => {
        try {
            return compiler(...args)
        } catch (e) {
            console.error('[compile error]', e);
            return null
        }
    }
}

export function returnStringExpressionBooleanValue(expression: any) {
    // while an expression dont contain any variables , try to get the boolean value
    let value
    try {
        value = eval(expression)
    } catch (e) {
        console.error(expression, 'is not a legal expression')
    }
    return !!value
}