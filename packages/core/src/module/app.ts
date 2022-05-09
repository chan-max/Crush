
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

let currentApp: any = null
export function getCurrentApp() {
    return currentApp
}




export class App {

    el: Element | null = null

    isMounted = false

    components = null

    directives = null

    options: any = null

    instance: any

    mixins = null

    constructor(options: any) {
        this.options = options
        currentApp = this
    }

    component(name: string, options: any) {
        (this.components ||= getEmptyMap())[name] = options
    }

    directive(name: string, options: any) {
        (this.directives ||= getEmptyMap())[name] = options
    }

    mount(container: string | Element) {
        var el
        if (isString(container)) {
            el = document.querySelector(container as string)
        }

        if (!el) {
            error(` not a legal container `)
            return
        }

        var options = this.options

        if (!options.template) {
            options.template = el.innerHTML
        }

        el.innerHTML = ''
        var vnode: any = createComponent(options, {}, {})
        vnode.app = this
        var instance = mountComponent(vnode, el)
        this.instance = instance
        this.el = el
        this.isMounted = true
        return instance
    }

}



