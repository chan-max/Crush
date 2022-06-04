import {
    Nodes
} from '../../type/nodeType'

import {
    mount
} from './mount'

import {
    update
} from './update'

export const patch = (p: any, n: any, container: any) => {
    var pType = p.nodeType
    var nType = n.nodeType
    if (pType === nType) {
        /* update */
        update(p, n)
    } else {
        /* unmount and mount */
        mount(n, container)
    }
}