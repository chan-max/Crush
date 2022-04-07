import {
    compile
} from '@crush/compiler'

import {
    renderMethods
} from '@crush/compiler'

var template = `
<style>
    body{
        --if(){
            
        }
    }
</style>
`

var rf = compile(template)
var code = document.createElement('code');
(code as any).innerHTML = rf
document.body.appendChild(code)

var instance = {
    scope: {
        mixin: {
            color: 'red'
        }
    }
}

console.log('vdom', rf(instance, renderMethods)());



