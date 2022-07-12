export declare const builtInComponents: any;
export declare const builtInDirectives: {
    modelText: {
        beforeUpdate(el: any, { value }: any): void;
        created(el: any, { value }: any, vnode: any): void;
    };
    modelTextarea: {
        beforeUpdate(el: any, { value }: any): void;
        created(el: any, { value }: any, vnode: any): void;
    };
    modelCheckbox: {
        created(el: any, { value: checked }: any): void;
        beforeUpdate(el: any, { value }: any): void;
    };
    modelRadio: {
        created(el: any, { value }: any, { props: { _setter } }: any): void;
        beforeUpdate(el: any, { value }: any): void;
    };
    modelRange: {
        created(el: HTMLInputElement, { value }: any, { props: { _setter } }: any): void;
        beforeUpdate(el: HTMLInputElement, { value }: any): void;
    };
    modelColor: {
        created(el: any, { value }: any, vnode: any): void;
        beforeUpdate(el: any, { value }: any): void;
    };
    modelSelectOne: {
        childrenMounted(el: any, { value }: any, { props: { _setter } }: any): void;
        beforeUpdate(el: any, { value }: any): void;
    };
    modelSelectMultiple: {
        childrenMounted(el: any, { value }: any, { props: { _setter } }: any): void;
        beforeUpdate(el: any, { value }: any): void;
    };
    show: {
        beforeMount(el: any, { value }: any, { transition }: any): void;
        updated(el: Element, { value, oldValue }: any, { transition }: any): void;
    };
    transition: {
        beforeCreate(_: any, { value }: any, vnode: any): void;
        beforeUpdate(_: any, { value }: any, nVnode: any, pVnode: any): void;
    };
    transitionGroup: {
        beforeUpdate(): void;
    };
};
