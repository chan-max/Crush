
export const makeMap = (str:string) => {
    var map:Record<string,boolean> = {}
    str.split(',').forEach((item:string) => map[item] = true)
    return (key:string) => !!map[key] 
}