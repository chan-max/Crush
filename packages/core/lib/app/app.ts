import { builtInComponents, builtInDirectives } from "@crush/builtin"
import { camelize, error, hyphenate, isFunction, isObject, log, warn } from "@crush/common"
import { isString } from "@crush/common"
import { ComponentType } from "../instance/component"
import { DirectiveType } from "../instance/directive"

import { PluginType } from "../instance/plugin"
import { createElement, mount, unmountComponent } from "@crush/renderer"
import { createComponent } from "@crush/renderer"
import { colors } from "@crush/reactivity"
import { installAnimation } from '@crush/animate'
import { responsiveLayoutMedia } from "@crush/css"
import { scopeProperties } from "../instance/scope"

// forward
log(`welcome to use crush.js to build your web application! github: https://github.com/chan-max/Crush`)

var currentApp: any

export function getCurrentApp(): any {
    return currentApp
}


export function createApp(rootComponent: any) {

    if (currentApp) {
        // 只能有一个应用
        warn('APP', currentApp, 'is runing and there can only be one application in your webpage')
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

        errorHandler: null,
        warnHandler: null,

        // 全局颜色
        colors,

        // config
        // @screens
        customScreens: responsiveLayoutMedia,
        // scope property
        globalProperties: scopeProperties,

        compilerOptions: null
    }

    currentApp = app
    // 安装动画
    use(installAnimation)

    function component(name: string, component: ComponentType) {
        name = camelize(name)
        if (!app.components[name]) {
            app.components[name] = component
        } else {
            warn(`component ${name} is already registered , use another name instead`)
        }
    }



    function mixin(mixin: any) {
        app.mixins.push(mixin)
    }

    function directive(name: string, directive: DirectiveType) {
        name = camelize(name)
        if (!app.directives[name]) {
            app.directives[name] = directive
        } else {
            warn(`directive ${name} is already registered , use another name instead`)
        }
    }

    function use(plugin: PluginType, ...options: any[]) {
        if (app.plugins.has(plugin)) return
        let install = isFunction(plugin) ? plugin : plugin.install
        install.call(plugin, app, ...options)
        app.plugins.add(plugin)
    }

    function mountApp(container: any = app.container) {
        if (!container) {
            // 没传入container , 默认使用
            container = document.querySelector('div[id=app]') || mount(createElement('div', { id: 'app' }), document.body, document.body.children[0])
        } else if (isString(container)) {
            let el = document.querySelector(container)
            if (!el) {
                return error(`can't find element by selector ${container}`)
            } else {
                container = el
            }
        } else if (!(container instanceof HTMLElement)) {
            return error(`container ${container} is not a legal container type`)
        }

        app.container = container
        app.inlineTemplate = container.innerHTML
        container.innerHTML = ''

        if (!app.rootComponent.template && !app.rootComponent.render) {
            app.rootComponent.template = app.inlineTemplate
        }

        app.rootComponentVnode = createComponent(rootComponent, null, null)
        mount(app.rootComponentVnode, app.container)
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

        unmountComponent(app.rootComponentVnode, app.container)
        app.isMounted = false
        currentApp = null
    }

    return app
}
9

export function getCustomScreensMedia(screen: string) {
    return getCurrentApp().customScreens[screen] || 'screen' // 默认屏幕 , 所有情况都生效
}
