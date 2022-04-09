import {
    createAppModule
} from './appModule'
import {
    warn,
    error
} from '@crush/common'



export const createApp = (rootComponent: any) => {
    const appModule = createAppModule()
    if (!rootComponent) {
        error(
            `app need a root options`
        )
    }
    appModule.rootOptions = rootComponent
    return appModule
}