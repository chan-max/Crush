import { HTML_TAGS } from "./HTMLTags";
import { SVG_TAGS } from "./SVGTags";
import { cache } from "../../common/cache";
import { Nodes } from "../../type/nodeType";
const isHTMLTag = (tagName: string) => HTML_TAGS.includes(tagName)

const isSVGTag = (tagName: string) => tagName === 'svg'

var typeMap = {
    '': Nodes.TEXT,
    '!': Nodes.COMMENT,
    'svg': Nodes.SVGELEMENT,
    'style': Nodes.STYLE,
    'if': Nodes.IF,
    'elseIf': Nodes.ELSEIF,
    'else': Nodes.ELSE,
    'for': Nodes.FOR
}


const nodeTypeOf = (key: string) => {
    var type = typeMap[key]
    return type || (isHTMLTag(key) ? Nodes.HTMLELEMENT : Nodes.COMPONENT)
}

export {
    nodeTypeOf
}