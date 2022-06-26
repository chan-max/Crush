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
    constructor(transitionOptions: any) {
        this.initOptions(transitionOptions)
    }

    type: any // css / animation

    name: any

    // hooks
    beforeEnter: any


    initOptions(transitionOptions: any) {
        transitionOptions ||= emptyObject
        this.name = transitionOptions.name || 'transition'
        const {
            type,
            name,
            // hooks
            beforeEnter,
            enter,
            afterEnter,
            enterCancelled,
            boforeLeave,
            leave,
            afterLeave,
            leaveCancelled
        } = transitionOptions
    }

    update(transitionOptions: any) {
        this.initOptions(transitionOptions)
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

