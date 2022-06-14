import { ComponentType } from "../instance/component";
import { App } from "./app";


export const createApp = (rootOptions: ComponentType): App => new App(rootOptions)

