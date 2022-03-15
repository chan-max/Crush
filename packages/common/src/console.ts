

const warn = (...msg: any) => console.warn(...msg)
const error = (...msg: any) => console.error(...msg)
const throwError = (...msg: any) => {
    throw new Error(...msg)
}

export {
    warn,
    error,
    throwError
}