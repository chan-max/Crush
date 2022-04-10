import { throwError } from "@crush/common"

export const getComponent = (name: string, instance: any) => {
    const component = instance.components[name]
    if (!component) {
        throwError(`cant find component ${name}`)
    } else {
        return component
    }
}

export const getDirective = (name: string, instance: any) => {
    const directive = instance.directives[name]
    if (!directive) {
        throwError(`cant find directive ${name}`)
    } else {
        return directive
    }
}