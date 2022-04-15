
/*
    remove an element from array , if not exist return false , or return true
*/

export const removeFromArray = (arr: any[], item: any) => {
    var index = arr.indexOf(item)
    if (index < 0) return false
    arr.splice(index, 1)
    return true
}