
import {
    getCurrentScope,
    getCurrentRenderScope
} from './render/mountComponent'
import {
    createElement,
    createText,
    createFragment,
    createComponent,
    createComment
} from './vnode/dom'

import { important } from './common/important'
import { mergeSelectors } from '@crush/core'

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
    mixin
} from './common/mixin'

import {
    normalizeClass
} from './common/normalizeClass'
import {
    normalizeStyle
} from './common/normalizeStyle'

import {
    createMap
} from '@crush/common'

import { renderSlot } from './common/renderSlot'

import { injectDirectives } from '@crush/core'
import { createSVGElement } from '@crush/core'

export default {
    getCurrentRenderScope,
    createComment,
    createSVGElement,
    injectDirectives,
    important,
    getCurrentScope,
    createElement,
    createText,
    renderList,
    createFragment,
    display,
    getDirective,
    getComponent,
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
    renderSlot,
    mergeSelectors
}