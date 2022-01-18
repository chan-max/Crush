import { NodeTypes } from "../../compiler/types";


import { cache } from "../cache/cache";
import { RESERVED_TAGS, HTML_TAGS, SVG_TAGS } from "./tags";

const isHTMLTag = cache((tag: string) => HTML_TAGS.includes(tag))
const isSVGTag = cache((tag: string) => SVG_TAGS.includes(tag))
const isReservedTag = cache((tag: string) => RESERVED_TAGS.includes(tag))

const tagTypeOf = cache((tag: string) =>
    isHTMLTag(tag) ?
        NodeTypes.HTMLELEMENT
        : isReservedTag(tag) ? 
            NodeTypes.RESERVED
            : isSVGTag(tag) ?
                NodeTypes.SVGELEMENT : NodeTypes.COMPONENT)

export {
    tagTypeOf,
    NodeTypes
}






