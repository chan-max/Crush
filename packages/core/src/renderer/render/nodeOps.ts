
import {
    IMPORTANT
} from '../common/important'

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


    // style
    setProperty(style: CSSStyleDeclaration, property: string, value: string, important: boolean = false) {
        style.setProperty(property, value, important ? IMPORTANT : '')
    }
}