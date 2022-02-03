import {
    createComponentInstance
} from '../../core/instance/initOptions'

import { renderMethods } from "../../compiler/codegen/const"

export function mountComponent(options: any, el: any) {
    var instance = createComponentInstance(options)
    instance.init(instance.scope)
    var nextTree = instance.render(instance.scope, renderMethods)
    el.innerText = JSON.stringify(nextTree,null,2)
    return instance
}