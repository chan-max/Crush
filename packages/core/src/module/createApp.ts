import {
    AppModule
} from './appModule'
import {
    warn,
    error
} from '@crush/common'



export const createApp = (rootOptions: any) => new AppModule(rootOptions)