import { isArray, isObject } from "@crush/common";


export let textModifiers: any = {
    lowerCase: (str: string) => str.toLowerCase(),
    upperCase: (str: string) => str.toUpperCase(),
}

export function defineTextModifier(name: string, handler: any) {
    textModifiers[name] = handler
}

export function display(data: any, modifier: string) {

    if (data === undefined || data === null) {
        return ''
    }

    if (isObject(data) || isArray(data)) {
        data = JSON.stringify(data)
    } else {
        data = String(data)
    }

    if (modifier && textModifiers[modifier]) {
        data = textModifiers[modifier](data)
    }

    return data
}
