import { Nodes } from "../../type/nodeType"


/*
    keywords ===> type
*/

const typeMap = {
    media: Nodes.MEDIARULE,
    support: Nodes.SUPPORTRULE,
    keyframes: Nodes.KEYFRAMESRULE,
    if: Nodes.IF,
    elseIf: Nodes.ELSEIF,
    ['else-if']: Nodes.ELSEIF,
    else: Nodes.ELSE,
    for: Nodes.FOR
}

export {
    typeMap
}