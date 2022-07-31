import { normalizeClass, normalizeStyle } from "@crush/core"
import { extend } from "@crush/common"


// normalize props 会在创建vnode时执行，确保得到的节点props已经处理完毕，不会在

export function normalizeProps(props: any) {
    if (!props) {
        return
    }

    if (props.bind) { // use bind
        extend(props, props.bind)
        delete props.bind
    }

    // 不在渲染时在进行处理，为了可以直接通过vnode获取到相应的class
    if (props.class) {
        props.class = normalizeClass(props.class)
    }

    if (props.style) {
        props.style = normalizeStyle(props.style)
    }

    return props
}