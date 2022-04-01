import {
    compile
} from '@crush/compiler'

import {
    createApp
} from '@crush/core'

var template = `
<style>
    body{
        --if(isLogin){
            h1{
                color:red;
            }
        }
    }
</style>
`

var rf = compile(template)
console.log(rf);
var code = document.createElement('code');
(code as any).innerHTML = rf
document.body.appendChild(code)









