import { getCurrentInstance } from "../render/mountComponent";


export function renderSlot(slotName: string, fallback: any) {
    var instance = getCurrentInstance()
    var slots = instance.slots
    debugger
}