import {
    isArray
} from '@crush/common'
import { Nodes } from '@crush/const'

import {
    mount, mountChildren
} from './mount'
import {
    unmount, unmountChildren
} from './unmount'
import { update, updateChildren } from './update'


export const patch = (prev: any, next: any, container: any, anchor: any, parent: any) => {
    if (!prev) {
        if (next) {
            isArray(next) ? mountChildren(next, container, anchor, parent) : mount(next, container, anchor, parent)
        } else {
            return
        }
    } else {
        if (!next) {
            // 卸载当前节点
            isArray(prev) ? unmountChildren(prev) : unmount(prev, container, anchor, parent)
        } else {
            if (isArray(prev)) {
                updateChildren(prev, isArray(next) ? next : [next], container, anchor, parent)
            } else {
                if (isArray(next)) {
                    updateChildren([prev], next, container, anchor, parent)
                } else {
                    let { type: prevType, _key: prev_key } = prev
                    let { type: nextType, _key: next_key, nodeType } = next
                    // 文本节点和注释节点直接更新即可
                    if (prevType === nextType && (prev_key === next_key || nodeType === Nodes.TEXT || nodeType === Nodes.HTML_COMMENT)) {
                        // type相同，nodeType一定相同
                        update(prev, next, container, anchor, parent)
                    } else {
                        unmount(prev, container, anchor, parent)
                        mount(next, container, anchor, parent)
                    }
                }
            }
        }
    }
}