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

export const patch = (current: any, next: any, container: any, anchor: any, parent: any) => {
    if (!current) {
        if (next) {
            isArray(next) ? mountChildren(next, container, anchor, parent) : mount(next, container, anchor, parent)
        } else {
            return
        }
    } else {
        if (!next) {
            // 卸载当前节点
            isArray(current) ? unmountChildren(current) : unmount(current, container, anchor, parent)
        } else {
            if (isArray(current)) {
                updateChildren(current, isArray(next) ? next : [next], container, anchor, parent)
            } else {
                if (isArray(next)) {
                    updateChildren([current], next, container, anchor, parent)
                } else {
                    // 两个单节点 ， 但key可能不同 
                    if (current.type === next.type && current.patchKey === next.patchKey) {
                        // 类型相同，直接更新
                        update(current, next, container, anchor, parent)
                    } else {
                        // 类型不同。先卸载，在挂载
                        unmount(current, container, anchor, parent)
                        mount(next, container, anchor, parent)
                    }
                }
            }
        }
    }
}