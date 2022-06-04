

const warn = (...msg: any) => console.warn(...msg)
const error = (msg: any) => {
    throw `${msg}`
}

export const throwError = () => '666'

export {
    warn,
    error
}