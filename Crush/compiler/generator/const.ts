import {
    dataDisplay
} from '../../renderer/common/dataDisplay'
import {
    iterateCall
} from '../../renderer/common/iterateCall'

import {
    createElement,
    createText,
    createFragment,
    createComponent,
    createSVGElement,
    createStyleSheet
} from '../../renderer/vnode/domNode'

import {
    createEmpty,
    error
} from '../../renderer/vnode/commonNode'

import {
    createStyleRule,
    createKeyframeRule,
    createMediaRule,
    createSupportsRule,
    createKeyframesRule
} from '../../renderer/vnode/ruleNode'

import { mergeSelectors } from '../../renderer/common/mergeSelector'
import { propertyMixin } from '../../renderer/common/mixin'
import { important } from '../../renderer/common/important'
import { createEvent } from '../../renderer/common/createEvent'

export const rfs = '_'
export const scope = 'scope'

/*
    the render fns name maping
*/


/* this is for compiler */
export const renderSource = {
    FRAGMENT: rfs + '.' + createFragment.name,
    EMPTY: rfs + '.' + createEmpty.name,
    ELEMENT: rfs + '.' + createElement.name,
    SVGELEMENT: rfs + '.' + createSVGElement.name,
    TEXT: rfs + '.' + createText.name,
    DATADISPLAY: rfs + '.' + dataDisplay.name,
    COMPONENT: rfs + '.' + createComponent.name,
    SHEET: rfs + '.' + createStyleSheet.name,
    STYLERULE: rfs + '.' + createStyleRule.name,
    MEDIARULE: rfs + '.' + createMediaRule.name,
    MERGESELECTORS: rfs + '.' + mergeSelectors.name,
    ERROR: rfs + '.' + error.name,
    PROPERTYMIXIN: rfs + '.' + propertyMixin.name,
    ITERATECALL: rfs + '.' + iterateCall.name,
    IMPORTANT: rfs + '.' + important.name,
    SUPPORTRULE: rfs + '.' + createSupportsRule.name,
    KEYFRAMESRULE: rfs + '.' + createKeyframesRule.name,
    KEYFRAMERULE: rfs + '.' + createKeyframeRule.name,
    CREATEEVENT: rfs + '.' + createEvent.name,
}

/* this is for renderer */
export const renderMethods = {
    createFragment,
    createEmpty,
    createElement,
    createComponent,
    createText,
    dataDisplay,
    mergeSelectors,
    createStyleSheet,
    createStyleRule,
    createKeyframeRule,
    createMediaRule,
    createSupportsRule,
    createKeyframesRule,
    propertyMixin,
    iterateCall,
    important,
    createEvent,
    error,
}

