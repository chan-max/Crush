import { getCurrentApp } from "@crush/core"
import { error, initialUpperCase } from "@crush/common"
import { getCurrentInstance } from "../render/mountComponent"


export function getComponent(name: string) {
    let instanceComponents = getCurrentInstance().components
    let appComponents = getCurrentApp().components
    // 支持组件首字母大写
    var component = instanceComponents?.[name] || instanceComponents?.[initialUpperCase(name)] || appComponents?.[name] || appComponents?.[initialUpperCase(name)]
    if (!component) {
        error(`cant find compnent ${name}`)
    }
    return component
}

export function getDirective(name: string) {
    let instancedirectives = getCurrentInstance().directives
    let appdirectives = getCurrentApp().directives
    // 支持组件首字母大写
    var directive = instancedirectives?.[name] || instancedirectives?.[initialUpperCase(name)] || appdirectives?.[name] || appdirectives?.[initialUpperCase(name)]
    if (!directive) {
        error(`can't find directive ${name}`)
    }
    return directive
}