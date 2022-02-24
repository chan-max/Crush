import {
    mountChildren
} from './mountChildren'

export const mountElement = (node: any, container: HTMLElement) => {
    const {
        type,
        props,
        children
    } = node
    var el: HTMLElement = document.createElement(type)
    var events = props?.events
    if (events) {
        Object.entries(events).forEach(([event, { handler, options }]: any) => {
            el.addEventListener(event, handler, options)
        })
    }

    container.appendChild(el)
    if (children) {
        mountChildren(children, el)
    }
}
