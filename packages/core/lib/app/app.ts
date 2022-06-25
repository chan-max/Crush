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

var currentApp: App

export function getCurrentApp(): App {
    if (!currentApp) {
        debugger
    }
    return currentApp
}

function normalizeContainer(container: any): Element {
    if (isString(container)) {
        container = document.querySelector(container)
    }
    if (!(container instanceof Element)) {
        error('not legal container')
    }
    return container
}

export class App {

    isMounted = false

    rootOptions: ComponentType

    constructor(rootOptions: ComponentType) {
        this.rootOptions = rootOptions
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
        (isFunction(plugin) ? plugin : plugin.install)(this, ...options)
    }

    container: Element | null = null
    rootInstance: any
    useSelectorTemplate: boolean = false
    rootComponent: any
    mount(container: string | Element) {
        container = normalizeContainer(container)
        // todo validate legal container 
        this.container = container as Element
        var options = this.rootOptions
        if (!options.template && !options.render) {
            options.template = container.innerHTML
            this.useSelectorTemplate = true
        }
        // clear page template
        container.innerHTML = ''
        // mount root component
        var component = createComponent(options, null, null)
        this.rootComponent = component
        var instance = mount(component, container, null, null)
        // instance.root = instance
        this.rootInstance = instance
        this.isMounted = true
        return instance
    }

    unmount() {
        unmountComponent(this.rootComponent, this.container)
    }
}