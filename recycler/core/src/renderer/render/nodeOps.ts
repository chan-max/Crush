import { hyphenate } from '@crush/common';
import {
    IMPORTANT
} from '../common/important'

const svgNS = 'http://www.w3.org/2000/svg';

export const nodeOps = {
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
    setText() {

    },

    // style
    setProperty: (style: CSSStyleDeclaration, property: string, value: string, important: boolean = false) => style.setProperty(hyphenate(property), value, important ? IMPORTANT : ''),
    deleteRule: (sheet: CSSStyleSheet, index: number) => sheet.deleteRule(index)
}



function addEventListener(el: any, event: any, handler: any, options: any) {
    el.addEventListener(event, handler, options);
}

function removeEventListener(el: any, event: any, handler: any, options: any) {
    el.removeEventListener(event, handler, options);
}
export {
    addEventListener,
    removeEventListener
}