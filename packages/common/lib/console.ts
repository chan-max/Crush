

const warn = (...msg: any) => console.warn(...msg)
const error = (msg: any) => {
    throw `${msg}`
}


export {
    warn,
    error
}