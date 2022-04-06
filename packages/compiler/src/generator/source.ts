
import {
    createComment,
    createElement,
    createFragment,
    createKeyframe,
    createKeyframes,
    createMedia,
    createSVGElement,
    createSheet,
    createStyle,
    createText,
    iterator,
    mergeSelectors,
    splitSelector,
    mergeSplitedSelectorsAndJoin,
    display,
    createDeclaration,
    mixin
} from '@crush/core'

import {
    flatRules
} from '../parser/flatRules'

export const renderMethods = {
    createComment,
    createElement,
    createFragment,
    createKeyframe,
    createKeyframes,
    createMedia,
    createSVGElement,
    createSheet,
    createStyle,
    createText,
    iterator,
    mergeSelectors,
    display,
    mixin,
    flatRules,
    splitSelector,
    mergeSplitedSelectorsAndJoin,
    createDeclaration
}

export const renderMethodsNameMap = Object.entries(renderMethods).reduce((res: Record<string, string>, [name, method]: [string, Function]) => {
    res[name] = method.name
    return res
}, {})

export const Source = {
    createComment: 'createComment',
    createElement: 'createElement',
    createFragment: 'createFragment',
    createComponent: 'createComponent',
    createKeyframe: 'createKeyframe',
    createKeyframes: 'createKeyframes',
    createMedia: 'createMedia',
    createSVGElement: 'createSVGElement',
    createSheet: 'createSheet',
    createStyle: 'createStyle',
    createText: 'createText',
    iterator: 'iterator',
    mergeSelectors: 'mergeSelectors',
    display: 'display',
    mixin: 'mixin',
}

