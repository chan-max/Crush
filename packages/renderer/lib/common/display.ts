import { isArray, isObject } from "@crush/common";

export function customDisplay() {

}

export function display(data: any) {

    if (isObject(data) || isArray(data)) {
        return JSON.stringify(data)
    }

    return data
}
