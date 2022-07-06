declare const enum LifecycleHooks {
    BEFORE_CREATE = "beforeCreate",
    CREATE = "create",
    CREATED = "created",
    BEFORE_MOUNT = "beforeMount",
    MOUNTED = "mounted",
    BEFORE_UPDATE = "beforeUpdate",
    UPDATED = "updated",
    BEFORE_UNMOUNT = "beforeUnmount",
    UNMOUNTED = "unmounted"
}
declare function injectHook(type: LifecycleHooks, target: any, hook: Function | Function[]): void;
declare function injectMapHooks(target: any, mapHooks: any): any;
declare function callHook(type: LifecycleHooks, target: any, options?: any, ...args: any[]): undefined | any[];
declare const onCreated: (hook: any) => void;
declare const onBeforeMount: (hook: any) => void;
declare const onMounted: (hook: any) => void;
declare const onBeforeUpdate: (hook: any) => void;
declare const onUpdated: (hook: any) => void;
declare const onBeforeUnmount: (hook: any) => void;
declare const onUnmounted: (hook: any) => void;
export { LifecycleHooks, injectHook, callHook, onCreated, onBeforeMount, onBeforeUnmount, onBeforeUpdate, onMounted, onUnmounted, onUpdated, injectMapHooks };
