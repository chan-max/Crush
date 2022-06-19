import { updateComponentProps } from "./componentProps"

export const updateComponent = (p: any, n: any, container: any, anchor: any, parent: any) => {
    // 进入update 则patchkey一定相同
    var instance = n.instance = p.instance
    updateComponentProps(instance, p.props, n.props)
    // update props ...
    //instance.update(n) auto update
}