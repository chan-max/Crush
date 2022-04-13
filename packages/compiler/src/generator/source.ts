
import {
    createComment,
    createElement,
    createFragment,
    createKeyframe,
    createKeyframes,
    createMedia,
    createSVGElement,
    createStyleSheet,
    createStyle,
    createText,
    iterator,
    mergeSelectors,
    splitSelector,
    mergeSplitedSelectorsAndJoin,
    display,
    createDeclaration,
    mixin,
    important,
    createSupport,
    flatRules,
    createComponent,
    getComponent,
    getDirective,
    getCurrentScope
} from '@crush/core'

export var renderMethods = {
    createComment,
    createElement,
    createFragment,
    createKeyframe,
    createKeyframes,
    createMedia,
    createSVGElement,
    createStyleSheet,
    createStyle,
    createText,
    iterator,
    mergeSelectors,
    display,
    mixin,
    flatRules,
    splitSelector,
    mergeSplitedSelectorsAndJoin,
    createDeclaration,
    important,
    createSupport,
    createComponent,
    getComponent,
    getDirective,
    getCurrentScope
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
    createStyleSheet: 'createStyleSheet',
    createStyle: 'createStyle',
    createText: 'createText',
    iterator: 'iterator',
    mergeSelectors: 'mergeSelectors',
    display: 'display',
    mixin: 'mixin',
}

