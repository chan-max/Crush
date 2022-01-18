import { NodeTypes } from "../../common/tag-type/tagType";

const createElementVNode = (tagName: string, events: any, attributes: any, children: any) => {
    return {
        type: NodeTypes.HTMLELEMENT,
        tagName, events, attributes, children
    }
}


const createFragment = () => ''
const createTextVNode = (text: string) => ({ type: NodeTypes.TEXT, text })
const createComponentVNode = () => ''

export {
    createElementVNode,
    createFragment,
    createTextVNode,
    createComponentVNode
}
