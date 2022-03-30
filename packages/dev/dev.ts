import {
    compile
} from '@crush/compiler'

import {
    parseTemplate
} from '@crush/compiler'

import {
    createApp
} from '@crush/core'

import {
    NodesMap,
    Nodes
} from '@crush/types'

import {
    createFunction
} from '@crush/compiler'

var template = `
<h1 --if="isLogin" --for="item,i in 6">111</h1>
`

var rf = compile(template)
console.log(rf);

var code = document.createElement('code')
code.innerHTML = rf
document.body.appendChild(code)











