

export function returnStringExpressionBooleanValue(expression: any) {
    // while an expression dont contain any variables , try to get the boolean value
    let value
    try {
        value = eval(expression)
    } catch (e) {
        debugger
    }
    return !!value
}