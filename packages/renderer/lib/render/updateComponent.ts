import { updateComponentProps } from "./componentProps"

export const updateComponent = (p: any, n: any, container: any, anchor: any, parent: any) => {

    n.instance = p.instance

    updateComponentProps(n.instance, p.props, n.props)

    // 把新节点存到更新方法上，有该节点代表为外部更新，而非自更新
    n.instance.updatingComponentVnode = n
}