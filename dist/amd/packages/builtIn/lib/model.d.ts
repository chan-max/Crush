export declare const modelText: {
    beforeUpdate(el: any, { value }: any): void;
    created(el: any, { value }: any, vnode: any): void;
};
export declare const modelRadio: {
    created(el: any, { value }: any, { props: { _setter } }: any): void;
    beforeUpdate(el: any, { value }: any): void;
};
export declare const modelCheckbox: {
    created(el: any, { value: checked }: any): void;
    beforeUpdate(el: any, { value }: any): void;
};
export declare const modelSelectOne: {
    childrenMounted(el: any, { value }: any, { props: { _setter } }: any): void;
    beforeUpdate(el: any, { value }: any): void;
};
export declare const modelSelectMultiple: {
    childrenMounted(el: any, { value }: any, { props: { _setter } }: any): void;
    beforeUpdate(el: any, { value }: any): void;
};
export declare const modelColor: {
    created(el: any, { value }: any, vnode: any): void;
    beforeUpdate(el: any, { value }: any): void;
};
export declare const modelRange: {
    created(el: HTMLInputElement, { value }: any, { props: { _setter } }: any): void;
    beforeUpdate(el: HTMLInputElement, { value }: any): void;
};
