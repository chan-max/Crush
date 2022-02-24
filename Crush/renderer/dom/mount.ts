import {
    Nodes
} from '../../type/nodeType'
import {
    mountElement
} from './mountElement'
import {
    mountText
} from './mountText'
import {
    mountFragment
} from './mountFragment'
import {
    mountStyleSheet
} from './mountStyleSheet'

export const mount = (node: any, container: any) => {
    var type = node.nodeType
    switch (type) {
        case Nodes.HTMLELEMENT:
            mountElement(node, container)
            break
        case Nodes.TEXT:
            mountText(node, container)
            break
        case Nodes.FRAGMENT:
            mountFragment(node, container)
            break
        case Nodes.STYLE:
            mountStyleSheet(node, container)
            break
    }
}