import {
    ComponentOptions
} from './options'

export type Component = {
    [ComponentOptions.CREATE]?: Function
    [ComponentOptions.CREATED_HOOK]?: Function
    [ComponentOptions.BEFORE_MOUNT_HOOK]?: Function
    [ComponentOptions.BEFORE_UNMOUNT_HOOK]?: Function
    [ComponentOptions.BEFORE_UPDATE_HOOK]?: Function
    [ComponentOptions.UPDATED_HOOK]?: Function
    [ComponentOptions.BEFORE_UNMOUNT_HOOK]?: Function
    [ComponentOptions.UNMOUNTED_HOOK]?: Function
}