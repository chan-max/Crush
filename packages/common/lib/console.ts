

const warn = (...msg: any) => console.warn(...msg)
const error = (...msg: any) => {
    throw new Error(...msg)
}


export {
    warn,
    error
}