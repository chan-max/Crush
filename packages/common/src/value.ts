
export const getEmptyMap = () => Object.create(null)

var uid = 0
export const getUid = () => uid++
export const getUstringId = () => String(getUid())
export const getUstr = () => `_${getUid()}`