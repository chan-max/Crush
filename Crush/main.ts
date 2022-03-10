
import {
    createApp
} from './core/module/app'

import {
    compile
} from './compiler/generator/compile'
import {
    renderMethods
} from './compiler/generator/const'

var css = `
    <div @click="" @hook:before-mount=""></div>
`

var template = `
    <div>
        {{ isLogin ? 'welcome' : 'please login' }}
    </div>
    <hello>
        <div --slot=""></div>
        <div></div>
    </hello>
`

var fn = compile(css)

console.log(fn);

console.log(fn({}, renderMethods));
