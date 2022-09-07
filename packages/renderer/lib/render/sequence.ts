
/*
    diff the dom children and rules children

    the dom vnodes will be reused with the same _key and the same type , 
    so , we can make the reused vnodes stay in the same index , this is the first step
    and then , the unsame keyed vnodes , we can reuse them if they have the same type , its the second step,
    apon the process , we get the same length children , 
    and the same type and same key vnodes are in the same index , the same type , not same key nodes also in the same index , 
    so the only things we need todo is loop the chidren each the patch operate,

    but the rules is something different , 
    the same nodeType and same key we can reuse ,
    others can be rsused while they have the same nodeType

    ! something interesting  , the key order will not change
*/

import {
    insertNull
} from './common'

function createMapAndList(children: any[]) {
    var map: any = {}
    var list = children.map((child: any, index: number) => {
        var _key = child._key
        var token = {
            node: child,
            _key,
            index
        }
        map[_key] = token
        return token
    })
    return {
        map, list
    }
}

export function sortChildren(p: any, n: any) {

    // copy
    p = [...p || []]
    n = [...n || []]

    var nLength = n.length
    var { map: pMap } = createMapAndList(p)

    var pMoved = 0

    for (let i = 0; i < nLength; i++) {
        /*
            此次循环用于将两组规则的相同key对应到相同的索引下
        */

        var node = n[i]
        var _key = node._key
        var sameNode = pMap[_key]
        if (sameNode && sameNode.node.type === node.type) {
            /*
                the condition of reuse a vnode for dom is same _key and same type
                for rules is just the same _key
            */
            var sameNodeIndex = sameNode.index + pMoved
            var diff = i - sameNodeIndex
            var diffLength = Math.abs(diff)
            if (diff < 0) {
                /* 说明该接点在p中的位置较远，需要再n中条南充元素 */
                insertNull(n, i, diffLength)
                i += diffLength
                nLength += diffLength
            } else {
                insertNull(p, sameNodeIndex, diffLength)
                pMoved += diffLength
            }
        }
    }
    return {
        p, n
    }
}




export function sortRules(p: any, n: any) {

    // copy
    p = [...p || []]
    n = [...n || []]

    var nLength = n.length
    var { map: pMap } = createMapAndList(p)

    var pMoved = 0

    for (let i = 0; i < nLength; i++) {
        /*
            此次循环用于将两组规则的相同key对应到相同的索引下
        */

        var node = n[i]
        var _key = node._key
        var sameNode = pMap[_key]
        if (sameNode) {
            /*
                the condition of reuse a vnode for dom is same _key and same type
                for rules is just the same _key
            */
            var sameNodeIndex = sameNode.index + pMoved
            var diff = i - sameNodeIndex
            var diffLength = Math.abs(diff)
            if (diff < 0) {
                /* 说明该接点在p中的位置较远，需要再n中条南充元素 */
                insertNull(n, i, diffLength)
                i += diffLength
                nLength += diffLength
            } else {
                insertNull(p, sameNodeIndex, diffLength)
                pMoved += diffLength
            }
        }
    }
    return {
        p, n
    }
}