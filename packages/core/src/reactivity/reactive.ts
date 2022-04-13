

var handlers = {
    get(target:any,key:any,receiver:any){
        
        console.warn('get')
        return target[key]
    },
    set(target:any,key:any,value:any,receiver:any){
        console.warn('set')
        return target[key] = value
    }
}

export const reactive = (target: any) => {
    return new Proxy(target, handlers)
}