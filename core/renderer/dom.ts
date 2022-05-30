
import { hyphenate } from '../common/transformString';
import {
    IMPORTANT
} from './common/important'

const svgNS = 'http://www.w3.org/2000/svg';

export const addClass = (el: HTMLElement, className: string) => el.classList.add(className)
export const removeClass = (el: HTMLElement, className: string) => el.classList.remove(className)

export const docCreateElement = (tagName: string, isSVG: boolean = false) => isSVG ? document.createElementNS(svgNS, tagName) : document.createElement(tagName)
export const docCreateComment = (text: string) => document.createComment(text)
export const docCreateText = (text: string) => document.createTextNode(text)
export const setText = (textEl: Element, text: any) => textEl.nodeValue = text
export const insertElement = (child: Element | Text, parent: Element, anchor: Element | null = null) => {
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

export const setAttribute = (el: Element, attribute: string, value: string) => el.setAttribute(attribute, value)
export const removeAttribute = (el: Element, attribute: string) => el.removeAttribute(attribute)

export const addEventListener = (el: Element, event: string, handler: any, options: any) => el.addEventListener(event, handler, options);
export const removeEventListener = (el: Element, event: string, handler: any, options: any) => el.removeEventListener(event, handler, options);










