import { ComponentType } from "./component";
export declare type MixinType = {
    beforeCreate?: Function;
    create?: Function;
    created?: Function;
    beforeMount?: Function;
    mounted?: Function;
    beforeUpdate?: Function;
    updated?: Function;
    beforeUnmount?: Function;
    unmounted?: Function;
    mixins?: MixinType[];
};
export declare function injectMixin(options: ComponentType, mixin: MixinType): ComponentType;
export declare function injectMixins(target: any, mixins?: MixinType[]): any;
