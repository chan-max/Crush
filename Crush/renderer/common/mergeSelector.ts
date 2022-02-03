
const groupSelectorDelimiter = /\s*,\s*/

function mergeSelector(parent: string, child: string) {
    return parent.split(groupSelectorDelimiter).map((p: string) => {
        return child.split(groupSelectorDelimiter).map((c: string) => {
            var refP = false
            var merged = c.replace('&', () => {
                refP = true
                return p
            })
            return refP ? merged : p + ' ' + c
        }).join(',')
    }).join(',')
}


const mergeSelectors = (...selectors: string[]) => selectors.reduce(mergeSelector)

export {
    mergeSelector,
    mergeSelectors
}