import { Nodes } from "@crush/types";

export interface Asb {
    type: Nodes | string
    tag?: string
    tagName?: string
    children?: any
    content?: any
    closed?: boolean
    attributes?: Asb[]
    attributeMap?: any
    modifier?: string
    parent?: Asb
    attribute?: string
    value?: string
    dirs?: Asb[]

    condition?: string /* branch */

    iterator?: any

    media?: string

    keyframes?: string

    mixin?: string

    selector?: any
    selectors?: any

    declaration?: any
    declarations?: any

    customDir?: any
    modifiers?: any
    dirName?: string

    isBranchStart?:boolean
    isBranch?: any

    support?:any,

}

export const createAsb = (type: Nodes | string,): Asb => ({ type })
