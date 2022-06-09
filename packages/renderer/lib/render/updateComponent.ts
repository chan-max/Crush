
export const updateComponent = (p: any, n: any, container: any, anchor: any) => {
    // 进入update 则patchkey一定相同
    var instance = n.instance = p.instance
    // update props ...
    instance.update(n)
}