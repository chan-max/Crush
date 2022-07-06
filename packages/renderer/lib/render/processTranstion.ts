import { emptyObject } from "@crush/common"
import { addClass, onceListener, removeClass, removeElement } from "../dom"

//! class
export function bindEnterClass(el: Element, name: string) {
    addClass(el, `${name}-enter`)
    addClass(el, `${name}-enter-from`)
    requestAnimationFrame(() => {
        addClass(el, `${name}-enter-to`)
        removeClass(el, `${name}-enter-from`)
    })
}

export function removeEnterClass(el: Element, name: string) {
    removeClass(el, `${name}-enter-to`)
    removeClass(el, `${name}-enter`)
}

export function bindLeaveClass(el: Element, name: string) {
    addClass(el, `${name}-leave-from`)
    document.body.offsetHeight
    addClass(el, `${name}-leave`)
    requestAnimationFrame(() => {
        addClass(el, `${name}-leave-to`)
        removeClass(el, `${name}-leave-from`)
    })
}

export function removeLeaveClass(el: Element, name: string) {
    removeClass(el, `${name}-leave-to`)
    removeClass(el, `${name}-leave`)
}

let leavingElements: any = {}
let enteringElements: any = {}

export const createTransition = (options: any) => new TransitionDesc(options)

// 整个transtion描述不参与节点的真实挂载卸载，显示或隐藏
class TransitionDesc {

    type: any // css / animation

    name: any

    duration: any // css一般不需要

    appear: any

    // hooks
    onBeforeEnter: any
    onEnter: any
    onAfterEnter: any
    onEnterCancelled: any
    onBeforeLeave: any
    onLeave: any
    onAfterLeave: any
    onLeaveCancelled: any

    constructor(options: any) {
        this.update(options)
    }

    update(options: any) {
        options ||= emptyObject
        const {
            type,
            name,
            duration,
            // hooks
            onBeforeEnter,
            onEnter,
            onAfterEnter,
            onEnterCancelled,
            onBeforeLeave,
            onLeave,
            onAfterLeave,
            onLeaveCancelled
        } = options
        this.name = name || 'transition'
        this.type = type || 'css'
        this.appear = this.appear || false
        this.duration = duration
        this.onBeforeEnter = onBeforeEnter
        this.onEnter = onEnter
        this.onAfterEnter = onAfterEnter
        this.onEnterCancelled = onEnterCancelled
        this.onBeforeLeave = onBeforeLeave
        this.onLeave = onLeave
        this.onAfterLeave = onAfterLeave
        this.onLeaveCancelled = onLeaveCancelled
    }

    bindeEnterClass = (el: any) => bindEnterClass(el, this.name)
    bindeLeaveClass = (el: any) => bindLeaveClass(el, this.name)
    removeEnterClass = (el: any) => removeEnterClass(el, this.name)
    removeLeaveClass = (el: any) => removeLeaveClass(el, this.name)

    beforeEnter() { }
    beforeLeave() { }

    cancelEnter() {
        
    }

    canceleave(el: any) {
    }

    public enter(el: any, enterOp: any) {

        // ! 新建节点插入时，leaving的元素和
        let { patchKey } = el._vnode

        enteringElements[patchKey] = el

        enterOp()
        bindEnterClass(el, this.name)

        onceListener(el, 'transitionend', () => {
            removeEnterClass(el, this.name)
            enteringElements[patchKey] = null
            console.log('afterEnter');
        })
    }

    public leave(el: any, leaveOp: any) {
        let { patchKey } = el._vnode
        leavingElements[patchKey] = el

        bindLeaveClass(el, this.name)
        onceListener(el, 'transitionend', () => {
            console.log('leave');
            removeLeaveClass(el, this.name)
            leaveOp()
            leavingElements[patchKey] = null
        })
    }


    processMount(newEl: any, insertFn: any) {
        insertFn()
    }

    processUnmount(el: any) {
        removeElement(el)
    }
    // show
    processShow(el: any, show: boolean) {
        if (show) {
            // enter
            if (el._leaving) {
                this.canceleave(el)
            }
            this.bindeEnterClass(el)


        } else {
            // leave

        }
    }

}


