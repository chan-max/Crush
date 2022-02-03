

const extIteratorExp = /(?:[\{\[\(]?)([\w,]+)(?:[\}\]\)]?)\s*(?:in|of)\s*(.+)/

const parseIterator = (expression: string) => {
    const [_, items, iterable]: any = extIteratorExp.exec(expression)
    return {
        iterable,
        items: items.split(',')
    }
}

export {
    parseIterator
}