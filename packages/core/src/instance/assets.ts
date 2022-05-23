import { error } from "@crush/common"
import {
    getCurrentApp
} from '../module/app'
import {
    getCurrentInstance
} from '../renderer/render/mountComponent'

export function getComponent(name: string) {
    return getCurrentInstance().components?.[name] || getCurrentApp().components[name]
}

export function getDirective(name: string) {
    return getCurrentInstance().directives?.[name] || getCurrentApp().directives[name]
}