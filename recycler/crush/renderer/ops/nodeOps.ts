
const svgNameSpace = 'http://www.w3.org/2000/svg';
const doc: Document = document

const nodeOps = {
    createElement: (tag: string) => doc.createElement(tag),
}