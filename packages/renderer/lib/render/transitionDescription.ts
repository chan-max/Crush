
import { emptyObject } from "@crush/common"
import { addClass, removeClass, removeElement } from "../dom"


/*
    duration 
    timingFunction
    delay
*/

export const createTransition = (transitionOptions: any) => new TransitionDescription(transitionOptions)

export class TransitionDescription {
    constructor(transitionOptions: any) {
        this.initOptions(transitionOptions)
    }

    name: any

    initOptions(transitionOptions: any) {
        transitionOptions ||= emptyObject
        this.name = transitionOptions.name || 'transition'
    }

    update(transitionOptions: any) {
        this.initOptions(transitionOptions)
    }

    enter(el: any) {
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

    leave(el: any) {
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

