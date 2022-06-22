
// appear ，当前袁旭

import { addClass, onceListener, removeClass, removeElement } from "../dom"

/*
    duration : 可传时间毫秒 ，slow , fast , normal 等修饰符 , 进入时间和离开时间
*/

export function transitionEnter(vnode: any) {
    const { transition, el, patchKey } = vnode
    // 此时的el 是新创建的el，与正在卸载的不是一个元素，所以要想办法拿到之前的元素（正在执行离开动画的元素，并让他直接卸载即可）
    let ile = isLeavingElementMap[patchKey]
    if (ile) {
        transition.cancelLeave(ile)
        removeElement(ile)
        isLeavingElementMap[patchKey] = null
    }
    el.entering = true
    transition.enter(el)
    onceListener(el, 'transitionend', () => {
        transition.finishEnter(el)
        el.entering = false
    })
}


export const isLeavingElementMap: any = {}

export function transitionLeave(vnode: any) {
    const { transition, el, patchKey } = vnode
    if (el.entering) {
        transition.cancelEnter(el)
    }
    transition.leave(el)
    isLeavingElementMap[patchKey] = el
    onceListener(el, 'transitionend', () => {
        transition.finishLeave(el)
        isLeavingElementMap[patchKey] = null
        removeElement(el)
    })
}

