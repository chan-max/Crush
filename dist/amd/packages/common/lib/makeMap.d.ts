export declare const arrayToMap: (arr: string[], mapValue?: any) => Record<string, any>;
export declare const stringToMap: (str: string, delimiter: string | RegExp) => Record<string, any>;
export declare const makeMap: (str: string, delimiter?: string) => (key: string) => boolean;
