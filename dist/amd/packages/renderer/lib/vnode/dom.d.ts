import { Nodes } from "@crush/const";
export declare type Vnode = {
    nodeType: Nodes;
    type: any;
    props: any;
    children: any;
    key: any;
};
declare function createNode(nodeType: Nodes): any;
declare function createComponent(type: any, props: any, children: any, key?: any): {
    nodeType: any;
    type: any;
    props: any;
    children: any;
    key: any;
};
declare function createElement(tagName: string, props: any, children: any, key?: any): any;
export declare function createSVGElement(tagName: string, props: any, children: any, key?: any): any;
export declare const Text: unique symbol;
declare function createText(text: any, key?: number): any;
export declare const Comment: unique symbol;
export declare function createComment(text: any, key?: number): {
    type: symbol;
    nodeType: Nodes;
    children: any;
    key: number;
};
declare function createFragment(children: any, key?: number): any;
export { createComponent, createElement, createText, createFragment, createNode };
