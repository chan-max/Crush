import {
    Component
} from '../instance/component'
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
    mountComponent
} from '@crush/renderer'

class AppModule {

    el: Element | null = null

    isMounted = false

    components = getEmptyMap()

    directives = getEmptyMap()

    rootOptions: Component | null = null

    rootInstance: any

    component(name: string, options: Component) {
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

        var instance = mountComponent(el, this.rootOptions as Component)
        this.rootInstance = instance
        this.el = el
        return instance
    }

    unmount() {

    }
}

export const createAppModule = () => new AppModule()

