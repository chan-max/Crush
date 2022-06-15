import { ComponentType } from "../instance/component";
import { App } from "./app";


export const createApp = (rootOptions: any): App => new App(rootOptions)

