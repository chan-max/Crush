import { Nodes } from "@crush/types";

export function update(current: any, next: any, container: any) {
    switch (next.nodeType) {
        case Nodes.TEXT:

            break
        case Nodes.HTML_ELEMENT:
            /*
                update props    
            */
           debugger
            updateChildren(current.children, next.children)
            break
    }
}

function updateChildren(currentChildren: any, nextChidren: any) {
    debugger
}