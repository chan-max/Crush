
import {
    isBuiltInTag,
    isBuiltInDirective
} from '@crush/types'

import {
    isString
} from '@crush/common'

import {
    warn,
    error,
    throwError,
    getEmptyMap
} from '@crush/common'

import {
    createComponent
} from '../renderer/vnode/vnode'

import {
    mountComponent
} from '../renderer/render/mountComponent'

export let currentApp: any = null
export function getCurrentApp() {
    return currentApp
}

export class App {

    isMounted = false

    options: any = null

    constructor(options: any) {
        this.options = options
        currentApp = this
    }

    components = getEmptyMap()

    component(name: string, options: any) {
        this.components=[name] = options
    }

    directives = getEmptyMap()

    directive(name: string, options: any) {
        this.directives[name] = options
    }

    mixins: any[] = []

    mixin(mixin: any) {
        this.mixins.push(mixin)
    }

    instance: any
    el: Element | null = null
    container: null | Element = null

    mount(container: string | Element) {
        if (this.isMounted) return
        const _container: Element = isString(container) ? document.querySelector(container as any) : container

        this.container = _container

        var options = this.options

        if (!options.template) {
            options.template = _container.innerHTML
        }

        _container.innerHTML = ''
        var vnode: any = createComponent(options, null, null)
        vnode.app = this
        var instance = mountComponent(vnode, _container)
        this.instance = instance
        this.isMounted = true
        return instance
    }

    unmount() {

    }
}



