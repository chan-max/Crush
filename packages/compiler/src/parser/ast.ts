import { Nodes } from "@crush/types";
import { Selector } from "./parseSelector";

export interface Asb {
    type: Nodes
    content: any
    children: Asb[] | null
    parent: Asb | null,
    dirs?: Asb[]
    selectors?: Selector[]
}

export const createAsb = (type: any, content: any = null, parent = null, children = null): Asb => ({
    type,
    content,
    parent,
    children
})
