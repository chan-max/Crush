import { Nodes } from '@crush/types'
import { empty } from '../vnode/vnode'
import {
    mount
} from './mount'
import {
    unmount
} from './unmount'
import {
    update, updateChildren
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
        /*
            可能存在fragment多种复杂情况，直接diff处理
        */
        updateChildren([t1], [t2], container)
    }
}