import { ComponentType } from "./component";
export declare enum ComponentOptions {
    BEFORE_CREATE = "beforeCreate",
    CREATE = "create",
    CREATED = "created",
    BEFORE_MOUNT = "beforeMount",
    MOUNTED = "mounted",
    BEFORE_UPDATE = "beforeUpdate",
    UPDATED = "updated",
    BEFORE_UNMOUNT = "beforeUnmount",
    UNMOUNTED = "unmounted",
    BEFORE_PATCH = "beforePatch",
    TEMPLATE = "template",
    RENDER = "render",
    PROPS = "props",
    EMITS = "emits",
    MIXINS = "mixins",
    COMPOENNTS = "components",
    DIRECTIVES = "directives"
}
export declare function resolveOptions(options: ComponentType | any): void;
