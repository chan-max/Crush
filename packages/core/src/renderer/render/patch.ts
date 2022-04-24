import { isArray } from '@crush/common'
import { Nodes } from '@crush/types'
import { empty } from '../vnode/vnode'
import {
    mount
} from './mount'
import {
    unmount, unmountChildren
} from './unmount'
import {
    update, updateChildren
} from './update'
import {
    mountChildren
} from './mount'



export const patch = (current: any, next: any, container: any, anchor: any = null) => {

    /*
        both the current and next have there situations
        null | false , as empty node
        single node
        array node
    */

    if (!current) {
        if (next) {
            // 不管几个元素，直接按数组挂载
            isArray(next) ? mountChildren(next, container, anchor) : mount(next, container, anchor)
        } else {
            // nothing todo
        }
    }


    /*
    ! 两组树均存在节点
     两种都有的情况，并且两组节点都可能存在单个节点或数组节点 
     所以当两组节点都只有一个元素时，即使类型相同，也会进入到diff环节
    */

    if (current) {
        if (!next) {
            // 卸载当前节点
            isArray(next) ? unmountChildren(current) : unmount(current, container, anchor)
        } else {
            if (isArray(current)) {
                updateChildren(current, isArray(next) ? next : [next], container, anchor)
            } else {
                if (isArray(next)) {
                    updateChildren([current], next, container, anchor)
                } else {
                    if (current.type === next.type) {
                        // 类型相同，直接更新
                        update(current, next, container, anchor)
                    } else {
                        // 类型不同。先卸载，在挂载
                        unmount(current, container, anchor)
                        mount(next, container, anchor)
                    }
                }
            }
        }
    }
}
