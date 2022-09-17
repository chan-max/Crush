import { getCurrentApp } from "./app"

export const warn = (...msg: any) => {
    console.warn(...msg)
    let app = getCurrentApp()
    if (app.onWarn) {
        app.onWarn()
    }
}

export const error = console.error

export function injectGlobalErrorCapture(fn: Function) {
    return (...args: any) => {
        try {
            return fn(...args)
        } catch (e) {
            debugger
        }
    }
}



export function throwError(err: any) {
    throw new Error()
}
