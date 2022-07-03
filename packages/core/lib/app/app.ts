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


export interface AppOptions {
    container: string | HTMLElement
}

export class App {

    isMounted = false

    inlineTemplate: string

    container: Element

    constructor(appOptions: AppOptions) {
        let {
            container
        } = appOptions

        this.container = isString(container) ? document.querySelector(container as any) : container
        this.inlineTemplate = this.container.innerHTML
        this.container.innerHTML = ''

        // 安装动画
        this.use(installAnimation)
        currentApp = this
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
    }

    render(component: any) {
        if (!component.template && !component.render) {
            component.template = this.inlineTemplate
        }
        mount(createComponent(component, null, null), this.container)
        this.isMounted = true
    }
}