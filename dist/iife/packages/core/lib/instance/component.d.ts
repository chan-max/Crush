import { DirectiveType } from "./directive";
export declare type ComponentType = {
    rootCreate?: any;
    create?: Function | Function[];
    created?: Function | Function[];
    beforeMount?: Function | Function[];
    mounted?: Function | Function[];
    beforeUpdate?: Function | Function[];
    updated?: Function | Function[];
    beforeUnmount?: Function | Function[];
    unmounted?: Function | Function[];
    template?: string;
    render?: Function;
    createRender?: Function;
    mixins?: any;
    props?: any;
    propsOptions?: any;
    emits?: any;
    emitsOptions?: any;
    customOptions?: any;
    components?: Record<string, ComponentType>;
    directives?: Record<string, DirectiveType>;
    _isOptions?: boolean;
};