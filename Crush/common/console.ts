
function useTimeCount(fn: Function, ...args: any) {
    var s = performance.now()
    var res = fn(...args)
    var e = performance.now()
    console.info(`${fn.name} run in ${e - s} ms`)
    return res
}

const warn = (...msg: any) => console.warn(...msg)
const error = (...msg: any) => console.error(...msg)
const throwError = (...msg: any) => {
    throw new Error(...msg)
}

export {
    useTimeCount,
    warn,
    error,
    throwError
}


