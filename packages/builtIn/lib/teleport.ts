import { isString } from "@crush/common"
import { patch, processVnodePrerender } from "@crush/core"


const defaultTeleportOptions = {
    to: document.body,
    anchor: null,
    disabled: false
}

const body = document.body

function normalizeElement(selectorOrElement: any) {
    if (isString(selectorOrElement)) {
        try {
            selectorOrElement = document.querySelector(selectorOrElement)
        } catch (e) {
            selectorOrElement = body
        }
    }
    if (!(selectorOrElement instanceof Element)) {
        selectorOrElement = body
    }
    return selectorOrElement
}

export function Teleport(props: any, { default: _default }: any, nVnode: any, pVnode: any) {
    props ||= defaultTeleportOptions
    let { to: container, anchor, disabled } = props
    container = normalizeElement(container)
    anchor = normalizeElement(anchor)
    let renderingVnode = processVnodePrerender(_default())

    debugger
    if (pVnode) {
        // 节点更新
        let { to: pContainer, anchor: pAnchor, disabled: pDisabled } = pVnode.props || defaultTeleportOptions
        let teleportedVnode = pVnode.teleportedVnode // 已经传送的节点
        pContainer = normalizeElement(pContainer)
        pAnchor = normalizeElement(pAnchor)
        let instance = pVnode.instance // = nVnode.instance
        if (disabled && !pDisabled) {
            // 卸载
            patch(teleportedVnode, null, pContainer, pAnchor, instance) // 卸载之前的
            nVnode.teleportedVnode = null
        } else if (!disabled && pDisabled) {
            // 挂载
            patch(null, renderingVnode, container, anchor, instance) // 挂载新的
            nVnode.teleportedVnode = renderingVnode
        } else {
            // 更新
            if (container !== pContainer || anchor !== pAnchor) {
                patch(teleportedVnode, null, pContainer, pAnchor, instance) // 卸载之前的
                patch(null, renderingVnode, container, anchor, instance) // 挂载新的
                nVnode.teleportedVnode = renderingVnode
            } else {
                patch(teleportedVnode, renderingVnode, container, anchor, instance)
                nVnode.teleportedVnode = renderingVnode
            }
        }

    } else if (nVnode.isMounted) {
        // 自更新 , 参数一定不变 ？？？, 插槽内容变会进入此更新
        debugger
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