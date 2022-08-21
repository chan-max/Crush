import { getCurrentApp } from "@crush/core"
import { error, initialUpperCase } from "@crush/common"
import { getCurrentInstance } from "../render/mountComponent"


export function getComponent(name: string) {
    let currentInstance = getCurrentInstance()
    name = String(name)
    if (name === 'self') { // 内部提供的self标签，用于递归自身
        return currentInstance.options
    }
    let components = currentInstance.components
    let globalComponents = getCurrentApp().components
    // 支持组件首字母大写
    var component = components?.[name] || components?.[initialUpperCase(name)] || globalComponents?.[name] || globalComponents?.[initialUpperCase(name)]
    if (!component) {
        error(`cant find component ${name}`)
    }

    return component
}

export function getDirective(name: string) {
    let instancedirectives = getCurrentInstance().directives
    let appdirectives = getCurrentApp().directives
    // 支持组件首字母大写
    name = String(name)
    var directive = instancedirectives?.[name] || instancedirectives?.[initialUpperCase(name)] || appdirectives?.[name] || appdirectives?.[initialUpperCase(name)]
    if (!directive) {
        error(`can't find directive ${name}`)
    }
    return directive
}