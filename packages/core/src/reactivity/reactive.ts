

var handlers = {
    get(target:any,key:any,receiver:any){
        
        console.warn('get')
        return target[key]
    },
    set(target:any,key:any,value:any,receiver:any){
        console.warn('set')
        target[key] = value

        return true
    }
}

export const reactive = (target: any) => {
    return new Proxy(target, handlers)
}