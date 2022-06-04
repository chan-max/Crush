import {
    mount
} from './mount'

export const mountChildren = (children: any, container: any) => {
    children.forEach((node: any) => {
        mount(node, container)
    });
}