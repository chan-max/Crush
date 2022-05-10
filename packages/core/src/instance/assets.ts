import { throwError } from "@crush/common"
import {
    getCurrentApp
} from '../module/app'
import {
    getCurrentInstance
} from '../renderer/render/mountComponent'

export function getComponent(name: string) {
    return (getCurrentInstance() || getCurrentApp())?.components[name]
}

export function getDirective(name: string) {
    return (getCurrentInstance() || getCurrentApp())?.directives?.[name]
}