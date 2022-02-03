
var mustacheRE = /\{\{(.*?)\}\}/g

export var parseText = (text: string) => {
    var texts: any = []
    var cursor = 0
    text.replace(mustacheRE, (capture: string, expression: string, index: number): any => {
        var staticString = text.substring(cursor, index).trim()
        if (staticString) {
            texts.push({
                dynamic: false,
                content: staticString
            })
        }
        if (expression = expression.trim()) {
            texts.push({
                dynamic: true,
                content: expression
            })
        }
        cursor = index + capture.length
    })

    var staticString = text.substring(cursor, text.length).trim()
    if (staticString) {
        texts.push({
            dynamic: false,
            content: staticString
        })
    }
    return texts
}

