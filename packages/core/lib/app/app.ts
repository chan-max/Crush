import { builtInComponents, builtInDirectives } from "@crush/builtin"
import { camelize, hyphenate, isFunction, isObject, } from "@crush/common"
import { isString } from "@crush/common"
import { ComponentType } from "../instance/component"
import { DirectiveType } from "../instance/directive"

import { PluginType } from "../instance/plugin"
import { createElement, mount, normalizeAppKeyCodes, unmountComponent } from "@crush/renderer"
import { createComponent } from "@crush/renderer"
import { colors } from "@crush/reactivity"
import { installAnimation } from '@crush/animate'
import { createAppOnScreenChange, customScreens } from "../instance/reponsive"
import { scopeProperties } from "../instance/scope"
import { keyCodes } from '@crush/renderer'
import { textModifiers } from "@crush/renderer"
import { eventModifiers } from '@crush/renderer'
import { replaceAllReservedCharacters } from "@crush/compiler"
import { injectGlobalErrorCapture, throwError, warn, error } from "./error"


// forward
console.log(`welcome to use crush.js to build your web application! github: https://github.com/chan-max/Crush`)

var currentApp: any

export function getCurrentApp(): any {
    return currentApp
}


export function createApp(rootComponent?: any) {

    if (currentApp) {
        // 只能有一个应用
        warn(`app is running and there only can exist one app`)
    }

    const app: any = {
        isMounted: false, // 应用是否挂载
        isReadyToMount: false, // 应用是否准备挂载 , 此处所有配置应该完成，即将进入挂载阶段
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
        beforeAppMount: null,
        onError: null,
        onWarn: null,

        // 全局颜色 $colors
        colors,

        // 按键修饰符
        keyCodes,
        _normalizedKeyCodes: null,
        get normalizedKeyCodes() {
            if (!this.isReadyToMount) {
                return
            }
            return this._normalizedKeyCodes ||= normalizeAppKeyCodes()
        },

        // 事件修饰符
        eventModifiers,
        // config
        // @screens
        customScreens: customScreens,
        // scope property
        globalProperties: scopeProperties,

        compilerOptions: null,

        // 文本修饰符
        textModifiers,

        // 侦听屏幕尺寸侦听函数
        _appOnScreenChange: null,
        get onScreenChange() {
            if (!this.isReadyToMount) {
                // 准备挂载时才能拿到所有的配置信息
                return null
            }
            return this._appOnScreenChange ||= createAppOnScreenChange()
        }
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

        // 需要在css中设置display:none
        if (container.hasAttribute('cr-cloak')) {
            container.style.display = "block"
        }

        if (!app.rootComponent.template && !app.rootComponent.render) {
            // 替换模板中的所有转义字符
            app.rootComponent.template = replaceAllReservedCharacters(app.inlineTemplate)
        }

        // 执行应用挂载前钩子，可以拿到用户定义的配置信息
        app.beforeAppMount && app.beforeAppMount(app)

        app.isReadyToMount = true

        app.rootComponentVnode = createComponent(app.rootComponent, null, null)
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





