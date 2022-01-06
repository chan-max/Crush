enum TagTypes {
    HTMLELEMENT,
    SVGELEMENT,
    COMPONENT,
    BuiltIn_TAG,
    COMMENT,
}

import { cache } from "../cache/cache";

import { HTMLELEMENTS } from "./HTMElements";
import { SVGELEMENTS } from "./SVGElements";
import { BUILDN_TAG } from "./BuiltInTag";

const isHTMLElements = cache((tagName: string) => HTMLELEMENTS.includes(tagName))
const isSVGElements = cache((tagName: string) => SVGELEMENTS.includes(tagName))
const isBuiltInTag = cache((tagName: string) => BUILDN_TAG.includes(tagName))

const tagTypeOf = cache((tagName: string) => isHTMLElements(tagName) ? TagTypes.HTMLELEMENT : isSVGElements(tagName) ? TagTypes.SVGELEMENT : isBuiltInTag(tagName) ? TagTypes.BuiltIn_TAG : TagTypes.COMPONENT)

export {
    tagTypeOf,
    TagTypes,
    isHTMLElements
}






