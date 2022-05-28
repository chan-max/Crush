
import { hyphenate } from '../../common/transformString';
import {
    IMPORTANT
} from '../common/important'

const svgNS = 'http://www.w3.org/2000/svg';

export const nodeOps = {
    createElement(tagName: string, isSVG: boolean = false) {
        return isSVG ? document.createElementNS(svgNS, tagName) : document.createElement(tagName)
    },
    insert: (child: Element | Text, parent: Element, anchor: Element | null = null) => {
        /* 可能传入不合理的anchor */
        if (anchor && anchor.parentElement !== parent) {
            anchor = null
        }
        parent.insertBefore(child, anchor);
    },
    remove: (el: Element) => {
        const parent = el.parentNode;
        if (parent) {
            parent.removeChild(el);
        }
    },

    createText: (text: string) => document.createTextNode(text),

    createComment: (text: string) => document.createComment(text),

    setText(textEl: Element, text: any) {
        textEl.nodeValue = text
    },

    setAttribute(el: any, attribute: any, value: any) {
        el.setAttribute(attribute, value)
    },

    removeAttribute(el: any, attribute: any) {
        el.removeAttribute(el, attribute)
    },

    addClass(el: Element, className: string) {
        el.classList.add(className)
    },

    removeClass(el: Element, className: string) {
        el.classList.remove(className)
    },

    addEventListener(el: any, event: any, handler: any, options: any) {
        el.addEventListener(event, handler, options);
    },
    removeEventListener(el: any, event: any, handler: any, options: any) {
        el.removeEventListener(event, handler, options);
    },
    // style
    setProperty: (style: CSSStyleDeclaration, property: string, value: string, important: boolean = false) => style.setProperty(hyphenate(property), value, important ? IMPORTANT : ''),
    deleteRule: (sheet: CSSStyleSheet, index: number) => sheet.deleteRule(index)
}







