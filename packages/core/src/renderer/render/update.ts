import { Nodes } from "@crush/types";

export function update(current: any, next: any, container: any) {
    const {
        nodeType,
        props: nextProps,
        children: nextChidren
    } = next
    const {
        props: currentProps,
        children: currentChildren
    } = current
    switch (nodeType) {
        case Nodes.TEXT:

            break
        case Nodes.HTML_ELEMENT:
            /*
                update props    
            */
            updateChildren(currentChildren, nextChidren)
            break
    }
}

function updateChildren(currentChildren: any, nextChidren: any) {
    debugger
}