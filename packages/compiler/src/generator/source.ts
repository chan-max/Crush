
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
    display,
    mixin
} from '@crush/renderer'


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
    mixin
}

export const methods = '_' // am I cute ?
export const context = 'ctx'
export const instance = 'st'

export const Source = Object.keys(renderMethods).reduce((res: Record<string, string>, name: string): Record<string, string> => {
    res[name] = methods + '.' + name
    return res
}, {})
