import { Nodes } from "@crush/types";

export function update(current: any, next: any, container: any) {
    switch (next.nodeType) {
        case Nodes.TEXT:
            break
        case Nodes.HTML_ELEMENT:
            /*
                update props    
            */
            updateChildren(current.children, next.children, container)
            break
        case Nodes.FRAGMENT:
            updateChildren(current.children, next.children, container)
            break
    }
}

// flat all fragment , and ignore the empty node
function flatChildren(children: any[]) {
    var flattedChiildren: any = []
    children.forEach((child: any) => {
        if (child && (child.nodeType !== Nodes.NULL)) {
            if (child.nodeType === Nodes.FRAGMENT) {
                flattedChiildren = flattedChiildren.concat(flatChildren(child.children))
            } else {
                flattedChiildren.push(child)
            }
        }
    })
    return flattedChiildren
}

export function updateChildren(currentChildren: any, nextChildren: any, container: any) {
    /*
        会处理所有层级的fragment，平铺成一维结构,
        返回的结构中不带有fragment,
        暂时无组件，所以只会有元素和文本节点，
        相同的key一定会复用，key不同但类型相同则会进入假挂载和卸载
    */
    var current = flatChildren(currentChildren)
    var next = flatChildren(nextChildren)
    var max = current.length < next.length ? next : current
    debugger
    max.forEach((node: any) => {
        
    });
}