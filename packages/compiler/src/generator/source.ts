
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
    getCurrentScope,
    createEvent,
    toHandlerKey,
    normalizeClass,
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
    createDeclaration,
    important,
    createSupport,
    createComponent,
    getComponent,
    getDirective,
    getCurrentScope,
    createEvent,
    toHandlerKey,
    normalizeClass
}

export const renderMethodsNameMap = Object.entries(renderMethods).reduce((res: Record<string, string>, [name, method]: [string, Function]) => {
    res[name] = method.name
    return res
}, {})


