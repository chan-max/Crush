import { createPureObject } from "@crush/common";
import { getCurrentInstance } from "@crush/renderer";

export function provide(key: any, value: any) {
    let provides = getCurrentInstance().provides ||= createPureObject()
    provides[key] = value
}


export function inject(key: any) {
    let currentInstace = getCurrentInstance()
    let result = null
    let parent = currentInstace.parent
    // inject 不会从自身获取
    while (parent && !result) {
        let provides = parent.provides
        if (provides && (provides[key] !== undefined)) {
            result = provides[key]
        }
        parent = parent.parent
    }
    return result
}

