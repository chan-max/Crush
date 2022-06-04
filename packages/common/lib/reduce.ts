const hasOwnProperty = Object.prototype.hasOwnProperty
export const hasOwn = (target: Record<any, any>, key: any) => hasOwnProperty.call(target, key)
