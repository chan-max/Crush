/*
    
*/

const groupSelectorDelimiter = /\s*,\s*/

const splitSelector = (selector: string) => selector.split(groupSelectorDelimiter)
const joinSelector = (selectors: Array<string>) => selectors.join(',')

function mergeSelector(parentSelector: string, childSelector: string) {
    var parentSelectors = splitSelector(parentSelector)
    var childSelectors = splitSelector(childSelector)
    var processedParentSelectors = parentSelectors.map(
        (parentSelectorItem) => {
            var processedChildSelectors = childSelectors.map((childSelectorItem) => {
                var referencingParentSelector = false
                var res = childSelectorItem.replace('&', () => {
                    referencingParentSelector = true
                    return parentSelectorItem
                })
                return referencingParentSelector ? res : parentSelectorItem + ' ' + childSelectorItem
            })
            return joinSelector(processedChildSelectors)
        }
    )
    return joinSelector(processedParentSelectors)
}

function mergeMultipleSelector(...selectors: Array<string>): string {
    if (selectors.length > 2) {
        var parentSelector = selectors[0]
        selectors.shift()
        return mergeSelector(parentSelector , mergeMultipleSelector(...selectors))
    } else {
        return mergeSelector(selectors[0], selectors[1])
    }
}

export {
    mergeSelector,
    mergeMultipleSelector
}