import { addClass, onceListener, removeClass, removeElement } from "../dom"
import { mountClass } from "./attribute"

const toTransitionClass = (name: string = 'transition') => ({
    enterFromClass: `${name}-enter-from`,
    enterClass: `${name}-enter`,
    enterToClass: `${name}-enter-to`,
    leaveFromClass: `${name}-leave-from`,
    leaveClass: `${name}-leave`,
    leaveToClass: `${name}-leave-to`,
})


export function enterCssTransition(el: Element,) {
    const { enterFromClass, enterClass, enterToClass, leaveFromClass, leaveClass, leaveToClass }: any = toTransitionClass()
    addClass(el, enterClass)
    addClass(el, enterFromClass)
    requestAnimationFrame(() => {
        addClass(el, enterToClass)
        removeClass(el, enterFromClass)
    })
    onceListener(el, 'transitionend', () => {
        removeClass(el, enterToClass)
        removeClass(el, enterClass)
    })
}

export function leaveCssTransition(el: any) {
    addClass(el, 'transition-leave-from')
    document.body.offsetHeight
    addClass(el, 'transition-leave')
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            addClass(el, 'transition-leave-to')
            removeClass(el, 'transition-leave-from')
        })
    })
    onceListener(el, 'transitionend', () => {
        removeClass(el, 'transition-leave-to')
        removeClass(el, 'transition-leave')
        removeElement(el)
    })
}

export function enterKeyframesTransition() {

}

export function leaveKeyframesTransition() {

}

function isAnimating() {

}


const transition = {

}

function cssTranstionBeforeEnter() {

}


