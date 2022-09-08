

// 在子组件节点身上增加keepAlive标记
export const keepAliveComponent = (props: any, slots: any, vnode: any) => {
    vnode._keepAlive = props
    let slotContent = slots.default()
    return slotContent
}
