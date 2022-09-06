import { arrayToMap, emptyObject, initialUpperCase, isArray, isObject } from "@crush/common";


export function normalizePropsOptions(options: any) {
    if (isArray(options)) {
        options = arrayToMap(options, emptyObject)
    } else {
        for (let key in options) {
            if (!isObject(options[key])) {
                options[key] = {
                    type: options[key]
                }
            }
        }
    }
    return options
}

export function normalizeEmitsOptions(options: any[] | Record<string, any>) {
    if (isArray(options)) {
        return arrayToMap(options, emptyObject)
    } else {
        return options
    }
}
