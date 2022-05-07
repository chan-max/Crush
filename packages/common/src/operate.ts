
/*
    remove an element from array , if not exist return false , or return true
*/

export const removeFromArray = (arr: any[], item: any) => {
    var index = arr.indexOf(item)
    if (index < 0) return false
    arr.splice(index, 1)
    return true
}


/*
    mark 
*/

export function mark(target: any, key: string, value = true) {
    return Object.defineProperty(target, key, {
        configurable: false,
        enumerable: false,
        writable: false,
        value
    })
}

export const extend = Object.assign