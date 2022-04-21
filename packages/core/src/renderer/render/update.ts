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

/*
    根据一组子节点的key生成一个映射表
*/
function getChildrenKeyMap(children: any) {
    return children.reduce((res: any, node: any, index: any) => {
        res[node.key] = {
            index,
            node
        }
        return res
    }, {})
}

export function updateChildren(currentChildren: any, nextChildren: any, container: any) {
    /*
        相同key的节点类型不一定相同，
        只有类型和key都相同的节点车才会作为同一节点复用，
        不同类型的节点一定会卸载，
        当节点类型相同但key不同并且需要复用时，会进入假挂载和卸载阶段，只是为了相关钩子的调用，并不会真卸载当前元素
    */
    var current = flatChildren(currentChildren)
    var next = flatChildren(nextChildren)
    /*
        map is key to node , so we also keep the key to type
    */
    var currentMap = getChildrenKeyMap(current)
    var nextMap = getChildrenKeyMap(next)

    var max = current.length < next.length ? next : current
    debugger
    max.forEach((node: any) => {
        
    });
}