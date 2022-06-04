
export function updateComponent(p: any, n: any, container: any, anchor: any) {
    // 暂时更新为每次都更新
    var instance = n.instance = p.instance
    instance.update()
}