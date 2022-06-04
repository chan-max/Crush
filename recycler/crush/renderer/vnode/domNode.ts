import { Nodes } from "../../type/nodeType";

var fragment = Symbol('fragment')

function createFragment(children: Array<any>) {
    return {
        nodeType: Nodes.FRAGMENT,
        type: fragment,
        children
    }
}

var text = Symbol('text')

function createText(content: string) {
    return {
        nodeType: Nodes.TEXT,
        type: text,
        content
    }
}

function createElement(type: string, props = null, children = null) {
    return {
        nodeType: Nodes.HTMLELEMENT,
        type,
        props,
        children
    }
}

function createSVGElement(type: string, props = null, children = null) {
    return {
        nodeType: Nodes.SVGELEMENT,
        type,
        props,
        children
    }
}

function createComponent(type: string, props = null, slots = null) {
    return {
        nodeType: Nodes.COMPONENT,
        type,
        props,
        slots
    }
}

var comment = Symbol('comment')
function createComment(content: string) {
    return {
        nodeType: Nodes.COMMENT,
        type: comment,
        content
    }
}

function createStyleSheet(props: any, rules: any) {
    return {
        nodeType: Nodes.STYLE,
        props,
        rules
    }
}

export {
    createElement,
    createText,
    createFragment,
    createSVGElement,
    createComponent,
    createComment,
    createStyleSheet
}