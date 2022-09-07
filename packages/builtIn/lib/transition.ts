import { emptyArray, emptyObject } from "@crush/common"

import { createTransition } from "@crush/renderer/lib/render/processTranstion"

export function arrayDifference(arr1: any[], arr2: any[]) {
    let f1 = arr1.filter((i1: any) => !arr2.includes(i1))
    let f2 = arr2.filter((i2: any) => !arr1.includes(i2))
    return f1.concat(f2)
}

// 第一次进入任何元素都不会过渡
export const transitionGroupComponent = {
    render: ({ $slots }: any) => $slots.default(),
    beforeUpdate({ $instance: { vnode, renderingVnode }, $props }: any) {
        const transition = createTransition($props)
        // always true
        transition.options.appear = true
        const mountList = renderingVnode.filter((_key: any) => !vnode.map((_: any) => _._key).includes(_key))
        const unmountList = vnode.filter((_key: any) => !renderingVnode.map((_: any) => _._key).includes(_key))
        const transitionList = mountList.concat(unmountList)
        transitionList.forEach((_: any) => {
            _.transition = transition
        })
    }
}



export const transitionComponent = {
    render: ({ $slots }: any) => $slots.default(),
    beforeMount({ $instance: { renderingVnode }, $props }: any) {
        const transtion = createTransition($props)
        renderingVnode.forEach((vnode: any) => {
            vnode.transition = transtion
        });
    },
    beforeUpdate({ $instance: { renderingVnode }, $props }: any) {
        const transtion = createTransition($props)
        renderingVnode && renderingVnode.forEach((vnode: any) => {
            vnode.transition = transtion
        });
    }
}


const transitionTimes: any = {
    fast: 200,
    normal: 400,
    slow: 600
}

import { transitionKeyframes } from "@crush/animate"

export function directiveBindingsToTransitionOptions(bindings: any) {
    let { _arguments, modifiers, filters, value } = bindings
    let transitionOptions = value || {} // value 的优先级大于其他修饰符
    
    // 第一个参数指定动画类型
    transitionOptions.type || _arguments[0] || 'animate'

    if (transitionOptions.type === 'animate') {
        // *transition:animate.slow.fast.normal
        // 修饰符指定速度 , 第一个代表duration ， 第二个代表delay
        // duration : 过渡时间 enter-duration , leave-duration
        // timing-function : enter-timing-function , leave-timing-function
        // delay : enter-delay , leave-delay
        // keyframes : enter-keyframes , leave-keyframes

    } else if (transitionOptions.type === 'css') {

    }

    return transitionOptions
}


export function transitionComponentPropsToTransitionOptions(props: any) {

}

export function defineTransitionOptions() { }

export const transitionDirective = {
    beforeCreate(_: any, bindings: any, vnode: any) {
        vnode.transition = createTransition(directiveBindingsToTransitionOptions(bindings))
    },
    beforeUpdate(_: any, bindings: any, nVnode: any, pVnode: any) {
        const transition = pVnode.transition
        transition.update(directiveBindingsToTransitionOptions(bindings))
        nVnode.transition = transition // extend
    }
}

export const transitionGroupDirective = {
    beforeUpdate() {
        debugger
    }
}