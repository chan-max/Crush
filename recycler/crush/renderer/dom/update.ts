import {
    Nodes
} from '../../type/nodeType'

import { updateElement } from './updateElement'

export function update(p, n) {
    const nodeType = n.nodeType
    switch (nodeType) {
        case Nodes.HTMLELEMENT:
            updateElement(p,n)
            break
    }
}