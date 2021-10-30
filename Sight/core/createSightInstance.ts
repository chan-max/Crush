import { SightConstructor } from "./SightConstrctor"

import { initSightPrototype } from "./initSightPrototype"


initSightPrototype(SightConstructor)

const externalAccessHandler  = {
    get(instance:Record<string,any>,key:string,receiver:WindowProxy){
        const target = instance
        return Reflect.get(target,key,receiver)
    },
    set(instance:Record<string,any>,key:string,newValue:any,receiver:WindowProxy){
        const target = instance
        return Reflect.set(target,key,newValue,receiver)
    }
}



const createSightInstance = function(options:any) {
        return new Proxy(Reflect.construct(SightConstructor,options),externalAccessHandler)
}


export {
    createSightInstance
}















