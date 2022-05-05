import { throwError } from "@crush/common"

import {
    getCurrentInstance
} from '../renderer/render/mountComponent'

export function getComponent(name: string) {
    return getCurrentInstance().components[name]
}

export function getDirective(name: string) {
    return getCurrentInstance().directives[name]
}