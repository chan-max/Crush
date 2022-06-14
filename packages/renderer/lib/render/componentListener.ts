import { isArray, isFunction } from "@crush/common"


const globalComponentListeners = new WeakMap()

// handler 支持数组和嵌套形式
type EventHandler = Function | undefined | EventHandler[]

export function getInstanceEvents(instance: any) {
    let listenersMap = globalComponentListeners.get(instance)
    if (!listenersMap) {
        listenersMap = new Map()
        globalComponentListeners.set(instance, listenersMap)
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

function emitInstancetEvent(instance: any, event: any, ...args: any[]) {
    const listeners = getInstancetEventListeners(instance, event)
    listeners.forEach((handler: Function) => {
        handler(...args)
    });
}

const enum ListenerOperateType {
    ADD,
    DELETE,
    ONCE
}

function operateListeners(operatorType: ListenerOperateType, listeners: Set<any>, handler: EventHandler) {
    if (isFunction(handler)) {
        switch (operatorType) {
            case ListenerOperateType.ADD:
                listeners.add(handler)
                break
            case ListenerOperateType.DELETE:
                listeners.delete(handler)
                break
            case ListenerOperateType.ONCE:
                const onceHandler = (...args: any[]) => {
                    (handler as Function)(...args)
                    listeners.delete(onceHandler)
                }
                listeners.add(onceHandler)
                break
        }
    } else if (isArray(handler)) {
        handler.forEach((_handler) => operateListeners(operatorType, listeners, _handler))
    }
}

export function updateInstanceListeners(instance: any, event: any, pHandler: EventHandler, nHandler: EventHandler) {
    // 不影响组件自身注册的事件
    removeInstanceListener(instance, event, pHandler)
    addInstanceListener(instance, event, nHandler)
}

export function addInstanceListener(instance: any, event: string, handler: EventHandler) {
    operateListeners(ListenerOperateType.ADD, getInstancetEventListeners(instance, event), handler)
}

export function removeInstanceListener(instance: any, event: string, handler: EventHandler) {
    operateListeners(ListenerOperateType.DELETE, getInstancetEventListeners(instance, event), handler)
}

export function onceInstanceListener(instance: any, event: string, handler: EventHandler) {
    operateListeners(ListenerOperateType.ONCE, getInstancetEventListeners(instance, event), handler)
}

