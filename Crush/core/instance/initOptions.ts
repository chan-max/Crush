import { compile } from "../../compiler/generator/compile"
import {
    reactive
} from '../../reactivity/reactive'

var uid = 0

function createCommonInstance(options) {
    return {
        uid: uid++,
        render: options.render ||= compile(options.template),
        init: options.init ||= () => { },
        scope: reactive({})
    }
}

function createComponentInstance(options: any) {
    // 创建组件实例，同类型组件实例不同
    var instance = createCommonInstance(options)

    /* 处理props， slots 等私有属性 */
    return instance
}

export {
    createComponentInstance
}