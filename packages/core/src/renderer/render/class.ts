import { keys, removeFromArray } from "@crush/common"
import { EMPTY_OBJ } from "@crush/common/src/value"


export function updateClass(pClass: any, nClass: any, el: HTMLElement) {
    pClass ||= EMPTY_OBJ
    nClass ||= EMPTY_OBJ
    var classList = el.classList
    var removeKeys: any = keys(pClass)
    for (let className in nClass) {
        var pC = pClass[className]
        var nC = nClass[className]
        if (pC && !nC) {
            // remove
            classList.remove(className)
        } else if (!pC && nC) {
            // add
            classList.add(className)
        }
        removeFromArray(removeKeys, className)
    }
    removeKeys.forEach((className: string) => {
        classList.remove(className)
    })
}

export function mountClass(_class: any, el: HTMLElement) {
    updateClass(EMPTY_OBJ, _class, el)
}

export function unmountClass(el: HTMLElement) {
    el.className = ''
}