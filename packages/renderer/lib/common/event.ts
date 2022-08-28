import {
    arrayToMap, initialLowerCase, initialUpperCase, isArray, isString
} from '@crush/common'
import { getCurrentApp } from '@crush/core';

// for renderer

const onRE = /^on[A-Z]/;
export const isEvent = (key: string) => onRE.test(key);

/*
    dom 事件名称无大写，所以name上第一个参数为事件名称，其它为arguments
*/

// 只有原生事件支持 opitons
export function toNativeEventName(eventName: string, _arguments?: string[]): string {
    if (!eventName) {
        return ''
    }
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

export function toEventName(event: string, _arguments?: string[], modifiers?: string[], filters?: string[]) {
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



export const modifierGuards: any = {
    stop: (e: any) => e.stopPropagation(),
    prevent: (e: any) => e.preventDefault(),
    self: (e: any) => e.target !== e.currentTarget,

    ctrl: (e: any) => !e.ctrlKey,
    shift: (e: any) => !e.shiftKey,
    alt: (e: any) => !e.altKey,
    meta: (e: any) => !e.metaKey,

    // 需要把事件转换成 onMouseup
    left: (e: any) => 'button' in e && e.button !== 0,
    middle: (e: any) => 'button' in e && e.button !== 1,
    right: (e: any) => 'button' in e && e.button !== 2,

};

// 使用 withEventModifiers 才会初始化
let reverseKeyCodes: any = null

export function createReverseKeyCodes() {
    let keyCodes: any = getCurrentApp().keyCodes
    let reverseKeyCodes: any = {}
    for (let key in keyCodes) {
        let value = keyCodes[key]
        if (isString(value)) {
            let reverseValue = reverseKeyCodes[value] ||= []
            reverseValue.push(key)
        } else if (isArray(value)) {
            value.forEach((val: any) => {
                let reverseValue = reverseKeyCodes[val] ||= []
                reverseValue.push(key)
            })
        }
    }
    return reverseKeyCodes
}

export function withEventModifiers(fn: any, modifiers: any) {
    reverseKeyCodes ||= createReverseKeyCodes()

    // key 按键守卫
    let guardKeyCodes = modifiers && modifiers.reduce((res: string[], modifier: string) => {
        if (reverseKeyCodes[modifier]) {
            res = res.concat(reverseKeyCodes[modifier])
        }
        return res
    }, [])

    // 增加按键守卫

    let withKeyGuardFn = guardKeyCodes ? (event: any, ...args: any) => {
        if (guardKeyCodes.includes(event.code)) {
            fn(event, ...args)
        }
    } : fn

    return (event: any, ...args: any) => {
        for (let i = 0; i < modifiers.length; i++) {
            const guard = modifierGuards[modifiers[i]];
            if (guard && guard(event, modifiers)) {
                // 
                return
            }
        }
        return withKeyGuardFn(event, ...args);
    };
};







export const keyCodes = {
    // 普通写法
    Escape: 'escape',
    // 两个keycode使用同一个修饰符时代表，这两个键均可以触发
    Numpad0: '0',
    Digit0: '0',
    // 当一个keycode有多个修饰符时，代表多个修饰符指向kecode
    Delete: ['delete', 'del'],
    Digit1: null,
    Digit2: null,
    Digit3: null,
    Digit4: null,
    Digit5: null,
    Digit6: null,
    Digit7: null,
    Digit8: null,
    Digit9: null,
    Minus: null,
    Equal: null,
    Backspace: null,
    Tab: null,
    KeyQ: null,
    KeyW: null,
    KeyE: null,
    KeyR: null,
    KeyT: null,
    KeyY: null,
    KeyU: null,
    KeyI: null,
    KeyO: null,
    KeyP: null,
    BracketLeft: null,
    BracketRight: null,
    Enter: null,
    ControlLeft: null,
    KeyA: null,
    KeyS: null,
    KeyD: null,
    KeyF: null,
    KeyG: null,
    KeyH: null,
    KeyJ: null,
    KeyK: null,
    KeyL: null,
    Semicolon: null,
    Quote: null,
    Backquote: null,
    ShiftLeft: null,
    Backslash: null,
    KeyZ: null,
    KeyX: null,
    KeyC: null,
    KeyV: null,
    KeyB: null,
    KeyN: null,
    KeyM: null,
    Comma: null,
    Period: null,
    Slash: null,
    ShiftRight: null,
    NumpadMultiply: null,
    AltLeft: null,
    Space: null,
    CapsLock: null,
    F1: null,
    F2: null,
    F3: null,
    F4: null,
    F5: null,
    F6: null,
    F7: null,
    F8: null,
    F9: null,
    F10: null,
    Pause: null,
    ScrollLock: null,
    Numpad7: null,
    Numpad8: null,
    Numpad9: null,
    NumpadSubtract: null,
    Numpad4: null,
    Numpad5: null,
    Numpad6: null,
    NumpadAdd: null,
    Numpad1: null,
    Numpad2: null,
    Numpad3: null,
    NumpadDecimal: null,
    PrintScreen: null,
    IntlBackslash: null,
    F11: null,
    F12: null,
    NumpadEqual: null,
    F13: null,
    F14: null,
    F15: null,
    F16: null,
    F17: null,
    F18: null,
    F19: null,
    F20: null,
    F21: null,
    F22: null,
    F23: null, F24: null,
    KanaMode: null,
    Lang2: null,
    Lang1: null,
    IntlRo: null,
    Convert: null,
    NonConvert: null,
    IntlYen: null,
    NumpadComma: null,
    Undo: null,
    Paste: null,
    MediaTrackPrevious: null,
    Cut: null,
    Copy: null,
    MediaTrackNext: null,
    NumpadEnter: null,
    ControlRight: null,
    LaunchMail: null,
    AudioVolumeMute: null,
    VolumeMute: null,
    LaunchApp2: null,
    MediaPlayPause: null,
    MediaStop: null,
    Eject: null,
    AudioVolumeDown: null,
    VolumeDown: null,
    AudioVolumeUp: null,
    VolumeUp: null,
    BrowserHome: null,
    NumpadDivide: null,
    AltRight: null,
    Help: null,
    NumLock: null,
    Home: null,
    ArrowUp: null,
    PageUp: null,
    ArrowLeft: null,
    ArrowRight: null,
    End: null,
    ArrowDown: null,
    PageDown: null,
    Insert: null,
    MetaLeft: null,
    OSLeft: null,
    MetaRight: null,
    OSRight: null,
    ContextMenu: null,
    Power: null,
    BrowserSearch: null,
    BrowserFavorites: null,
    BrowserRefresh: null,
    BrowserStop: null,
    BrowserForward: null,
    BrowserBack: null,
    LaunchApp1: null,
    LaunchMediaPlayer: null,
    MediaSelect: null
}   