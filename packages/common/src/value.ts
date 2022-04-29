
export const getEmptyMap = () => Object.create(null)

var id = 0
export const uid = () => id++
export const ustringid = () => String(uid())
export const uvar = () => `_${uid()}`

export const EMPTY_MAP = Object.freeze({})
export const EMPTY_LIST = Object.freeze([])