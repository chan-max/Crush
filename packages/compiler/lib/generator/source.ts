import renderMethods from "@crush/renderer/lib/renderMethodsExport"

export var rfs = {
    createComment: '',
    createElement: '',
    createFragment: '',
    createKeyframe: '',
    createKeyframes: '',
    createMedia: '',
    createSVGElement: '',
    createStyleSheet: '',
    createStyle: '',
    createText: '',
    renderList: '',
    mergeSelectors: '',
    display: '',
    createDeclaration: '',
    mixin: '',
    important: '',
    createSupports: '',
    flatRules: '',
    createComponent: '',
    getComponent: '',
    getDirective: '',
    getCurrentScope: '',
    withEventModifiers: '',
    toNativeEventName: '',
    normalizeClass: '',
    normalizeStyle: '',
    renderSlot: '',
    injectDirective: '',
    injectDirectives: '',
    injectReservedProps: '',
    createMap: '',
    getCurrentRenderScope:''
}


export const renderMethodsNameMap = Object.entries(rfs).reduce((res: any, [name, method]: any) => {
    res[name] = name
    //res[name] = method.name
    return res
}, {})