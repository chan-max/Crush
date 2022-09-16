
export const warn = console.warn

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
