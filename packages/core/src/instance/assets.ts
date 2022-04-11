import { throwError } from "@crush/common"
import {
    currentInstance
} from '../renderer/render/mountComponent'

export const getComponent = (name: string) => currentInstance.components[name]

export const getDirective = (name: string) => currentInstance.directives[name]