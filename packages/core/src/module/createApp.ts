import {
    AppModule
} from './appModule'

export const createApp = (rootOptions: any) => new AppModule(rootOptions)