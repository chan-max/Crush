export declare type StyleValue = {
    value: string;
    important: boolean;
};
export declare function parseStyleValue(rawValue: any): any;
export declare function updateDeclaration(style: CSSStyleDeclaration, pDeclaration: any, nDeclaration: any): void;
export declare function mountDeclaration(style: CSSStyleDeclaration, declaration: any): void;
export declare const setElementStyleDeclaration: (el: HTMLElement, declaration: Record<string, any>) => void;
export declare function unmountDeclaration(style: CSSStyleDeclaration, declaration: any): void;
export declare function getStyleValue(style: CSSStyleDeclaration, key: string): any;
export declare function getElementStyleValue(el: HTMLElement, key: string): any;
export declare function getElementComputedStyleValue(el: HTMLElement, key: string): any;
export declare function getStyle(style: CSSStyleDeclaration, keys: Record<string, any> | string[] | string): Record<string, any>;
export declare function getElementStyle(el: HTMLElement, keys: Record<string, any> | string[] | string): Record<string, any>;
export declare function getElementComputedStyle(el: HTMLElement, keys: Record<string, any> | string[] | string): Record<string, any>;
