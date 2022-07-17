import { isString } from "@crush/common"
import { processVnodePrerender } from "@crush/core"


const defaultTeleportOptions = {
    to: document.body,
    anchor: null,
    disabled: false
}

function normalizeElement(selectorOrElement: any) {
    return isString(selectorOrElement) ? document.querySelector(selectorOrElement) : selectorOrElement
}

export function Teleport(props: any, { default: _default }: any) {
    props ||= defaultTeleportOptions
    let { to, anchor, disabled } = props
    to = isString
    let vnode = _default()
    let flattedVnode = processVnodePrerender(vnode)



    if (disabled) {
        // 传送失效
        // 将已经传送的节点卸载 ， 如何拿到已经传送的节点？

        return flattedVnode
    } else {
        // 默认什么都不渲染
        // 
        return null
    }
}