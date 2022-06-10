import { getCurrentInstance } from "../render/mountComponent";

export function renderSlot(name: string, scope: any, fallback: any, uid: any) {
    const instance = getCurrentInstance()
    let slot = instance.slots[name] || fallback
    if (!slot) {
        return null
    } else {
        slot = slot(scope)
    }
    slot.key = uid // 唯一插槽节点的key
    return slot
}