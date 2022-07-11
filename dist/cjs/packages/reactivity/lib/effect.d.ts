import { ReactiveFlags } from "./common";
export declare const TARGET_MAP: WeakMap<object, any>;
export declare function getDepsMap(target: any): any;
export declare function getDeps(target: any, key: any): any;
export declare function track(target: any, key?: any): void;
export declare const trackTargetSymbol: unique symbol;
export declare function trigger(target: any, key: any): void;
export declare const getActiveEffect: () => ReactiveEffect;
export declare const setActiveEffect: (effect: ReactiveEffect) => number;
export declare const deleteActiveEffect: () => ReactiveEffect | undefined;
export declare function isEffect(value: any): any;
export declare class ReactiveEffect {
    [ReactiveFlags.IS_EFFECT]: boolean;
    deps: any;
    effectFn: any;
    scheduler: any;
    active: boolean;
    constructor(fn: any, scheduler: any);
    run(): any;
    triggerRun(): any;
    cleanDeps(): void;
}
export declare function createReactiveEffect(fn: any, scheduler?: any): ReactiveEffect;
export declare const effect: (fn: any, options?: any) => ReactiveEffect;
