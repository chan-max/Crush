import { createComponentInstance } from "../../instance/componentInstance"

export function mountComponent(component: any, container: Element, anchor: Element | null = null) {
    var { type, props, children } = component
    debugger
    const instance = createComponentInstance(type)
}