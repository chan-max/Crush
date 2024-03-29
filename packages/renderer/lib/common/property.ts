import {
    camelize, initialLowerCase, initialUpperCase, isArray, isFunction, isString
} from '@crush/common'
import { getCurrentApp } from '@crush/core';

// for renderer

const eventRE = /^on[A-Z]/;
export const isEvent = (key: string) => eventRE.test(key);
const inlineEventNameRE = /^on[a-z]/;
export const isInlineEvent = (key: string) => inlineEventNameRE.test(key);

/*
    argument $
    modifier _
    filter $_
*/

export function toEventName(event: string, _arguments?: string[], modifiers?: string[], filters?: string[]) {
    if (!event) {
        return ''
    }
    event = `on${initialUpperCase(camelize(event))}`
    _arguments && (event += _arguments.map(($) => `$${$}`).join(''))
    modifiers && (event += modifiers.map((_) => `_${_}`).join(''))
    filters && (event += filters.map(($_) => `$_${$_}`).join(''))
    return event
}

export function toPropertyName(name: string, _arguments?: any, modifiers?: any, filters?: any): string {
    if (!name) {
        return ''
    }
    _arguments && (name += _arguments.map(($: any) => `$${$}`).join(''))
    modifiers && (name += modifiers.map((_: any) => `_${_}`).join(''))
    filters && (name += filters.map(($_: any) => `$_${$_}`).join(''))
    return name
}

const extrctPropertyNameRE = /([a-zA-Z]+)([\$a-zA-Z]*)([_a-zA-Z]*)([\$_a-zA-Z]*)/

export function parsePropertyName(name: any) {
    const [_, property, _argumentsStr, modifiersStr, filterStr]: any = extrctPropertyNameRE.exec(name)
    return {
        property,
        _arguments: (_argumentsStr && _argumentsStr.split('$').filter(Boolean)) || null,
        modifiers: (modifiersStr && modifiersStr.split('_').filter(Boolean)) || null,
        filters: (filterStr && filterStr.split('$_').filter(Boolean)) || null,
    }
}

// quickly get the handler key event
export function getEventName(name: string): string {
    return initialLowerCase(name.slice(2).split(/_|\$/)[0])
}


const extrctEventNameRE = /on([a-zA-Z]+)([\$a-zA-Z]*)([_a-zA-Z]*)([\$_a-zA-Z]*)/
export function parseEventName(name: string): any {
    const [_, event, _argumentsStr, modifiersStr, filterStr]: any = extrctEventNameRE.exec(name)
    return {
        event: initialLowerCase(event),
        _arguments: (_argumentsStr && _argumentsStr.split('$').filter(Boolean)) || null,
        modifiers: (modifiersStr && modifiersStr.split('_').filter(Boolean)) || null,
        filters: (filterStr && filterStr.split('$_').filter(Boolean)) || null,
    }
}



export const eventModifiers: any = {
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




export function normalizeAppKeyCodes() {
    let keyCodes: any = getCurrentApp().keyCodes
    let normalizedKeyCodes: any = {}
    for (let key in keyCodes) {
        let value = keyCodes[key]
        if (isString(value)) {
            let reverseValue = normalizedKeyCodes[value] ||= []
            reverseValue.push(key)
        } else if (isArray(value)) {
            value.forEach((val: any) => {
                let reverseValue = normalizedKeyCodes[val] ||= []
                reverseValue.push(key)
            })
        }
    }
    return normalizedKeyCodes
}


export function withEventModifiers(fn: any, modifiers: any) {
    if (!isFunction(fn)) {
        return null
    }

    let normalizedKeyCodes = getCurrentApp().normalizedKeyCodes

    // key 按键守卫
    let guardKeyCodes = modifiers && modifiers.reduce((res: string[], modifier: string) => {
        if (normalizedKeyCodes[modifier]) {
            res = res.concat(normalizedKeyCodes[modifier])
        }
        return res
    }, [])

    // 增加按键守卫

    let withKeyGuardFn = guardKeyCodes.length ? (event: any, ...args: any) => {
        if (guardKeyCodes.includes(event.code)) {
            fn(event, ...args)
        }
    } : fn

    let withGuardsFn: any = (event: any, ...args: any) => {
        for (let i = 0; i < modifiers.length; i++) {
            const guard = eventModifiers[modifiers[i]];
            if (guard && guard(event, modifiers)) {
                // 
                return
            }
        }
        return withKeyGuardFn(event, ...args);
    };

    // 保存原函数
    withGuardsFn._raw = fn

    return withGuardsFn
};







export const keyCodes = {
    // 普通写法
    Escape: 'escape',
    // 两个keycode使用同一个修饰符时代表，这两个键均可以触发
    Numpad0: '0',
    Digit0: '0',
    // 当一个keycode有多个修饰符时，代表多个修饰符指向kecode
    Delete: ['delete', 'del'],
    Digit1: '1',
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
    KeyS: 's',
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