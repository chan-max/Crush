
import {
    getCurrentScope
} from './render/mountComponent'
import {
    createElement,
    createText,
    createFragment
} from './vnode/vnode'

import {
    renderList
} from './common/iterator'

export default {
    getCurrentScope,
    createElement,
    createText,
    renderList,
    createFragment
}