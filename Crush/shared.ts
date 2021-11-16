// utils 


// check a value is a primitive type or not  

function isPrimitiveType(val:any):boolean{
    return typeof val ! == 'object'
}

// get the value type 


function typeOf(val:any):string{
    return Reflect.apply(Object.prototype.toString,val,[]).slice(8,-1).toLowerCase()
}

export {
    isPrimitiveType,
    typeOf
}


