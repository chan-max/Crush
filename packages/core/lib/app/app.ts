import { builtInComponents, builtInDirectives } from "@crush/builtin"
import { error, isFunction, warn } from "@crush/common"
import { isString } from "@crush/common"
import { ComponentType } from "../instance/component"
import { DirectiveType } from "../instance/directive"
import { MixinType } from "../instance/mixin"
import { PluginType } from "../instance/plugin"
import { mount, mountComponent, unmountComponent } from "@crush/renderer"
import { createComponent } from "@crush/renderer"

import { installAnimation } from '@crush/animate'
import { NULL } from "@crush/compiler"

var currentApp: App

export function getCurrentApp(): App {
    if (!currentApp) {
        debugger
    }
    return currentApp
}



export class App {

    isMounted = false

    inlineTemplate: any

    container: any

    rootComponent: any

    constructor(rootComponent: any) {

        this.rootComponent = rootComponent

        // 安装动画
        this.use(installAnimation)
        currentApp = this
    }

    mount(container: any) {
        this.container = isString(container) ? document.querySelector(container as any) : container
        this.inlineTemplate = container.innerHTML
        this.container.innerHTML = ''

        if (!this.rootComponent.template && !this.rootComponent.render) {
            this.rootComponent.template = this.inlineTemplate
        }

        mount(createComponent(this.rootComponent, null, null), this.container)
        this.isMounted = true
    }

    // globalProperty

    components: Record<string, ComponentType> = builtInComponents
    component(name: string, component: ComponentType) {
        if (this.directives[name]) {
            return warn('component is already exist')
        }
        this.components[name] = component
    }

    directives: Record<string, DirectiveType> = builtInDirectives
    directive(name: string, directive: DirectiveType) {
        if (this.directives[name]) {
            return warn('directive is already exist')
        }
        this.directives[name] = directive
    }

    mixins: MixinType[] = []
    mixin(mixin: MixinType) {
        this.mixins.push(mixin)
    }

    plugins: Set<PluginType> = new Set()
    use(plugin: PluginType, ...options: any[]) {
        if (this.plugins.has(plugin)) return
        let install = isFunction(plugin) ? plugin : plugin.install
        install.call(plugin, this, ...options)
        this.plugins.add(plugin)
    }





    record: any = {}
    time(key: string) {
        return this.record[key] = performance.now()
    }
    timeEnd(key: string) {
        return performance.now() - this.record[key]
    }
}