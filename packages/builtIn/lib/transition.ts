import { emptyArray, emptyObject } from "@crush/common"
import { Nodes } from "@crush/const"
import { createTransition } from "@crush/renderer/lib/render/processTranstion"


export const transitionComponent = {
    props: {},
    render: ({ $slots }: any) => $slots.default(),
    beforeMount({ $instance: { scope, renderingVnode }, $props }: any) {
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

export function arrayDifference(arr1: any[], arr2: any[]) {
    let f1 = arr1.filter((i1: any) => !arr2.includes(i1))
    let f2 = arr2.filter((i2: any) => !arr1.includes(i2))
    return f1.concat(f2)
}

// 第一次进入任何元素都不会过渡
export const transitionGroupComponent = {
    props: {},
    render: ({ $slots }: any) => $slots.default(),
    beforeUpdate({ $instance: { scope, vnode, renderingVnode }, $props }: any) {
        const transtion = createTransition($props)
        const mountList = renderingVnode.filter((patchKey: any) => !vnode.map((_: any) => _.patchKey).includes(patchKey))
        const unmountList = vnode.filter((patchKey: any) => !renderingVnode.map((_: any) => _.patchKey).includes(patchKey))
        const transitionList = mountList.concat(unmountList)
        transitionList.forEach((_: any) => {
            _.transition = transtion
        })
    }
}

/*
    --transition.fast=""

*/



export const transitionDirective = {
    beforeCreate(_: any, { value }: any, vnode: any) {
        vnode.transition = createTransition(value)
    },
    beforeUpdate(_: any, { value }: any, nVnode: any, pVnode: any) {
        if (!pVnode) {
            // 此时为组件自更新
            return
        }
        const transition = pVnode.transition
        transition.update(value)
        nVnode.transition = transition // extend
    }
}

export const transitionGroupDirective = {

}