import {createSightInstance} from './createSightInstance'

let id = 0
function SightConstructor(this:any,options:any){
    let st = this

    st._options = options

    st._parent = null

    st._children = []

    st._sid = id++

    
}


export {SightConstructor}