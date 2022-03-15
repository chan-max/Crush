
export const arrToMap = (arr: string[],value:any = true) => arr.reduce((res, item) => {
    res[item] = value
    return res
}, {} as Record<string, any>)