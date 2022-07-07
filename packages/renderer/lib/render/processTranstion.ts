import { setDisplay } from "@crush/builtin/lib/show"
import { emptyObject, initialUpperCase } from "@crush/common"
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

function hasAppeared(el: any) {
    let { patchKey, instance } = el._vnode
    let appearRecord = instance.appearRecord ||= {}
    return appearRecord[patchKey]
}

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
    onBeforeAppear: any
    onAppear: any
    onAfterAppear: any
    onAppearCancelled: any

    constructor(options: any) {
        this.update(options)
    }

    update(options: any) {
        options ||= emptyObject
        const {
            type,
            name,
            duration,
            appear,
            // hooks
            onBeforeEnter,
            onEnter,
            onAfterEnter,
            onEnterCancelled,
            onBeforeLeave,
            onLeave,
            onAfterLeave,
            onLeaveCancelled,
            onBeforeAppear,
            onAppear,
            onAfterAppear,
            onAppearCancelled
        } = options
        this.name = name || 'transition'
        this.type = type || 'css'
        // 该元素在组件中是否为第一次渲染
        this.appear = appear || false
        this.duration = duration
        this.onBeforeEnter = onBeforeEnter
        this.onEnter = onEnter
        this.onAfterEnter = onAfterEnter
        this.onEnterCancelled = onEnterCancelled
        this.onBeforeLeave = onBeforeLeave
        this.onLeave = onLeave
        this.onAfterLeave = onAfterLeave
        this.onLeaveCancelled = onLeaveCancelled
        this.onBeforeAppear = onBeforeAppear
        this.onAppear = onAppear
        this.onAfterAppear = onAfterAppear
        this.onAppearCancelled = onAppearCancelled
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
    cancelEnter() {}
    canceleave() {}

    public processMount(newEl: any, insertFn: any) {
        let { patchKey, instance } = newEl._vnode
        let appearRecord = instance.appearRecord ||= {}
        let appeared = appearRecord[patchKey]

        if (!this.appear && !appeared) {
            // once process
            // appear
            insertFn()
            appearRecord[patchKey] = true
            return
        }

        let leavingEl = leavingElements[patchKey]

        if (leavingEl) {
            // 上个元素还没卸载完成（过渡中） 直接卸载
            removeElement(leavingEl)
            leavingElements[patchKey] = null
        }


        // beforeEnter
        insertFn()
        newEl._entering = true
        this.bindeEnterClass(newEl)

        onceListener(newEl, 'transitionend', () => {
            // after enter
            this.removeEnterClass(newEl)
            newEl._entering = true
        })

        appearRecord[patchKey] = true
    }

    public processUnmount(el: any) {
        let { patchKey } = el._vnode

        if (el._entering) {
            // 正在进入 ，取消进入动画
            this.removeEnterClass(el)
        }

        leavingElements[patchKey] = el
        this.bindeLeaveClass(el)
        onceListener(el, 'transitionend', () => {
            // 元素直接卸载就不需要卸载class了
            removeElement(el)
            leavingElements[patchKey]
        })
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


