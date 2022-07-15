import { isFunction } from "@crush/common"
import { ref } from "@crush/reactivity"
import { h } from "@crush/renderer"


export type AsyncComponentOptions = {
    loader: any
    error?: any // error component
    loading?: any // loadingComponent
}

export function defineAsyncComponent(source: AsyncComponentOptions) {
    if (!isFunction(source)) {
        source = { loader: source }
    }

    let {
        loader,
        error: errorComponent,
        loading: loadingComponent
    } = source

    let loadedComponent: any = null

    let loaded = ref(false)
    let error = ref(false)

    return {
        render() {
            if (loaded.value) {
                if (error.value) {
                    return errorComponent ? h(errorComponent) : null
                } else {
                    return h(loadedComponent)
                }
            } else {
                

                return loadingComponent ? h(loadingComponent) : '! component is loading'
            }
        }
    }
}

