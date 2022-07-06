export declare const builtInComponents: any;
export declare const builtInDirectives: {
    show: {
        beforeMount(el: any, { value }: any, { transition }: any): void;
        updated(el: Element, { value, oldValue }: any, { transition }: any): void;
    };
    modelText: {
        created(el: any, _: any, vnode: any): void;
    };
    transition: {
        beforeCreate(_: any, { value }: any, vnode: any): void;
        beforeUpdate(_: any, { value }: any, nVnode: any, pVnode: any): void;
    };
    transitionGroup: {
        props: {};
        render: ({ $slots }: any) => any;
        beforeUpdate({ $instance: { scope, vnode, renderingVnode }, $props }: any): void;
    };
};
