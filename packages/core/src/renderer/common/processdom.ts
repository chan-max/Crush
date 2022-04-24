import { isArray } from "@crush/common"
import { Nodes } from "@crush/types"
import {
    flatRules
} from './flatRules'

/*
    处理结果返回始终是数组
*/
export function processdom(node: any[], k: any = null) {

    if (!node) {
        return null
    }

    if (!isArray(node)) {
        node = [node]
    }

    var flattednode: any = []

    node.forEach((child: any) => {
        if (child) {
            if (child.nodeType === Nodes.FRAGMENT) {
                /* 这里给后续传入fragment的key，为了使后续的每个节点都能有唯一的key */
                flattednode = flattednode.concat(processdom(child.children, child.key))
            } else {
                if (k) {
                    child.patchKey = k + '_' + child.key
                } else {
                    child.patchKey = child.key
                }

                if (child.nodeType === Nodes.HTML_ELEMENT) {
                    // 子节点递归处理
                    child.children = processdom(child.children)
                }

                if (child.nodeType === Nodes.STYLE) {
                    child.children = flatRules(child.children)
                }
                
                flattednode.push(child)
            }
        }
    })
    return flattednode
}         