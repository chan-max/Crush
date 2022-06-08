
import { arrayToMap, emptyObject, isArray } from "@crush/common";

/*
    当传入不合理的props时
*/

export function normalizePropsOptions(options: any[] | Record<string, any>) {
    if (isArray(options)) {
        return arrayToMap(options, emptyObject)
    } else {
        return options
    }
}

