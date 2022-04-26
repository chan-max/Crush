
export const insertNull = (arr: any[], index: number, length: number = 1) => arr.splice(index, 0, ...new Array(length).fill(null)) 
