import { mountComponent } from "./mountComponent"
import { unmountComponent } from "./unmountComponent"

export const updateComponent = (p: any, n: any, container: any, anchor: any) => {
    // key 不同应该卸载
    if (p.patchKey === n.patchKey) {
        var instance = n.instance = p.instance
        // update props ...
        instance.update(n)
    } else {
        unmountComponent(p, container, anchor)
        mountComponent(n, container, anchor)
    }
}