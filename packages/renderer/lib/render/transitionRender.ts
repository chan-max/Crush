
// appear ，当前袁旭

import { addClass, onceListener, removeClass, removeElement } from "../dom"

/*
    duration : 可传时间毫秒 ，slow , fast , normal 等修饰符 , 进入时间和离开时间
*/

export const isLeavingElementMap: any = {}

export function transitionEnter(vnode: any, insertFn: any) {
    const { transition, el, patchKey } = vnode
    // 此时的el 是新创建的el，与正在卸载的不是一个元素，所以要想办法拿到之前的元素（正在执行离开动画的元素，并让他直接卸载即可）
    let ile = isLeavingElementMap[patchKey]
    // 移除之前离开动画没执行完的元素
    if (ile) {
        transition.cancelLeave(ile)
        removeElement(ile)
        isLeavingElementMap[patchKey] = null
    }
    el.entering = true
    insertFn()
    transition.doEnter(el)
    onceListener(el, 'transitionend', () => {
        transition.finishEnter(el)
        el.entering = false
    })
}


export function transitionLeave(vnode: any) {
    const { transition, el, patchKey } = vnode
    if (el.entering) {
        transition.cancelEnter(el)
    }
    transition.doLeave(el)
    isLeavingElementMap[patchKey] = el
    onceListener(el, 'transitionend', () => {
        transition.finishLeave(el)
        isLeavingElementMap[patchKey] = null
        removeElement(el)
    })
}

