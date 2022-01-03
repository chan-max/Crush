/*
    
*/
const groupSelectorDelimiter = /\s*,\s*/;
const splitSelector = (selector) => selector.split(groupSelectorDelimiter);
const joinSelector = (selectors) => selectors.join(',');
function mergeSelector(parentSelector, childSelector) {
    var parentSelectors = splitSelector(parentSelector);
    var childSelectors = splitSelector(childSelector);
    var processedParentSelectors = parentSelectors.map((parentSelectorItem) => {
        var processedChildSelectors = childSelectors.map((childSelectorItem) => {
            var referencingParentSelector = false;
            var res = childSelectorItem.replace('&', () => {
                referencingParentSelector = true;
                return parentSelectorItem;
            });
            return referencingParentSelector ? res : parentSelectorItem + ' ' + childSelectorItem;
        });
        return joinSelector(processedChildSelectors);
    });
    return joinSelector(processedParentSelectors);
}
function mergeMultipleSelector(...selectors) {
    if (selectors.length > 2) {
        var parentSelector = selectors[0];
        selectors.shift();
        return mergeSelector(parentSelector, mergeMultipleSelector(...selectors));
    }
    else {
        return mergeSelector(selectors[0], selectors[1]);
    }
}
var s0 = `body,html`;
var s1 = 'a:hover';
console.log(mergeMultipleSelector(s0, s1));

export { mergeMultipleSelector, mergeSelector };
