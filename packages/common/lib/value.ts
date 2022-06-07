

export function getEmptyObject() {
    return Object.create(null)
}

var id = 0
export const uid = () => id++
export const uStringId = () => String(uid())
export const uVar = () => `_${uid()}`

export const emptyObject = Object.freeze({})
export const emptyArray = Object.freeze([])