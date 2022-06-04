
// we can use $(exp) as a dynamic content

var extractDynamicSelector = /\$\(([^\)s]*)\)/g

export type SelectorType = {
    isDynamic: boolean,
    selectorText: string
}

export function parseSelector(selector: string): SelectorType {
    var isDynamic = false
    return {
        selectorText: selector.replace(extractDynamicSelector, (_, content): string => {
            isDynamic = true
            return '${' + content + '}'
        }),
        isDynamic
    }
}