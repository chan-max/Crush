
import {
    createApp
} from './core/module/app'

import {
    compile
} from './compiler/generator/compile'
import {
    renderMethods
} from './compiler/generator/const'

import {
    parseCSS
} from './compiler/parser/parseCSS'
import { Nodes } from './type/nodeType'
import {
    flatRules
} from './compiler/parser/flatRules'

var css = `
    <style>
    body{
        @keyframes name{
            from{
                color:red;
            }
            to{
                color:blue;
            }
        }
    }
    </style>
`

var fn = compile(css)

console.log(fn);

console.log(fn({},renderMethods));






