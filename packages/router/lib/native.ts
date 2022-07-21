import { addListener, removeListener } from "@crush/core";


// 回调中可以拿到新路径和旧路径
export function onHashChange(callback: any) {
    let hashChangeHandler = (hashChangeEvent: any) => callback(hashChangeEvent.newURL, hashChangeEvent.oldURL)
    addListener(window, 'hashchange', hashChangeHandler)

    // remove handler
    return () => removeListener(window, 'hashchange', hashChangeHandler)
}