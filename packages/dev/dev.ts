import {
    compile
} from '@crush/compiler'

import {
    createApp
} from '@crush/core'

import {
    mergeSelectors
} from '@crush/core'

var template = `
<style>
    body{
        background-color:red;
        ...mixin;
    }
</style>
`

var rf = compile(template)
var code = document.createElement('code');
(code as any).innerHTML = rf
document.body.appendChild(code)








