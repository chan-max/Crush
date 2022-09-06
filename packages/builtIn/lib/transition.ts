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
        transition.appear = true
        const mountList = renderingVnode.filter((patchKey: any) => !vnode.map((_: any) => _.patchKey).includes(patchKey))
        const unmountList = vnode.filter((patchKey: any) => !renderingVnode.map((_: any) => _.patchKey).includes(patchKey))
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


const transitionBaseOptions = {
    fast: 500,
    normal: 800,
    slow: 1500
}

// normalize transiton options

// type : animate
// duration : 过渡时间 enter-duration , leave-duration
// timing-function : enter-timing-function , leave-timing-function
// delay : enter-delay , leave-delay

// type : css
// name :
// 

export function directiveBindingsToTransitionOptions(bindings: any) {
    const { _arguments, modifiers, filters, value } = bindings
    
}

export function defineTransitionOptions() { }

export const transitionDirective = {
    beforeCreate(_: any, { value }: any, vnode: any) {
        vnode.transition = createTransition(value)
    },
    beforeUpdate(_: any, { value }: any, nVnode: any, pVnode: any) {
        const transition = pVnode.transition
        transition.update(value)
        nVnode.transition = transition // extend
    }
}

export const transitionGroupDirective = {
    beforeUpdate() {
        debugger
    }
}