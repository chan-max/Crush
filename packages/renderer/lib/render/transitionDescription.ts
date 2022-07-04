import { emptyObject } from "@crush/common"
import { addClass, removeClass, removeElement } from "../dom"


/*
    duration 
    timingFunction
    delay
*/

export const createTransition = (transitionOptions: any) => new TransitionDescription(transitionOptions)


//! 多个元素可能共享同一个过渡描述实例，所以调用相关方法需要手动传入对应得元素

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
        this.initOptions(transitionOptions)
    }

    initOptions(transitionOptions: any) {
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

    update(transitionOptions: any) {
        this.initOptions(transitionOptions)
    }

    beforeEnter(el: any) {

    }

    doEnter(el: any) {
        addClass(el, `${this.name}-enter`)
        addClass(el, `${this.name}-enter-from`)
        requestAnimationFrame(() => {
            addClass(el, `${this.name}-enter-to`)
            removeClass(el, `${this.name}-enter-from`)
        })
    }

    finishEnter(el: any) {
        removeClass(el, `${this.name}-enter-to`)
        removeClass(el, `${this.name}-enter`)
    }

    cancelEnter(el: any) {
        console.log('cancel enter');
        this.finishEnter(el)
    }

    beforeLeave(el: any) {

    }

    doLeave(el: any) {
        addClass(el, `${this.name}-leave-from`)
        document.body.offsetHeight
        addClass(el, `${this.name}-leave`)
        requestAnimationFrame(() => {
            addClass(el, `${this.name}-leave-to`)
            removeClass(el, `${this.name}-leave-from`)
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

