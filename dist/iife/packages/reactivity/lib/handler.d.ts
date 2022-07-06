export declare const getLastVisitTarget: () => any;
export declare const getLastVisitKey: () => any;
export declare const getLastSetTarget: () => any;
export declare const getLastSetKey: () => any;
export declare const getLastSetOldValue: () => any;
export declare const getLastSetNewValue: () => any;
export declare const onSetCallbacks: Set<unknown>;
export declare function onSet(cb: any): () => boolean;
export declare function createSetter(isReadonly?: boolean, isShallow?: boolean): (target: any, key: any, newValue: any, receiver: any) => boolean;
export declare const reactiveHandler: any;
export declare const shallowReactiveHandler: any;
export declare const readonlyHandler: any;
export declare const shallowReadonlyHandler: any;
export declare const reactiveCollectionHandler: {
    get: (target: any, key: any, receiver: any) => any;
};
export declare const readonlyCollectionHandler: {
    get: (target: any, key: any, receiver: any) => any;
};
export declare const shallowReactiveCollectionHandler: {
    get: (target: any, key: any, receiver: any) => any;
};
export declare const shallowReadonlyCollectionHandler: {
    get: (target: any, key: any, receiver: any) => any;
};
