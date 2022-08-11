import { builtInComponents, builtInDirectives } from "@crush/builtin"
import { error, isFunction, isObject, warn } from "@crush/common"
import { isString } from "@crush/common"
import { ComponentType } from "../instance/component"
import { DirectiveType } from "../instance/directive"
import { MixinType } from "../instance/mixin"
import { PluginType } from "../instance/plugin"
import { mount, unmountComponent } from "@crush/renderer"
import { createComponent } from "@crush/renderer"

import { installAnimation } from '@crush/animate'
import { responsiveLayoutMedia } from "@crush/css"
import { scopeProperties } from "../instance/scope"


var currentApp: any

export function getCurrentApp(): any {
    return currentApp
}


export function createApp(rootComponent: any) {

    if (currentApp) {
        // 只能有一个应用
        return
    }

    const app: any = {
        isMounted: false,
        rootComponent,
        component,
        directive,
        components: builtInComponents,
        directives: builtInDirectives,
        plugins: new Set(),
        mixin,
        mixins: [],
        use,
        mount: mountApp,
        unmount: unmountApp,

        // config
        // @screens
        customScreens: responsiveLayoutMedia,
        scopeProperties: scopeProperties
    }

    currentApp = app
    // 安装动画
    use(installAnimation)

    function component(name: string, component: ComponentType) {
        if (!app.components[name]) {
            app.components[name] = component
        }
    }


    function mixin(mixin: any) {
        app.mixins.push(mixin)
    }

    function directive(name: string, directive: DirectiveType) {
        if (!app.directives[name]) {
            app.directives[name] = directive
        }
    }

    function use(plugin: PluginType, ...options: any[]) {
        if (app.plugins.has(plugin)) return
        let install = isFunction(plugin) ? plugin : plugin.install
        install.call(plugin, app, ...options)
        app.plugins.add(plugin)
    }

    function mountApp(container: any) {
        container = isString(container) ? document.querySelector(container as any) : container
        app.container = container
        app.inlineTemplate = container.innerHTML
        container.innerHTML = ''

        if (!rootComponent.template && !rootComponent.render) {
            rootComponent.template = app.inlineTemplate
        }

        app.rootVnode = createComponent(rootComponent, null, null)
        mount(app.rootVnode, app.container)
        app.isMounted = true
    }


    function unmountApp() {

        // 卸载已安装的插件
        app.plugins.forEach((plugin: any) => {
            let uninstall = isObject(plugin) && plugin.uninstall
            if (uninstall) {
                uninstall(app)
            }
        });

        unmountComponent(app.rootVnode, app.container)
        app.isMounted = false
        currentApp = null
    }

    return app
}


export function getCustomScreensMedia(screen: string) {
    return getCurrentApp().customScreens[screen] || 'screen' // 默认屏幕 , 所有情况都生效
}
