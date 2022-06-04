
const extIteratorExp = /(?:[\{\[\(]?)([\w,]+)(?:[\}\]\)]?)\s*(?:in|of)\s*(.+)/

export type Iterator = {
    iterable: string
    items: string[]
}

const parseIterator = (expression: string): Iterator => {
    const [_, items, iterable] = extIteratorExp.exec(expression) as RegExpExecArray
    return {
        iterable,
        items: items.split(',')
    }
}

export {
    parseIterator
}