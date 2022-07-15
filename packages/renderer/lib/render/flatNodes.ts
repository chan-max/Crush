import { isArray, isNumber, isString } from "@crush/common"
import { Nodes } from "@crush/const"
import { createComment, createText } from "@crush/core"
import {
    flatRules
} from '../common/flatRules'

/*
    处理结果返回始终是数组
*/

function processStringRender(source: string | number, key: any) {
    source = String(source)
    return source.startsWith('! ') ? createComment(source.slice(2), key) : createText(source, key)
}



export function flatNodes(node: any, parentKey?: any): null | any[] {

    if (!isArray(node)) {
        node = [node]
    }

    var flattedNode: any = []

    node.forEach((child: any) => {

        if (!child) return // 空节点筛除  

        if (isString(child) || isNumber(child)) {
            child = processStringRender(child, parentKey)
        }

        if (child.nodeType === Nodes.FRAGMENT) {
            /* 这里给后续传入fragment的key，为了使后续的每个节点都能有唯一的key ,
                当使用 for循环时，只能传入一个key，但会在循环时为每个结果生成唯一的key
            */
            flattedNode = flattedNode.concat(flatNodes(child.children, child.key))
        } else {
            if (parentKey) {
                child.patchKey = parentKey + '_' + child.key
            } else {
                child.patchKey = child.key
            }

            if (child.nodeType === Nodes.HTML_ELEMENT || child.nodeType === Nodes.SVG_ELEMENT) {
                // 子节点递归处理
                child.children = flatNodes(child.children)
            }


            if (child.nodeType === Nodes.STYLE) {
                child.children = flatRules(child.children, null, child.patchKey)
            }

            flattedNode.push(child)
        }
    })
    return flattedNode
}