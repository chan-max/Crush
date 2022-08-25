import { getCurrentInstance } from '@crush/renderer'
import { getCurrentApp } from '../app/app'

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

export function useProps() {
    return getCurrentInstance().props
}



export function useRefs() {
    return getCurrentInstance().refs ||= {}
}

export function useRef(name: string) {
    let refs = useRefs()
    return refs[name]
}

export function useAttrs() {
    return getCurrentInstance().attrs ||= {}
}

export function useSlots() {
    return getCurrentInstance().slots ||= {}
}

export function useSlot(name: string = 'default') {
    return useSlots()[name]
}

export function useWatch() {
    return getCurrentInstance().watch
}

export function useRoot() {
    return getCurrentInstance().root
}

export function useParent() {
    return getCurrentInstance().parent
}

export function useEmit() {
    return getCurrentInstance().emit
}

export function useOn() {
    return getCurrentInstance().on
}

export function useOnce() {
    return getCurrentInstance().once
}

export function useOff() {
    return getCurrentInstance().off
}


export function useScope() {
    return getCurrentInstance().scope
}

export function useInstance() {
    return getCurrentInstance()
}

export function useApp() {
    return getCurrentApp()
}