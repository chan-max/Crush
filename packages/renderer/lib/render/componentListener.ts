import { isArray, isFunction } from "@crush/common"


const globalInstanceEventListeners = new WeakMap()

// handler 支持数组和嵌套形式
type EventHandler = Function | undefined | EventHandler[]

export function getInstanceEvents(instance: any) {
    let listenersMap = globalInstanceEventListeners.get(instance)
    if (!listenersMap) {
        listenersMap = new Map()
        globalInstanceEventListeners.set(instance, listenersMap)
    }
    return listenersMap
}

export function getInstancetEventListeners(instance: any, event: string) {
    let events = getInstanceEvents(instance)
    let listeners = events.get(event)
    if (!listeners) {
        listeners = new Set()
        events.set(event, listeners)
    }
    return listeners
}

export function createInstanceEventEmitter(instance: any) {
    return (event: string, ...args: any[]) => {
        emitInstancetEvent(instance, event, ...args)
    }
}

export function emitInstancetEvent(instance: any, event: any, ...args: any[]) {
    const listeners = getInstancetEventListeners(instance, event)
    listeners.forEach((handler: Function) => {
        handler(...args)
    });
}


/* handler 标准化，转成数组格式 */
export function normalizeHandler(handler: any): any {
    return (isArray(handler) ? handler : [handler]).filter(isFunction)
}


export function updateInstanceListeners(instance: any, event: any, pHandler: EventHandler, nHandler: EventHandler) {
    // 不影响组件自身注册的事件
    removeInstanceListener(instance, event, pHandler)
    addInstanceListener(instance, event, nHandler)
}

export function addInstanceListener(instance: any, event: string, rawHandler: EventHandler) {
    const listeners = getInstancetEventListeners(instance, event)
    normalizeHandler(rawHandler).forEach((handler: any) => {
        listeners.add(handler)
    })
}

export function removeInstanceListener(instance: any, event: string, rawHandler: EventHandler) {
    const listeners = getInstancetEventListeners(instance, event)
    normalizeHandler(rawHandler).forEach((handler: any) => {
        listeners.delete(handler)
    })
}

export function onceInstanceListener(instance: any, event: string, rawHandler: EventHandler) {
    const listeners = getInstancetEventListeners(instance, event)
    normalizeHandler(rawHandler).forEach((handler: any) => {
        const onceHandler = (...args: any[]) => {
            handler(...args)
            listeners.delete(onceHandler)
        }
        listeners.add(onceHandler)
    })
}

// native events
