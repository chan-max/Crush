import { DirectiveType } from "./directive"

export type ComponentType =  {
    rootCreate?:any
    // hooks
    create?: Function | Function[]  // setup 
    created?: Function | Function[]
    beforeMount?: Function | Function[]
    mounted?: Function | Function[]
    beforeUpdate?: Function | Function[]
    updated?: Function | Function[]
    beforeUnmount?: Function | Function[]
    unmounted?: Function | Function[]

    template?: string
    render?: Function
    createRender?: Function
    mixins?: any
    props?: any
    propsOptions?: any
    emits?: any
    emitsOptions?: any

    customOptions?:any

    components?: Record<string, ComponentType>
    directives?: Record<string, DirectiveType>
    _isOptions?: boolean
}

