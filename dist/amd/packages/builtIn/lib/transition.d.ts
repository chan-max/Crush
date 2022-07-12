export declare const transitionComponent: {
    props: {};
    render: ({ $slots }: any) => any;
    beforeMount({ $instance: { scope, renderingVnode }, $props }: any): void;
    beforeUpdate({ $instance: { renderingVnode }, $props }: any): void;
};
export declare function arrayDifference(arr1: any[], arr2: any[]): any[];
export declare const transitionGroupComponent: {
    props: string[];
    render: ({ $slots }: any) => any;
    beforeUpdate({ $instance: { vnode, renderingVnode }, $props }: any): void;
};
export declare const transitionDirective: {
    beforeCreate(_: any, { value }: any, vnode: any): void;
    beforeUpdate(_: any, { value }: any, nVnode: any, pVnode: any): void;
};
export declare const transitionGroupDirective: {
    beforeUpdate(): void;
};
