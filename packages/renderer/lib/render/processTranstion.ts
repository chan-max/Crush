import { doKeyframesAnimation } from "@crush/animate"
import { setDisplay } from "@crush/builtin/lib/show"
import { emptyObject, initialUpperCase } from "@crush/common"
import { addClass, onceListener, remountElement, removeClass, removeElement } from "../dom"

let _requestAnimationFrame: any = (cb: any) => requestAnimationFrame(() => requestAnimationFrame(cb))

//! class
export function bindEnterClass(el: Element, name: string) {
    addClass(el, `${name}-enter`)
    addClass(el, `${name}-enter-from`)
    _requestAnimationFrame(() => {
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
    _requestAnimationFrame(() => {
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

    enterKeyframes: any
    leaveKeyframes: any

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
    onBeforeAppear: any
    onAppear: any
    onAfterAppear: any
    onAppearCancelled: any

    // 指定class名称 ，高优先级
    enterClass: any
    enterToClass: any
    enterFromClass: any
    leaveClass: any
    leaveFromClass: any
    leaveToClass: any


    constructor(options: any) {
        this.update(options)
    }

    update(options: any) {
        options ||= emptyObject
        this.type = options.type || 'css' // 默认采用 css
        this.name = options.name || 'transition' // css 过渡的class名称
        this.enterClass = options.enterClass
        this.enterFromClass = options.enterFromClass
        this.enterToClass = options.enterToClass
        this.leaveClass = options.leaveClass
        this.leaveFromClass = options.leaveFromClass
        this.leaveToClass = options.leaveToClass
        // 该元素在组件中是否为第一次渲染
        this.appear = options.appear || false
        this.duration = options.duration
        this.onBeforeEnter = options.onBeforeEnter
        this.onEnter = options.onEnter
        this.onAfterEnter = options.onAfterEnter
        this.onEnterCancelled = options.onEnterCancelled
        this.onBeforeLeave = options.onBeforeLeave
        this.onLeave = options.onLeave
        this.onAfterLeave = options.onAfterLeave
        this.onLeaveCancelled = options.onLeaveCancelled
        this.onBeforeAppear = options.onBeforeAppear
        this.onAppear = options.onAppear
        this.onAfterAppear = options.onAfterAppear
        this.onAppearCancelled = options.onAppearCancelled
        this.enterKeyframes = options.enterKeyframes
        this.leaveKeyframes = options.leaveKeyframes
    }

    bindeEnterClass = (el: any) => bindEnterClass(el, this.name)
    bindeLeaveClass = (el: any) => bindLeaveClass(el, this.name)
    removeEnterClass = (el: any) => removeEnterClass(el, this.name)
    removeLeaveClass = (el: any) => removeLeaveClass(el, this.name)

    callHook = (hookName: string, ...args: any) => {
        let _this: any = this
        let hook = _this[`on${initialUpperCase(hookName)}`]
        if (hook) {
            hook.call(_this, ...args)
        }
    }

    beforeEnter() { }
    beforeLeave() { }
    cancelEnter() { }
    canceleave() { }

    // 关于 transition group

    public processMount(newEl: any, insertFn: any) {
        let { patchKey, instance } = newEl._vnode
        let appearRecord = instance.appearRecord ||= {}
        let appeared = appearRecord[patchKey]
        if (!this.appear && !appeared) {
            // appear
            insertFn()
            appearRecord[patchKey] = true
            return
        }


        let leavingEl = leavingElements[patchKey]

        if (leavingEl) {
            // 上个元素还没卸载完成（过渡中） 直接卸载 , 不管是css过渡还是动画过度，直接卸载即可
            removeElement(leavingEl)
            leavingElements[patchKey] = null
        }


        // 进入动画挂载
        insertFn()
        appearRecord[patchKey] = true

        newEl._entering = true

        if (this.type === 'animate') {
            newEl.cancelKeyframes = doKeyframesAnimation(newEl, {
                name: this.enterKeyframes,
                duration: this.duration,
            })
            onceListener(newEl, 'animationend', () => {
                // after enter
                newEl._entering = false
            })
        } else if (this.type === 'css') {
            this.bindeEnterClass(newEl)

            onceListener(newEl, 'transitionend', () => {
                // after enter
                this.removeEnterClass(newEl)
                newEl._entering = false
            })
        } else {
            insertFn()
        }
    }

    public processUnmount(el: any) {
        let { patchKey } = el._vnode
        // 正在进入 ，取消进入动画, 进入卸载东动画
        if (el._entering) {
            if (this.type === 'css') {
                this.removeEnterClass(el)
            } else if (this.type === 'animate') {
                el.cancelKeyframes()
            }
        }

        leavingElements[patchKey] = el

        if (this.type === 'css') {
            this.bindeLeaveClass(el)
            onceListener(el, 'transitionend', () => {
                // 元素直接卸载就不需要卸载class了
                removeElement(el)
                leavingElements[patchKey] = null
            })
        } else if (this.type === 'animate') {
            doKeyframesAnimation(el, {
                name: this.leaveKeyframes,
                duration: this.duration
            })
            onceListener(el, 'animationend', () => {
                // 元素直接卸载就不需要卸载class了
                removeElement(el)
                leavingElements[patchKey] = null
            })
        } else {
            // 其他类型 ， 开发中
            removeElement(el)
        }
    }

    // show todo
    public processShow(el: any) {
        // appear 好像蹭挂载的就可以了
        // enter
        if (el._leaving) {
            // cancel leave
            this.removeLeaveClass(el)
            el._leaving = false
            // 此时如果进入进入动画的话，会使用过渡，而不是直接设为
            // 按逻辑说应该设为none，但好像没必要
        }


        el._entering = true
        setDisplay(el, true)

        // 解决bug，让元素重新挂载一次
        remountElement(el)

        this.bindeEnterClass(el)

        onceListener(el, 'transitionend', () => {
            this.removeEnterClass(el)
            setDisplay(el, true)
            el._entering = false
        })
    }

    processHide(el: any) {
        if (el._entering) {
            // cancel
            this.removeEnterClass(el)
            el._entering = false
        }

        el._leaving = true
        this.bindeLeaveClass(el)
        onceListener(el, 'transitionend', () => {
            this.removeLeaveClass(el)
            el._leaving = false
            setDisplay(el, false)
        })
    }
}


