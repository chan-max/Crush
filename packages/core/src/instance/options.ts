import {
    Component
} from './component'

export enum ComponentOptions {
    CREATE = 'create',
    // setup funcition
    CREATED_HOOK = 'created',
    BEFORE_MOUNT_HOOK = 'beforeMount',
    MOUNTED_HOOK = 'mounted',
    BEFORE_UPDATE_HOOK = 'beforeUpdate',
    UPDATED_HOOK = 'updated',
    BEFORE_UNMOUNT_HOOK = 'beforeUnmount',
    UNMOUNTED_HOOK = 'unmounted'
}

export const initOptions = (options: Component) => {
        
}