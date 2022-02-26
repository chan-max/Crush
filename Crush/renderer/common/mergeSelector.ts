
const groupSelectorDelimiter = /\s*,\s*/

function mergeSelector(parent: string, child: string) {
    return parent.split(groupSelectorDelimiter).map((p: string) => {
        return child.split(groupSelectorDelimiter).map((c: string) => {
            var ref = false
            var merged = c.replace('&', () => {
                ref = true
                return p
            })
            return ref ? merged : p + ' ' + c
        }).join(',')
    }).join(',')
}


const mergeSelectors = (...selectors: string[]) => selectors.reduce(mergeSelector)

export {
    mergeSelector,
    mergeSelectors
}