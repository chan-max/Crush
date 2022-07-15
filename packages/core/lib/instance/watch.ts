import { isString } from "@crush/common"

export function createInstanceWatch(instance: any) {
    return (source: any,) => {
        let scope = instance.scope
        if (isString(source)) {
            
        }
    }
}