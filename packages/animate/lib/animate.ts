

import { isNumber } from "@crush/common"
import { getElementComputedStyle, getElementComputedStyleValue, getElementStyle, getElementStyleValue, onceListener, removeListener, setElementStyleDeclaration } from "@crush/renderer"



// 指定一个动画keyframes，在执行后自动移除，不影响元素本身属性 

function normalizeMs() {

}

export function doCSSAnimation(el: HTMLElement, options: any, endCb?: any, cancelCb?: any) {

    const {
        name,
        duration,
        timingFunction,
        delay,
        playState,
        fillMode,
        iterationCount,
        direction
    } = options

    const animationDeclaration = {
        animationName: name,
        animationDuration: isNumber(Number(duration)) ? duration + 'ms' : duration, // 默认为毫秒
        animationDelay: isNumber(Number(delay)) ? delay + 'ms' : delay, // 默认为毫秒
        animationTimingFunction: timingFunction,
        animationPlayState: playState,
        animationFillMode: fillMode,
        animationIterationCount: iterationCount,
        animationDirection: direction
    }

    let _name = getElementComputedStyleValue(el, 'animationName')

    if (_name && _name !== 'none') {
        // ! 注意执行时不应该存在元素本身或从继承来的animation属性
        return
    }

    // 动画执行结束后再还原属性
    let copy = getElementStyle(el, animationDeclaration)
    setElementStyleDeclaration(el, animationDeclaration)

    let handler = () => {
        // 重新设置之前的属性
        setElementStyleDeclaration(el, copy)
        if (endCb) {
            endCb(el)
        }
    }

    onceListener(el, 'animationend', handler)

    let cancelled = false
    // stop animation , 只有动画成功执行才会返回取消方法
    return () => {
        if (cancelled) {
            return
        }
        setElementStyleDeclaration(el, copy)
        removeListener(el, 'animationend', handler) // 手动移除侦听器
        if (cancelCb) {
            cancelCb(el)
        }
        cancelled = true
    }
}





