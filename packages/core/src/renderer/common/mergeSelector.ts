
// rebuilding

const groupSelectorDelimiter = /\s*,\s*/
const splitSelector = (selector: string): string[] => selector.split(groupSelectorDelimiter)

function mergeSelector(p: string, c: string) {
    var ref = false  // is using & 
    var merged = c.replace('&', () => {
        ref = true
        return p
    })
    return ref ? merged : p + ' ' + c
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

//

const mergeSelectors = (...selectors: string[]) => mergeSplitedSelectors(...selectors.map(splitSelector)).join(',')


// function mergeSelector(parent: string, child: string) {
//     return parent.split(groupSelectorDelimiter).map((p: string) => {
//         return child.split(groupSelectorDelimiter).map((c: string) => {
//             var ref = false // is using & 
//             var merged = c.replace('&', () => {
//                 ref = true
//                 return p
//             })
//             return ref ? merged : p + ' ' + c
//         }).join(',')
//     }).join(',')
// }



export {
    mergeSelector,
    mergeSelectors
}