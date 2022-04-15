import { capitalize } from "@crush/common"


// for renderer
const onRE = /^on[A-Z]/;
export const isEvent = (key: string) => onRE.test(key);
export const getEventName = (handlerKey: string) => {
    return handlerKey.split('on')[1].toLowerCase()
}

// for compiler
export const toHandlerKey = (event: string) => {
    return `on${capitalize(event)}`
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

export function createEvent(callback: any, modifiers: any) {
    return (event: any, ...args: any) => {
        for (let i = 0; i < modifiers.length; i++) {
            const guard = modifierGuards[modifiers[i]];
            if (guard && guard(event, modifiers))
                return;
        }
        return callback(event, ...args);
    };
}