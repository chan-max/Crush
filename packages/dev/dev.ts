import {
    compile
} from '@crush/compiler'

import {
    renderMethods
} from '@crush/compiler'

var template = `
<style>

    body{
        color:red;
        h1{
            color:red;
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
        x: '666',
        mixin: {
            color: 'red'
        }
    }
}

console.log('vdom', rf(instance, renderMethods)());

/*
    []
*/

import { ternaryChains } from '@crush/compiler/src/generator/stringify';
