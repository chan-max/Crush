
const initSightPrototype = function initSightPrototype(SightConstructor:any) {

    SightConstructor.prototype = Object.create(null)

     SightConstructor.prototype.on  =function (container:any) {
         const st = this

         console.log('挂载成功',st,container);
         
         return this
     }

    

}

export {
    initSightPrototype
}