import {
    compile
} from '@crush/compiler'

import {
    createApp
} from '@crush/core'

var template = `
<h1 --if="isLogin" --for="item,i in 6">111</h1>
`

var rf = compile(template)
console.log(rf);
var code = document.createElement('code')
code.innerHTML = rf
document.body.appendChild(code)


var app = createApp({
    create() {

    },
    created() {

    },
})
console.log(app);

app.mount('#app')









