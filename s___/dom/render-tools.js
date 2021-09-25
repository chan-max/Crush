function ST_HTMLElement(tag, attributes, children) {
    this.type = 'ST_HTMLElement'
    this.tag = tag
    this.attributes = attributes
    this.children = children
}



function ST_SVGElement() {

}

function ST_Text(text) {
    this.type = 'ST_Text'
    this.text = text
}

function ST_Comment() {

}

function ST_Component() {

}

function createElement(tag, attributes, children) {
    return new ST_HTMLElement(tag, attributes, children)
}

function createText(text) {
    return new ST_Text(text)
}


export {
    createElement,
    createText
}