import { empty } from '../vnode/vnode'
import {
    mount
} from './mount'
import {
    unmount
} from './unmount'
import {
    update
} from './update'

export const patch = (current: any, next: any, container: any) => {
    var t1 = current || empty
    var t2 = next || empty
    /*
        type is not different from nodeType , 
        if these two nodes have the same type , they must have the same nodeType
    */
    if (t1.type === t2.type) {
        update(t1, t2, container)
    } else {
        unmount(t1, container)
        mount(t2, container)
    }

}