import { Nodes } from "@crush/types"

export function mount(vnode: any, container: any) {
    debugger
    const type = vnode.type
    switch (type) {
        case Nodes.HTML_ELEMENT:
            mountHTMLElement(vnode, container)
            break
    }
}

function mountHTMLElement(vnode: any, container: any) {
    const {
        type,
        props,
        children
    } = vnode
}