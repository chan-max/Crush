declare const splitSelector: (selector: string) => string[];
declare const joinSelector: (splitedSelector: string[]) => string;
declare function mergeSplitedSelector(parent: string[], children: string[]): string[];
declare const mergeSplitedSelectorsAndJoin: (...selectors: string[][]) => string;
declare function mergeSelectors(...selectors: string[]): string;
export { splitSelector, mergeSplitedSelector, mergeSelectors, joinSelector, mergeSplitedSelectorsAndJoin };
