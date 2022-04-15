import {
    mount
} from './mount'
import {
    unmount
} from './unmount'

export const patch = (current: any, next: any, container: any) => {
    if (!current) {
        mount(next, container)
    } else if (!next) {
        //unmount(current, container)
    } else {
        if (current.type === next.type) {
            // update
        } else {
            //unmount(current, container)
            mount(next, container)
        }
    }
}