import { Nodes } from "@crush/const";
declare var createStyleSheet: (props: any, children: any, key?: any) => any;
declare var createStyle: (selector: string, children: any, key: any) => {
    nodeType: Nodes;
    selector: string;
    children: any;
    key: any;
};
declare var createMedia: (media: string, children: any, key: any) => {
    nodeType: Nodes;
    media: string;
    children: any;
    key: any;
};
declare var createKeyframes: (keyframes: any, children: any, key?: any) => any;
declare var createKeyframe: (keyframe: any, children: any, key?: any) => any;
declare var createSupports: (supports: string, children: any, key: any) => {
    nodeType: Nodes;
    supports: string;
    children: any;
    key: any;
};
declare var createDeclaration: (children: any, key: any) => {
    nodeType: Nodes;
    children: any;
    key: any;
};
export { createStyleSheet, createStyle, createDeclaration, createKeyframe, createKeyframes, createMedia, createSupports, };
