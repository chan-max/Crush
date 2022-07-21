import { getCurrentRouter } from "./router"


export function RouterView(props: any, slots: any, vnode: any, pVnode: any) {
    const router = getCurrentRouter()
    debugger
    return '路由视图'
}

export function RouterLink({
    to,
    replace,
    activeClass
}: any) {

}


