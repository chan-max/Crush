

let id = 0
function SightConstructor(this:any,options:any){
    let st = this

    st._sid = id++

    st._options = options

    st._parent = null

    st._children = []

    st.isInited = false

    st.isMounted = false

    st.render = options.render

    st["[[SCOPE]]"] = Object.create(null)

}


export {SightConstructor}