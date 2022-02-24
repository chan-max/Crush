import {
    mountChildren
} from './mountChildren'

export const mountFragment = (node: any, container: any) => {
    const children = node.children
    mountChildren(children, container)
}