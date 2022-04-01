import {
    compile
} from '@crush/compiler'

import {
    createApp
} from '@crush/core'

var template = `
<style>
    body{
        color:red;
    }
</style>
`

var rf = compile(template)
console.log(rf);
var code = document.createElement('code');
(code as any).innerHTML = rf
document.body.appendChild(code)



var app = createApp({
    create() {
        var { num, setNum, onNumChange } = useNumber(0)

    },
    created() {

    },
})
console.log(app);

var instance = app.mount('#app')
console.log(instance);

import {
    mergeSelectors
} from '@crush/core'

console.log(mergeSelectors('header,footer','h1,h2'));








