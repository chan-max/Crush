import {
    arrayToMap, initialLowerCase, initialUpperCase
} from '@crush/common'

// for renderer

const onRE = /^on[A-Z]/;
export const isEvent = (key: string) => onRE.test(key);

/*
    dom 事件名称无大写，所以name上第一个参数为事件名称，其它为arguments
*/

// 只有原生事件支持 opitons
export function toNativeEventName(eventName: string, _arguments?: string[]): string {
    var name = `on${initialUpperCase(eventName)}`
    if (_arguments && _arguments.length !== 0) {
        name += _arguments.map(initialUpperCase).join('') // join default with ,
    }
    return name
}

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

/* 
    @event:arg1:arg2.mod1.mod2
        tranform to...
        onEvent_arg1_arg2$mod1$mod2
*/

export function toEventName(event: string, _arguments?: string[], modifiers?: string[]) {
    event = `on${initialUpperCase(event)}`
    _arguments && (event += _arguments.map((_) => `_${_}`).join(''))
    modifiers && (event += modifiers.map(($) => `$${$}`).join(''))
    return event
}

// quickly get the handler key event
export function getEventName(name: string): string {
    return initialLowerCase(name.slice(2).split(/_|\$/)[0])
}


const extrctEventNameRE = /on([a-zA-Z]+)([_a-zA-Z]*)([\$a-zA-Z]*)/
export function parseEventName(name: string) {
    const [_, event, _argumentsStr, modifiersStr]: any = extrctEventNameRE.exec(name)
    return {
        event: initialLowerCase(event),
        _arguments: _argumentsStr && arrayToMap(_argumentsStr.split('_').filter(Boolean)),
        modifiers: modifiersStr && arrayToMap(modifiersStr.split('$').filter(Boolean))
    }
}


// 返回 true 代表停止事件执行

const modifierGuards: any = {
    stop: (e: any) => e.stopPropagation(),
    prevent: (e: any) => e.preventDefault(),
    self: (e: any) => e.target !== e.currentTarget,
    ctrl: (e: any) => !e.ctrlKey,
    shift: (e: any) => !e.shiftKey,
    alt: (e: any) => !e.altKey,
    meta: (e: any) => !e.metaKey,
    left: (e: any) => 'button' in e && e.button !== 0,
    middle: (e: any) => {
        'button' in e && e.button !== 1
    },
    right: (e: any) => 'button' in e && e.button !== 2,

    // 按键修饰符
    enter: (e: any) => {
        if (e.key !== 'Enter') {
            return true
        }
    }
};

const nativeEventModifiers = {
    
}

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

