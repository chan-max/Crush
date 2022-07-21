import { defineScopeProperty } from "@crush/core"
import { onHashChange } from "./native"
import { parseUrl } from "./url"



let currentRoute: any = null
let currentRouter: any = null

export function getCurrentRouter() {
    return currentRouter
}


export function createRouter(routerOptions: any) {

    let router = {
        install
    }

    function install(app: any, crush: any) {
        currentRouter = router
        app.router = router
        // $router


        defineScopeProperty('$router', () => router)
        defineScopeProperty('$route', () => 'route')

        if (!app.rootComponent) {
            // 如果在 createApp中  没传入根组件， 会把当前路由对应的组件作为根组件
            app.rootComponent = ''
        }

        onHashChange((newURL: string, oldURL: string) => {
            let newHash = getFullPathHash(newURL)
            let url = parseUrl(newHash)
            debugger
        })

    }

    return router
}

function getFullPathHash(fullPath: string) {
    let hashPosition = fullPath.indexOf('#')
    return hashPosition > -1 ? fullPath.slice(hashPosition) : ''
}

