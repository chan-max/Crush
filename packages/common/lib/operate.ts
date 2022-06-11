

export const removeFromArray = (arr: any[], item: any) => {
    var index = arr.indexOf(item)
    if (index < 0) return false
    arr.splice(index, 1)
    return true
}


export const shallowCloneArray = (arr: any[] | any) => arr && [...arr]

export function mark(target: any, key: any, value: any = true) {
    Object.defineProperty(target, key, {
        value,
        writable: true,
        configurable: false,
        enumerable: false
    })
}