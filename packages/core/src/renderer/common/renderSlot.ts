import { EMPTY_OBJ } from "@crush/common/src/value";
import { getCurrentInstance } from "../render/mountComponent";
import { processdom } from "./processdom";


export function renderSlot(name: string, scope: any, fallback: any, uid: any) {
    var instance = getCurrentInstance()
    return  instance.slots[name]() || fallback
}