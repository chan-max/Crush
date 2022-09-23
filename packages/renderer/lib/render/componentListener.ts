import { isArray, isFunction } from "@crush/common"


const globalInstanceEventListeners = new WeakMap()

// handler 支持数组和嵌套形式
type EventHandler = Function | undefined | EventHandler[]

export function getInstanceEvents(instance: any) {
    let events = globalInstanceEventListeners.get(instance)
    if (!events) {
        events = {}
        globalInstanceEventListeners.set(instance, events)
    }
    return events
}

export function getInstanceEvent(instance: any, event: any, _arguments?: any, modifiers?: any, filters?: any) {
    let events = getInstanceEvents(instance)
    let _event = events[event]
    if (!_event) {
        _event = {
            listeners: new Set(),
            _arguments, modifiers, filters
        }
        events[event] = _event
    }
    return _event
}

export function getInstancetEventListeners(instance: any, event: string) {
    let _event = getInstanceEvent(instance, event)
    return _event.listeners
}

export function createInstanceEmit(instance: any) {
    return (event: string, ...args: any[]) => emitInstancetEvent(instance, event, ...args)
}

export function createInstanceOn(instance: any) {
    return (event: string, handler: any) => addInstanceListener(instance, event, handler)
}

export function createInstanceOff(instance: any) {
    return (event: string, handler: any) => removeInstanceListener(instance, event, handler)
}

export function createInstanceOnce(instance: any) {
    return (event: string, handler: any) => onceInstanceListener(instance, event, handler)
}

export function emitInstancetEvent(instance: any, event: any, ...args: any[]) {
    const listeners = getInstancetEventListeners(instance, event)
    listeners.forEach((handler: Function) => {
        handler(...args)
    });
}


/* handler 标准化，转成数组格式 */
export function normalizeHandler(handler: any): any[] {
    return (isArray(handler) ? handler : [handler]).filter(isFunction)
}


export function updateInstanceListeners(instance: any, event: any, pHandler: any, nHandler: any, _arguments: any, modifiers: any, filters: any) {

    if (pHandler === nHandler) {
        return
    }
    // 不影响组件自身注册的事件
    let _event = getInstanceEvent(instance, event, _arguments, modifiers, filters)
    let listeners = _event.listeners

    pHandler = normalizeHandler(pHandler)
    nHandler = normalizeHandler(nHandler)

    pHandler.forEach((handler: any) => {
        if (!nHandler.includes(handler)) {
            listeners.delete(handler)
        }
    });
    nHandler.forEach((handler: any) => {
        if (!pHandler.includes(handler)) {
            listeners.add(handler)
        }
    })
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
