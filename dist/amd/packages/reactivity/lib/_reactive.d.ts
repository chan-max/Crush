declare var activeEffect: any;
declare var shouldTrack: boolean;
declare var effectStack: any[];
declare var targetMap: WeakMap<object, any>;
declare const SYMBOL_WITH: symbol;
declare class ReactiveEffect {
    fn: any;
    deps: never[];
    scheduler: null;
    constructor(fn: any, options: any);
    cleanDeps(): void;
    run(): any;
}
declare function effect(fn: any, options?: any): ReactiveEffect;
declare function track(target: any, key: any): void;
declare function trigger(target: any, key: any): void;
declare var handler: {
    get(target: any, key: any): any;
    set(target: any, key: any, newValue: any): boolean;
};
declare function reactive(target: any): any;
declare function computed(getter: any): {
    readonly value: any;
};
declare function watch(visitor: Function, callback: Function): void;
