var extractActiveSelector = /\$\[([^\]]*)\]/g

function parseSelector(selector: string) {
    var dynamic = false
    return {
        content: selector.replace(extractActiveSelector, (_, content): string => {
            dynamic = true
            return '${' + content + '}'
        }),
        dynamic
    }
}

export {
    parseSelector
}