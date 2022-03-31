
function createNode(type: any, props: any, children: any) {
    return {
        type,
        props,
        children
    }
}

const createElement = (type: any, props: any, children: any) => createNode(type, props, children)

const createText = () => { }
     
const createSVGElement = () => { }

const createComment = () => { }

const createFragment = () => { }

const createSheet = () => { }

const createStyle = () => { }

const createMedia = () => { }

const createKeyframes = () => { }

const createKeyframe = () => { }

export {
    createComment,
    createElement,
    createFragment,
    createKeyframe,
    createKeyframes,
    createMedia,
    createSVGElement,
    createSheet,
    createStyle,
    createText,
}