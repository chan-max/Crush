
import {
    getCurrentScope
} from './render/mountComponent'
import {
    createElement,
    createText,
    createFragment,
    createComponent
} from './vnode/dom'

import { important } from './common/important'

import {
    createStyleSheet,
    createStyle,
    createDeclaration,
    createKeyframe,
    createKeyframes,
    createMedia,
    createSupports,
} from './vnode/css'

import {
    renderList
} from './common/iterator'
import {
    display
} from './common/display'
import {
    getDirective,
    getComponent
} from './common/assets'
import {
    injectDirectives
} from '@crush/core'
import {
    mixin
} from './common/mixin'

import {
    normalizeClass
} from './common/normalizeClass'
import {
    normalizeStyle
} from './common/normalizeStyle'

import {renderSlot} from './common/renderSlot'

export default {
    important,
    getCurrentScope,
    createElement,
    createText,
    renderList,
    createFragment,
    display,
    getDirective,
    getComponent,
    injectDirectives,
    createStyleSheet,
    createStyle,
    createDeclaration,
    createKeyframe,
    createKeyframes,
    createMedia,
    createSupports,
    mixin,
    normalizeClass,
    normalizeStyle,
    createComponent,
    renderSlot
}