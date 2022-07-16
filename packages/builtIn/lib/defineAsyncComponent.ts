import { isFunction } from "@crush/common"
import { ref } from "@crush/reactivity"
import { h } from "@crush/renderer"


export type AsyncComponentOptions = {
    loader: any
    error?: any // error component
    loading?: any // loadingComponent，
    onError?: any // 失败回调
}

export function defineAsyncComponent(source: AsyncComponentOptions) {
    if (isFunction(source)) {
        source = { loader: source }
    }

    let {
        loader,
        error: errorComponent,
        loading: loadingComponent,
        onError
    } = source

    let loadedComponent: any = null

    let loaded = ref(false)
    let error = ref(false)

    return {
        render() {
            if (loaded.value) {
                if (error.value) {
                    return errorComponent ? h(errorComponent) : '! component load failed'
                } else {
                    return h(loadedComponent)
                }
            } else {
                loader().then((result: any) => {
                    loadedComponent = result[Symbol.toStringTag] === 'Module' ? result.default : result
                }).catch((err: any) => {
                    error.value = true; onError && onError(err)
                }).finally(() => {
                    loaded.value = true
                })

                // 未加载完成时 渲染加载中组件 或默认渲染一个 注释节点
                return loadingComponent ? h(loadingComponent) : '! component is loading'
            }
        },
    }
}

