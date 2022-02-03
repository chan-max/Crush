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
    createSVGElement
} from '../../renderer/vnode/domNode'

import {
    createEmpty,
    error
} from '../../renderer/vnode/commonNode'

import {
    createSheet,
    createStyleRule,
    createKeyframeRule,
    createMediaRule,
    createSupportRule,
    createKeyframesRule
} from '../../renderer/vnode/ruleNode'

import { mergeSelectors } from '../../renderer/common/mergeSelector'
import { propertyMixin } from '../../renderer/common/mixin'

export const rfs = 'rfs'
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
    SHEET: rfs + '.' + createSheet.name,
    STYLERULE: rfs + '.' + createStyleRule.name,
    MEDIARULE: rfs + '.' + createMediaRule.name,
    MERGESELECTORS: rfs + '.' + mergeSelectors.name,
    ERROR: rfs + '.' + error.name,
    PROPERTYMIXIN: rfs + '.' + propertyMixin.name,
    ITERATECALL: rfs + '.' + iterateCall.name,
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
    createSheet,
    createStyleRule,
    createKeyframeRule,
    createMediaRule,
    createSupportRule,
    createKeyframesRule,
    propertyMixin,
    iterateCall,
    error
}

