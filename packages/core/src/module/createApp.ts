import {
    createAppModule
} from './appModule'
import {
    warn,
    error
} from '@crush/common'
import {
    Component
} from '../instance/component'

export const createApp = (rootComponent: Component) => {
    const appModule = createAppModule()

    if (!rootComponent) {
        error(
            `app need a root options`
        )
    }

    appModule.rootOptions = rootComponent
    
    return appModule
}