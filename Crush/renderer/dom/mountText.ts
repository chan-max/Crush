

export const mountText = (node: any, container: any) => {
    var content = node.content
    var el = document.createTextNode(content)
    container.appendChild(el)
}