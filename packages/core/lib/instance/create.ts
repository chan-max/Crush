import { getCurrentInstance } from '@crush/renderer'

// create , 优先级比options中的name高 , 用于组件递归
export function defineSelfName(name: string) {
    let instance = getCurrentInstance()
    let components = instance.components ||= {}

    // 将自身配置注册到自身组件中
    components[name] = instance.options
}


export function useUid() {
    return getCurrentInstance().uid
}  

export function useOptions() {
    return getCurrentInstance().customOptions
}