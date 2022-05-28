import { EMPTY_OBJ } from "@crush/common/src/value";
import { getCurrentInstance } from "../render/mountComponent";
import { processdom } from "./processdom";


export function renderSlot(name: string, scope: any, fallback: any, uid: any) {
    var instance = getCurrentInstance()
    var slot = (instance.slots[name] || fallback)()
    slot.key = uid // 唯一插槽节点的key
    return slot
}