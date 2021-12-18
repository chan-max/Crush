var RE_variable = /(?<!\.)([$_a-zA-Z][$_a-zA-Z0-9]*)/g
function scopedExpression(expression: string, except:any[] = [],scope = 'scope',) {
    return expression.replace(RE_variable, (v): string => {
        return  except.includes(v) ? v : scope + '.' + v 
    })
}

export {
    scopedExpression
}