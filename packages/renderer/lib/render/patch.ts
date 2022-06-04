import {
    isArray
} from '@crush/common'

import {
    mount, mountChildren
} from './mount'
import {
    unmount, unmountChildren
} from './unmount'
import { update, updateChildren } from './update'

export const patch = (current: any, next: any, container: any, anchor: any = null) => {
    if (!current) {
        if (next) {
            isArray(next) ? mountChildren(next, container, anchor) : mount(next, container, anchor)
        } else {
            // nothing todo
        }
    } else {
        if (!next) {
            // 卸载当前节点
            isArray(current) ? unmountChildren(current) : unmount(current, container, anchor)
        } else {
            if (isArray(current)) {
                updateChildren(current, isArray(next) ? next : [next], container, anchor)
            } else {
                if (isArray(next)) {
                    updateChildren([current], next, container, anchor)
                } else {
                    // 两个单节点 ， 但key可能不同 
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