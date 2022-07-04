import { emptyObject } from "@crush/common"
import { addClass, onceListener, removeClass, removeElement } from "../dom"


/*
    duration 
    timingFunction
    delay
*/


//! 多个元素可能共享同一个过渡描述实例，所以调用相关方法需要手动传入对应得元素

let isLeavingElements: any = {}

export class TransitionDescription {


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

    constructor(transitionOptions: any) {
        this.update(transitionOptions)
    }

    update(transitionOptions: any) {
        transitionOptions ||= emptyObject
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
        } = transitionOptions
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


    beforeEnter(el: any) {

    }

    // doEnter 执行前，节点应该已经插入页面，或者是元素已经设为show
    doEnter(el: any) {

        let { patchKey } = el._vnode
        let ile = isLeavingElements[patchKey]

        if (ile) {
            this.cancelLeave(ile)
        }
        el.entering = true
        addClass(el, `${this.name}-enter`)
        addClass(el, `${this.name}-enter-from`)
        requestAnimationFrame(() => {
            addClass(el, `${this.name}-enter-to`)
            removeClass(el, `${this.name}-enter-from`)
        })
        onceListener(el, 'transitionend', () => {
            this.finishEnter(el)
            el.entering = false
        })
    }

    finishEnter(el: any) {
        removeClass(el, `${this.name}-enter-to`)
        removeClass(el, `${this.name}-enter`)
    }

    cancelEnter(el: any) {
        removeClass(el, `${this.name}-enter-to`)
        removeClass(el, `${this.name}-enter`)
    }

    beforeLeave(el: any) {

    }

    doLeave(el: any, callback: any) {
        if (el.entering) {
            this.cancelEnter(el)
        }

        addClass(el, `${this.name}-leave-from`)
        document.body.offsetHeight
        addClass(el, `${this.name}-leave`)
        requestAnimationFrame(() => {
            addClass(el, `${this.name}-leave-to`)
            removeClass(el, `${this.name}-leave-from`)
        })
        onceListener(el, 'transitionend', () => {
            this.finishLeave(el)
            callback()
        })
    }

    finishLeave(el: any) {
        removeClass(el, `${this.name}-leave-to`)
        removeClass(el, `${this.name}-leave`)
    }

    cancelLeave(el: any) {
        console.log('cancelLeave');
        this.finishLeave(el)
    }
}

