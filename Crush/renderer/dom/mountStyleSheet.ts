import {
    mountSheet
} from './mountSheet'

export const mountStyleSheet = (node: any, container: any) => {
    var {
        rules
    } = node
    var el = document.createElement('style')
    container.appendChild(el)
    if (rules) {
        mountSheet((el.sheet as any), rules)
    }
}