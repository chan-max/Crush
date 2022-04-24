import { removeFromArray } from "@crush/common";
import { Nodes } from "@crush/types";
import { patch } from "./patch";
import { updateStyleSheet } from "./updateStyleSheet";

export function update(p: any, n: any, container: any, anchor: any) {
    switch (n.nodeType) {
        case Nodes.TEXT:
            var el = n.el = p.el
            if (p.children !== n.children) {
                el.textContent = n.children
            }
            break
        case Nodes.HTML_ELEMENT:
            /*
                update props    
            */
            n.el = p.el
            updateChildren(p.children, n.children, container, anchor)
            break
        case Nodes.FRAGMENT:
            updateChildren(p.children, n.children, container, anchor)
            break
        case Nodes.STYLE:
            updateStyleSheet(p, n)
            break
    }
}



function createKeyMapAndList(children: any) {
    var map: any = {}
    var list = children.map((node: any) => {
        var {
            patchKey, type
        } = node
        var status = {
            patchKey,
            type,
            node
        }
        map[patchKey] = status
        return status
    })
    return {
        map, list
    }
}


export function updateChildren(pChildren: any, nChildren: any, container: any, anchor: any) {

    /*
        相同key的节点类型不一定相同，
        只有类型和key都相同的节点车才会作为同一节点复用，
        不同类型的节点一定会卸载，
        当节点类型相同但key不同并且需要复用时，会进入假挂载和卸载阶段，只是为了相关钩子的调用，并不会真卸载当前元素，
        ! 所有节点一定有唯一key
    */

    /* 此时应该优化，考虑是否要把fragment平铺好 */
    var p = pChildren
    var n = nChildren



    // 使用patchkey，不使用key

    var pLength = p.length
    var nLength = n.length
    var maxJobs = pLength + nLength
    var { map: pMap, list: pList } = createKeyMapAndList(p)
    var { map: nMap, list: nList } = createKeyMapAndList(n)
    var max = pLength < nLength ? n : p
    var min = pLength > nLength ? n : p
    var maxLength = max.length
    var maxMap = max === p ? pMap : nMap
    var minMap = max === n ? pMap : nMap
    var maxList = max === p ? pList : nList
    var minList = max === n ? pList : nList
    /*
        新的diff策略，
        首先假设key相同的节点顺序是一定不会变的，
        然后使用一种填充策略，
        将短的一组经过填充，得到两个相同的序列，
        然后在逐一对比，
        因为key和类型均相同的节点是一定不会乱序的，
        所以直接填充即可，直接填充空节点即可
    */

    var newList: any = []

    /*
        目标是将短列表的所有节点塞入到新建的模拟列表中,并且将对应的位置填充上，
        此时遍历只能处理key和type均相同的节点并复用，对于key不同但能复用节点，还不能处理
    */

    maxList.forEach((n: any, index: number) => {
        var { patchKey, type } = n
        if (minMap[patchKey] && minMap[patchKey].type === type) {
            // 存在相同key的节点
            newList[index] = minMap[patchKey].node
        }
    })

    // 最终结果用max和newList逐一patch      
    var current = max === n ? newList : max
    var next = max === n ? max : newList
    for (let i = 0; i < maxLength; i++) {
        var anchor = current[i + 1] ? current[i + 1].el : null;
        patch(current[i], next[i], container, anchor)
    }
}

/*

*/


