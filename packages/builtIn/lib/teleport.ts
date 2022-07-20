import { isString } from "@crush/common"
import { effect, patch, processVnodePrerender } from "@crush/core"

const body = document.body

const defaultTeleportOptions = {
    to: body,
    anchor: null,
    disabled: false
}



function normalizeElement(selectorOrElement: any) {
    if (isString(selectorOrElement)) {
        try {
            selectorOrElement = document.querySelector(selectorOrElement)
        } catch (e) {
            return null
        }
    }
    if (!(selectorOrElement instanceof Element)) {
        return null
    }
    return selectorOrElement
}

export function Teleport(props: any, { default: _default }: any, nVnode: any, pVnode: any) {
    console.log('teleport update');

    props ||= defaultTeleportOptions
    let { to: container, anchor, disabled } = props
    container = normalizeElement(container) || body
    anchor = normalizeElement(anchor)

    let renderingVnode = processVnodePrerender(_default())

    if (pVnode) {
        // 节点更新 , 参数可能会变
        let { to: pContainer, anchor: pAnchor, disabled: pDisabled } = pVnode.props || defaultTeleportOptions
        pContainer = normalizeElement(pContainer) || body
        pAnchor = normalizeElement(pAnchor)
        let instance = pVnode.instance
        let teleportedVnode = pVnode.teleportedVnode
        if (disabled && !pDisabled) {
            // 卸载
            patch(teleportedVnode, null, pContainer, pAnchor, instance) // 卸载之前的
            nVnode.teleportedVnode = null // 清空已传送节点
            nVnode.teleportedVnodeContainer = null
            nVnode.teleportedVnodeAnchor = null
        } else if (!disabled && pDisabled) {
            // 挂载
            patch(null, renderingVnode, container, anchor, instance) // 挂载新的
            nVnode.teleportedVnode = renderingVnode
            nVnode.teleportedVnodeContainer = container
            nVnode.teleportedVnodeAnchor = anchor
        } else {
            // 更新
            if (container !== pContainer || anchor !== pAnchor) {
                patch(teleportedVnode, null, pContainer, pAnchor, instance) // 卸载之前的
                patch(null, renderingVnode, container, anchor, instance) // 挂载新的
                nVnode.teleportedVnode = renderingVnode
                nVnode.teleportedVnodeContainer = container
                nVnode.teleportedVnodeAnchor = anchor
            } else {

                patch(teleportedVnode, renderingVnode, container, anchor, instance)
                nVnode.teleportedVnode = renderingVnode
                nVnode.teleportedVnodeContainer = container
                nVnode.teleportedVnodeAnchor = anchor
            }
        }

    } else {
        // 第一次挂载
        if (disabled) {
            // 不传送 , 啥也不干
        } else {
            patch(null, renderingVnode, container, anchor, nVnode.instance) // 传送
            nVnode.teleportedVnode = renderingVnode
        }
    }

    // disabled生效 ，直接渲染空节点
    return disabled ? renderingVnode : null
}