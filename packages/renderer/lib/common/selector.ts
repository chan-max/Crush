


const groupSelectorDelimiter = /\s*,\s*/
const splitSelector = (selector: string): string[] => selector.split(groupSelectorDelimiter)
const joinSelector = (splitedSelector: string[]): string => splitedSelector.join(',')



function mergeSelector(p: string, c: string) {
    var useParentSelector = false  // is using & 
    var merged = c.replace('&', () => {
        useParentSelector = true
        return p
    })
    return useParentSelector ? merged : p + ' ' + c  // default merge
}


/*
    ['header','footer'] , ['h1','h2'] ===> ['header h1' , 'header h2' , 'footer h1' , 'footer h2']
*/


function mergeSplitedSelector(parent: string[], children: string[]): string[] {
    return parent.map((p: string) => {
        return children.map((c: string) => mergeSelector(p, c))
    }).reduce((x, y) => x.concat(y))
}

const mergeSplitedSelectors = (...selectors: string[][]): string[] => selectors.reduce(mergeSplitedSelector)

const mergeSplitedSelectorsAndJoin = (...selectors: string[][]): string => joinSelector(mergeSplitedSelectors(...selectors))


function mergeSelectors(...selectors: string[]) {
    return mergeSplitedSelectors(...selectors.map(splitSelector)).join(',')
}



export {
    splitSelector,
    mergeSplitedSelector,
    mergeSelectors,
    joinSelector,
    mergeSplitedSelectorsAndJoin
}


function baseSetSelectorAttribute(selector: string, attribute: string) {
    let pseduoClassPosition = selector.indexOf(':')
    if (pseduoClassPosition < 0) {
        return `${selector}[${attribute}]`
    } else {
        return `${selector.slice(0, pseduoClassPosition)}[${attribute}]${selector.slice(pseduoClassPosition)}`
    }
}

export function setSelectorAttribute(selector: string, attribute: string) {
    return joinSelector(splitSelector(selector).map((sel: string) => baseSetSelectorAttribute(sel, attribute)))
}