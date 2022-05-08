
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
    createHandlerKey,
    normalizeClass,
    normalizeStyle,
    renderSlot,
    injectDirective,
    injectDirectives
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
    createHandlerKey,
    normalizeClass,
    normalizeStyle,
    renderSlot,
    injectDirective,
    injectDirectives
}

export const renderMethodsNameMap = Object.entries(renderMethods).reduce((res: Record<string, string>, [name, method]: [string, Function]) => {

    res[name] = method.name
    return res
}, {})


