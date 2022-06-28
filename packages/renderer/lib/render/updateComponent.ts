import { updateComponentProps } from "./componentProps"

export const updateComponent = (p: any, n: any, container: any, anchor: any, parent: any) => {
    // 进入update 则patchkey一定相同
    const { instance, props: pProps } = p
    n.instance = instance

    updateComponentProps(instance, pProps, n.props)
    // update slots ... 不需要更新slot

    // 把新节点存到更新方法上，有该节点代表为外部更新，而非自更新
    instance.updatingComponentVnode = n
}