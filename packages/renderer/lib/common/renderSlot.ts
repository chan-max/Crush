import { getCurrentInstance } from "../render/mountComponent";

export function renderSlot(name: string, scope: any, fallback: any, uid: any) {
    var instance = getCurrentInstance()
    var slot = (instance.slots[name] || fallback)()
    if (!slot) {
        return null
    }
    slot.key = uid // 唯一插槽节点的key
    return slot
}