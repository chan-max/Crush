import {
    arrayToMap, initialLowerCase, initialUpperCase
} from '@crush/common'

// for renderer

const onRE = /^on[A-Z]/;
export const isEvent = (key: string) => onRE.test(key);

/*
    dom 事件名称无大写，所以name上第一个参数为事件名称，其它为arguments
*/
export const parseNativeEventName = (name: string) => {
    var keys = name.split(/(?=[A-Z])/).map((key: string) => key.toLowerCase())
    // remove on
    keys.shift()
    var event = keys[0]
    // remove eventName
    keys.shift()
    return {
        event,
        options: arrayToMap(keys)
    }
}


export function parseEventName(name: string) {
    return initialLowerCase(name.slice(2))
}

// 只有原生事件支持 opitons
export function toEventName(eventName: string, options?: string[]): string {
    var name = `on${initialUpperCase(eventName)}`
    if (options && options.length !== 0) {
        name += options.map(initialUpperCase).join('') // join default with ,
    }
    return name
}

const modifierGuards: any = {
    stop: (e: any) => e.stopPropagation(),
    prevent: (e: any) => e.preventDefault(),
    self: (e: any) => e.target !== e.currentTarget,
    ctrl: (e: any) => !e.ctrlKey,
    shift: (e: any) => !e.shiftKey,
    alt: (e: any) => !e.altKey,
    meta: (e: any) => !e.metaKey,
    left: (e: any) => 'button' in e && e.button !== 0,
    middle: (e: any) => 'button' in e && e.button !== 1,
    right: (e: any) => 'button' in e && e.button !== 2,
};

/*
    使用修饰符后每次都会创建一个新的函数    
*/
export function withEventModifiers(fn: any, modifiers: any) {
    return (event: any, ...args: any) => {
        for (let i = 0; i < modifiers.length; i++) {
            const guard = modifierGuards[modifiers[i]];
            if (guard && guard(event, modifiers))
                return;
        }
        return fn(event, ...args);
    };
};

