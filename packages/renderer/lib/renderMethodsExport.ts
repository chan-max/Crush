
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
import { mergeSelectors, getCustomScreensMedia } from '@crush/core'

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

import { toEventName, } from './common/event'

import { renderSlot } from './common/renderSlot'
import { createSVGElement } from '@crush/core'

import { withEventModifiers } from '@crush/core'
import { useCurrentInstanceCache } from '@crush/core'

export default {
    useCurrentInstanceCache,
    getCurrentRenderScope,
    createComment,
    createSVGElement,
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
    mergeSelectors,
    withEventModifiers,
    getCustomScreensMedia,
    toEventName,
}