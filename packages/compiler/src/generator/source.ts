
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
    renderList,
    mergeSelectors,
    splitSelector,
    mergeSplitedSelectorsAndJoin,
    display,
    createDeclaration,
    mixin,
    important,
    createSupports,
    flatRules,
    createComponent,
    getComponent,
    getDirective,
    getCurrentScope,
    createEvent,
    toHandlerKey,
    normalizeClass,
    normalizeStyle
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
    renderList,
    mergeSelectors,
    display,
    mixin,
    flatRules,
    createDeclaration,
    important,
    createSupports,
    createComponent,
    getComponent,
    getDirective,
    getCurrentScope,
    createEvent,
    toHandlerKey,
    normalizeClass,
    normalizeStyle
}

export const renderMethodsNameMap = Object.entries(renderMethods).reduce((res: Record<string, string>, [name, method]: [string, Function]) => {
    res[name] = method.name
    return res
}, {})


