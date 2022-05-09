import { keys } from "@crush/common"
import { EMPTY_MAP } from "@crush/common/src/value"
import { update } from "./update"


export function updateClass(pClass: any, nClass: any, el: HTMLElement) {

    for (let key in nClass) {

    }
}

export function mountClass(_class: any, el: HTMLElement) {
    updateClass(EMPTY_MAP, _class, el)
}

export function unmountClass(el: HTMLElement) {
    el.className = ''
}