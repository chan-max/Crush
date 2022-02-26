
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
    body{
        color:red;
        h1{
            color:blue; 
        }
    }
`

var ast = parseCSS(css)

console.log(ast);

var flated = flatRules(ast)

console.log(flated);






