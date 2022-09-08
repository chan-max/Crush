

// 在子组件节点身上增加keepAlive标记
export const keepAliveComponent = (props: any, slots: any, vnode: any) => {
    let slotContent = slots.default()
    slotContent[0]._keepAlive = props
    return slotContent
}
