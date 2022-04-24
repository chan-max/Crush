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

export const patch = (current: any, next: any, container: any, anchor: any = null) => {
    
    

    /*
        锚点用于挂载时确定挂载的位置，并且是将要挂载节点位置的
    */
    var t1 = current || empty
    var t2 = next || empty
    /*
        type is not different from nodeType , 
        if these two nodes have the same type , they must have the same nodeType
    */
    if ((t1.nodeType !== Nodes.FRAGMENT) && (t1.nodeType !== Nodes.FRAGMENT)) {
        if (t1.type === t2.type) {
            update(t1, t2, container, anchor)
        } else {
            unmount(t1, container, anchor)
            mount(t2, container, anchor)
        }
    } else {
        /*存在fragment时，会进入核心diff，并会在此时将fragment平铺  */ 
        updateChildren([t1], [t2], container, anchor)
    }
}

/*
    h1,h2,h3
       h2,h3
*/