import {
    arrayToMap,    capitalize
} from '@crush/common'

// for renderer

const onRE = /^on[A-Z]/;
export const isEvent = (key: string) => onRE.test(key);

export const parseHandlerKey = (handlerKey: string) => {
    var keys = handlerKey.split(/(?=[A-Z])/).map((key: string) => key.toLowerCase())
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

// for compiler
export function createHandlerKey(eventName: string, options?: string[]): string {
    var handlerKey = `on${capitalize(eventName)}`
    if (options && options.length !== 0) {
        handlerKey += options.map(capitalize).join('') // join default with ,
    }
    return handlerKey
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
export function createEvent(fn: any, modifiers: any) {
    return (event: any, ...args: any) => {
        for (let i = 0; i < modifiers.length; i++) {
            const guard = modifierGuards[modifiers[i]];
            if (guard && guard(event, modifiers))
                return;
        }
        return fn(event, ...args);
    };
};