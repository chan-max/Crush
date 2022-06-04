import { ComponentType } from "../instance/component";
import { App, AppInstance } from "./app";


export const createApp = (rootComponent: ComponentType): AppInstance => new App(rootComponent)

