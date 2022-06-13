import renderMethods from "@crush/renderer/lib/renderMethods"


export var rfs = {
    createComment:'',
    createElement:'',
    createFragment:'',
    createKeyframe:'',
    createKeyframes:'',
    createMedia:'',
    createSVGElement:'',
    createStyleSheet:'',
    createStyle:'',
    createText:'',
    renderList:'',
    mergeSelectors:'',
    display:'',
    createDeclaration:'',
    mixin:'',
    important:'',
    createSupports:'',
    flatRules:'',
    createComponent:'',
    getComponent:'',
    getDirective:'',
    getCurrentScope:'',
    withEventModifiers:'',
    toEventName:'',
    normalizeClass:'',
    normalizeStyle:'',
    renderSlot:'',
    injectDirective:'',
    injectDirectives:'',
    injectReservedProps:'',
    createMap:''
}


export const renderMethodsNameMap = Object.entries(rfs).reduce((res: any, [name, method]: any) => {
    res[name] = name
    //res[name] = method.name
    return res
}, {})