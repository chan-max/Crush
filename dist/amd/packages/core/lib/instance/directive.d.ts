export declare type DirectiveType = {
    beforeCreate?: Function;
    created?: Function;
    beforeMount?: Function;
    mounted?: Function;
    beforeUpdate?: Function;
    updated?: Function;
    beforeUnmount?: Function;
    unmounted?: Function;
    childrenMounted?: Function;
} | Function;
import { LifecycleHooks } from './lifecycle';
export declare function injectDirectives(target: any, directives: any[]): any;
export declare function processHook(type: LifecycleHooks, next: any, previous?: any): void;
