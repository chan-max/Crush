import { emptyObject } from "@crush/common"
import { addClass, onceListener, removeClass } from "../dom"

//! class
function bindEnterClass(el: Element, name: string) {
    addClass(el, `${name}-enter`)
    addClass(el, `${name}-enter-from`)
    requestAnimationFrame(() => {
        addClass(el, `${name}-enter-to`)
        removeClass(el, `${name}-enter-from`)
    })
}

function removeEnterClass(el: Element, name: string) {
    removeClass(el, `${name}-enter-to`)
    removeClass(el, `${name}-enter`)
}

function bindLeaveClass(el: Element, name: string) {
    addClass(el, `${name}-leave-from`)
    document.body.offsetHeight
    addClass(el, `${name}-leave`)
    requestAnimationFrame(() => {
        addClass(el, `${name}-leave-to`)
        removeClass(el, `${name}-leave-from`)
    })
}

function removeLeaveClass(el: Element, name: string) {
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

    cancelEnter() {

    }

    canceleave() {

    }

    public enter(el: any, enterOp: any) {
        let { patchKey } = el._vnode

        let ile = leavingElements[patchKey]

        if (ile) {
            // cancel leave
            console.log('cancel leave');
            el.leaveAction()
            el.unbindLeaveListener()
        }

        enteringElements[patchKey] = el

        // beforeEnter
        console.log('beforeEnter');

        enterOp()
        bindEnterClass(el, this.name)
        console.log('enter');
        let enterAction = () => {
            removeEnterClass(el, this.name)
            enteringElements[patchKey] = null
            console.log('afterEnter');
        }
        el.enterAction = enterAction
        el.unbindEnterListener = onceListener(el, 'transitionend', enterAction)
    }

    public leave(el: any, leaveOp: any) {
        let { patchKey } = el._vnode

        let iee = enteringElements[patchKey]

        if (iee) {
            console.log('cancel enter');
            el.enterAction()
            el.unbindEnterListener()
        }

        leavingElements[patchKey] = el

        bindLeaveClass(el, this.name)

        let leaveAction = () => {
            console.log('leave');
            removeLeaveClass(el, this.name)
            leaveOp()
            leavingElements[patchKey] = null
        }
        el.leaveAction = leaveAction
        el.unbindLeaveListener = onceListener(el, 'transitionend', leaveAction)
    }

}