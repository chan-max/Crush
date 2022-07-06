export declare type SelectorType = {
    isDynamic: boolean;
    selectorText: string;
};
export declare function parseSelector(selector: string): SelectorType;
