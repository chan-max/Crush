import { compile } from "../../compiler/codegen/compile"

var uid = 0

function createComponentInstance(options: any) {
    var render = options.render || (options.render = compile(options.template))
    var instance = {
        isMounted: false,
        uid: uid++,
        render,
        init: options.init,
        scope: Object.create(null)
    }

    return instance
}

export {
    createComponentInstance
}