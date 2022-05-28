
export var renderMethods = {
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
    createEvent:'',
    createHandlerKey:'',
    normalizeClass:'',
    normalizeStyle:'',
    renderSlot:'',
    injectDirective:'',
    injectDirectives:'',
    injectReservedProps:''
}

export const renderMethodsNameMap = Object.entries(renderMethods).reduce((res: any, [name, method]: any) => {
    res[name] = name
    //res[name] = method.name
    return res
}, {})