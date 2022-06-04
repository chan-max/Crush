import { warn } from "../../common/console"


import { mountComponent } from "../../renderer/dom/mountComponent"

const createApp = (appOptions: any) => {
    var app: any = {}
    app.container = document.querySelector(appOptions.container)
    app.mount = (rootComponent: any) => {
        return mountComponent(rootComponent, app.container)
    }
    return app
}

export {
    createApp
}