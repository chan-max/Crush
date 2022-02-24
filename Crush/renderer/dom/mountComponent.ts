import {
    createComponentInstance
} from '../../core/instance/initOptions'
import { patch } from './patch'
import {
    emptyNode
} from '../../renderer/vnode/commonNode'

import { renderMethods } from "../../compiler/codegen/const"

import {
    effect
} from '../../reactivity/reactive'

export function mountComponent(options: any, container: any) {
    var instance: any = createComponentInstance(options)
    instance.init(instance.scope)

    effect(() => {
        var prev = instance.prev || emptyNode
        var next = instance.render(instance.scope, renderMethods)
        patch(prev, next, container)
        instance.prev = next
    })
    return instance
}