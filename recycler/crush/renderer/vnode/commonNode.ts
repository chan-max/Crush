import { Nodes } from '../../type/nodeType'

var empty = Symbol('empty')
const createEmpty = () => {
    return {
        type: empty,
        nodeType: Nodes.EMPTY
    }
}

const error = () => 'fuck off !!!'

var emptyNode = {
    nodeType: empty
}

export {
    createEmpty,
    error,
    emptyNode
}