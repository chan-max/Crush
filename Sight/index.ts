/*
    The past is all false , and there is no way back to recall...
*/

import { createRule } from "./renderTools/CSSrenderTools.js"
import { init } from './core/init.js'
const Sight = function (options: Record<string, unknown>) {
    this.init(options)
}

Sight.prototype.init = init

export {
    Sight
}