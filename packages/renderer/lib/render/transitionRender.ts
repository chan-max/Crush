
// appear ，当前袁旭

import { addClass, onceListener, removeClass, removeElement } from "../dom"

/*
    duration : 可传时间毫秒 ，slow , fast , normal 等修饰符 , 进入时间和离开时间
*/

export function transitionMount(el: Element, transition: any) {
    const name = transition.name || 'transition'
    const enterClass = `${name}-enter`
    const enterFromClass = `${name}-enter-from`
    const enterToClass = `${name}-enter-to`
    addClass(el, enterClass)
    addClass(el, enterFromClass)
    requestAnimationFrame(() => {
        addClass(el, enterToClass)
        removeClass(el, enterFromClass)
    })

    const doEnter = () => {
        removeClass(el, enterToClass)
        removeClass(el, enterClass)
    }
    onceListener(el, 'transitionend', doEnter)
    onceListener(el, 'animationend', doEnter)
}



export function transitionUnmount(el: Element, transition: any) {
    const name = transition.name || 'transition'
    const leaveClass = `${name}-leave`
    const leaveFromClass = `${name}-leave-from`
    const leaveToClass = `${name}-leave-to`
    addClass(el, leaveFromClass)
    addClass(el, leaveClass)
    document.body.offsetHeight
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            addClass(el, leaveToClass)
            removeClass(el, leaveFromClass)
        })
    })

    const doLeave = () => {
        removeClass(el, leaveToClass)
        removeClass(el, leaveClass)
        // 手动卸载
        removeElement(el)
    }

    onceListener(el, 'transitionend', doLeave)
    onceListener(el, 'animationend', doLeave)
}