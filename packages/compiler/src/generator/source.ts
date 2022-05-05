
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
    normalizeStyle,
    renderSlot
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
    normalizeStyle,
    renderSlot
}

export const renderMethodsNameMap = Object.entries(renderMethods).reduce((res: Record<string, string>, [name, method]: [string, Function]) => {

    res[name] = method.name
    return res
}, {})


