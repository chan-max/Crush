import { warn } from '@crush/common'
import { watch } from '../reactivity/reactive'
import {
    getCurrentScope
} from '../renderer/render/mountComponent'

const stateIniterHandler = {
    get(initializer: any, key: string) {

        switch (initializer.index) {
            case 0:
                /* define state */
                var scope = getCurrentScope()
                scope[key] = initializer.value
                initializer.stateName = key
                initializer.index++
                return initializer.value
            case 1:
                /* update state */
                var scope = getCurrentScope()
                var updateFn = (newValue: any) => {
                    scope[initializer.stateName] = newValue
                }
                scope[key] = updateFn
                initializer.index++
                return updateFn
            case 2:
                var scope = getCurrentScope()
                function onChange(callback: any) {
                    watch(() => {
                        scope[initializer.stateName]
                    }, callback)
                }
                initializer.index++
                return onChange
            default:
                warn('stop !!!')
        }
    }
}

export function useState(value: any) {
    return new Proxy({
        value,
        index: 0
    }, stateIniterHandler)
}