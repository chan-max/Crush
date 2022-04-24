

export default {
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
}