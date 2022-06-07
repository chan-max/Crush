import { DirectiveType } from "./directive"

export type ComponentType = {
    // hooks
    beforeCreate?: Function | Function[]  // mainly for plugins
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

    components?: Record<string, ComponentType>
    directives?: Record<string, DirectiveType>
    _isOptions?: boolean
}

