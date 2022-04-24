
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

class AppModule {

    el: Element | null = null

    isMounted = false

    components = getEmptyMap()

    directives = getEmptyMap()

    rootOptions: any = null

    rootInstance: any

    constructor(rootOptions: any) {
        this.rootOptions = rootOptions
    }

    component(name: string, options: any) {
        if (this.components[name]) {
            warn(`
                component has already registered
            `)
            return
        } else if (isBuiltInTag(name)) {
            error(`
                failed to register component ,
                because it is a builtIn tagName
            `)
        } else {
            this.components[name] = options
        }
    }

    directive(name: string, options: any) {
        if (this.directives[name]) {
            warn(`
                directive has already registered
            `)
            return
        } else if (isBuiltInDirective(name)) {
            error(`
                failed to register directive ,
                because it is a builtIn directive
            `)
        } else {
            this.directives[name] = options
        }
    }

    mount(container: string | Element) {
        var el
        if (isString(container)) {
            el = document.querySelector(container as string)
        }

        if (!el) {
            error(
                ` not a legal container `
            )
            return
        }

        var instance = mountComponent(createComponent(this.rootOptions, {}, {}), el)
        this.rootInstance = instance
        this.el = el
        this.isMounted = true
        return instance
    }

    unmount() {
        
    }
}


export {
    AppModule
}
