import { defineScopeProperty, ref } from "@crush/core"
import { onHashChange } from "./native"
import { parseURL } from "./url"


let currentRouter: any = null

const LOCATION = window.location
const HISTORY = window.history


export function getCurrentRouter() {
    return currentRouter
}


// global reactive url
export const currentURL = ref('666')


function getFullPathHash(fullPath: string) {
    let hashPosition = fullPath.indexOf('#')
    return hashPosition > -1 ? fullPath.slice(hashPosition) : ''
}


export function createRouter(options: any) {

    const router = {
        install
    }

    function install(app: any, crush: any) {
        currentRouter = router
        defineScopeProperty('$router', () => router)
        defineScopeProperty('$route', () => 'route')
        if (!app.rootComponent) {
            // 如果在 createApp中  没传入根组件， 会把当前路由对应的组件作为根组件
            app.rootComponent = ''
        }
    }


    function go() {
        
    }

    return {
        install
    }
}
