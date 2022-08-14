
const svgNS = 'http://www.w3.org/2000/svg';

export const addClass = (el: Element, className: string) => el.classList.add(className)
export const removeClass = (el: Element, className: string) => el.classList.remove(className)

export const docCreateElement = (tagName: string, isSVG: boolean = false) => isSVG ? document.createElementNS(svgNS, tagName) : document.createElement(tagName)
export const docCreateComment = (text: string) => document.createComment(text)
export const docCreateText = (text: string) => document.createTextNode(text)
export const setText = (textEl: Element, text: any) => textEl.nodeValue = text

export const insertElement = (child: Element | Text | Comment, parent: Element, anchor: Element | null = null) => {
    /* 可能传入不合理的anchor */
    if (anchor && anchor.parentElement !== parent) {
        anchor = null
    }
    parent.insertBefore(child, anchor);
}

export const removeElement = (el: Element) => {
    const parent = el.parentNode;
    if (parent) {
        parent.removeChild(el);
    }
}

// 重新挂载一个元素
export function remountElement(el: HTMLElement) {
    let parent = el.parentElement
    let anchor = el.nextElementSibling
    removeElement(el)
    insertElement(el, parent as Element, anchor)
}

export const setAttribute = (el: Element, attribute: string, value: string = '') => el.setAttribute(attribute, value)
export const removeAttribute = (el: Element, attribute: string) => el.removeAttribute(attribute)

export const addListener = (target: EventTarget, event: string, handler: any, options: any = null) => target.addEventListener(event, handler, options);
export const removeListener = (target: EventTarget, event: string, handler: any, options: any = null) => target.removeEventListener(event, handler, options);

export function onceListener(target: Element, event: string, handler: Function, options: any = null) {
    var onceHandler = () => {
        handler()
        removeListener(target, event, onceHandler, options)
    }
    addListener(target, event, onceHandler, options)

    // 注销事件
    return () => removeListener(target, event, onceHandler, options)
}








