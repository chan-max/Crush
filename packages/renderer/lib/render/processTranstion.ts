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
    options: any
    constructor(options: any) {
        this.update(options)
    }

    update(options: any) {
        this.options = options
    }

    bindeEnterClass = (el: any) => bindEnterClass(el, this.options.name)
    bindeLeaveClass = (el: any) => bindLeaveClass(el, this.options.name)
    removeEnterClass = (el: any) => removeEnterClass(el, this.options.name)
    removeLeaveClass = (el: any) => removeLeaveClass(el, this.options.name)

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
        let { _key, instance } = newEl._vnode
        let appearRecord = instance.appearRecord ||= {}
        let appeared = appearRecord[_key]
        if (!this.options.appear && !appeared) {
            // appear
            insertFn()
            appearRecord[_key] = true
            return
        }


        let leavingEl = leavingElements[_key]

        if (leavingEl) {
            // 上个元素还没卸载完成（过渡中） 直接卸载 , 不管是css过渡还是动画过度，直接卸载即可
            removeElement(leavingEl)
            leavingElements[_key] = null
        }


        // 进入动画挂载
        insertFn()
        appearRecord[_key] = true

        newEl._entering = true

        if (this.options.type === 'animate') {
            newEl.cancelKeyframes = doKeyframesAnimation(newEl, {
                name: this.options.enterKeyframes,
                duration: this.options.enterDuration,
                delay: this.options.enterDelay,
                timingFunction: this.options.enterTimingFunction
            })
            onceListener(newEl, 'animationend', () => {
                // after enter
                newEl._entering = false
            })
        } else if (this.options.type === 'css') {
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
        let { _key } = el._vnode
        // 正在进入 ，取消进入动画, 进入卸载东动画
        if (el._entering) {
            if (this.options.type === 'css') {
                this.removeEnterClass(el)
            } else if (this.options.type === 'animate') {
                el.cancelKeyframes()
            }
        }

        leavingElements[_key] = el

        if (this.options.type === 'css') {
            this.bindeLeaveClass(el)
            onceListener(el, 'transitionend', () => {
                // 元素直接卸载就不需要卸载class了
                removeElement(el)
                leavingElements[_key] = null
            })
        } else if (this.options.type === 'animate') {
            doKeyframesAnimation(el, {
                name: this.options.leaveKeyframes,
                duration: this.options.leaveDuration,
                delay: this.options.leaveDelay, // delay 指的是动画的执行延时时间
                timingFunction: this.options.leaveTimingFunction
            })
            onceListener(el, 'animationend', () => {
                // 元素直接卸载就不需要卸载class了
                removeElement(el)
                leavingElements[_key] = null
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


