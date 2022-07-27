

import { isNumber } from "@crush/common"
import { getElementComputedStyle, getElementComputedStyleValue, getElementStyle, getElementStyleValue, onceListener, removeListener, setElementStyleDeclaration } from "@crush/renderer"



// 指定一个动画keyframes，在执行后自动移除，不影响元素本身属性 

function normalizeMs(value: any) {
    return isNumber(Number(value)) ? value + 'ms' : value
}

export function doKeyframesAnimation(el: HTMLElement, options: any, endCb?: any, cancelCb?: any) {

    let _name = getElementComputedStyleValue(el, 'animationName')

    if (_name && _name !== 'none') {
        // ! 元素本身不应该存在动画名称属性
        return
    }


    const {
        name,
        duration,
        timingFunction,
        delay,
        playState,
        fillMode,
        iterationCount,  // infinite 无限次时 结束回调失效
        direction
    } = options

    const animationDeclaration = {
        animationName: name,
        animationDuration: normalizeMs(duration), // 默认为毫秒
        animationDelay: normalizeMs(delay), // 默认为毫秒
        animationTimingFunction: timingFunction,
        animationPlayState: playState,
        animationFillMode: fillMode,
        animationIterationCount: iterationCount,
        animationDirection: direction
    }

    // 动画执行结束后再还原属性
    let copy = getElementStyle(el, animationDeclaration)

    setElementStyleDeclaration(el, animationDeclaration)

    let animationCompleteHandler = () => {
        // 重新设置之前的属性
        setElementStyleDeclaration(el, copy)
        if (endCb) {
            endCb(el)
        }
    }

    onceListener(el, 'animationend', animationCompleteHandler)

    let cancelled = false
    // stop animation , 只有动画成功执行才会返回取消方法
    return () => {
        if (cancelled) {
            return
        }
        setElementStyleDeclaration(el, copy)
        removeListener(el, 'animationend', animationCompleteHandler) // 手动移除侦听器
        if (cancelCb) {
            cancelCb(el)
        }
        cancelled = true
    }
}





