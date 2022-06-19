import { getCurrentInstance } from "../render/mountComponent";

export function renderSlot(name: string, scope: any, fallback: any, key: any) {
    const instance = getCurrentInstance()
    let slot = instance?.slots?.[name] || fallback
    if (!slot) {
        return null
    } else {
        slot = slot(scope)
    }
    // 这里返回的一定是单一节点（fragment），不会是数组形式
    slot.key = key // 唯一插槽节点的key
    return slot
}