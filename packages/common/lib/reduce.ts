
const hasOwnProperty = Object.prototype.hasOwnProperty

// target may be null undefined
export const hasOwn = (target: any, key: any) => target && hasOwnProperty.call(target, key)
