
import renderMethods from "@crush/renderer/lib/renderMethods"

export const renderMethodsNameMap = Object.entries(renderMethods).reduce((res: any, [name, method]: any) => {
    res[name] = res[name].name
    //res[name] = method.name
    return res
}, {})