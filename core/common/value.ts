

export function getEmptyObj() {
    return Object.create(null)
}

var id = 0
export const uid = () => id++


export const EMPTY_OBJ = Object.freeze({})
export const EMPTY_ARR = Object.freeze([])