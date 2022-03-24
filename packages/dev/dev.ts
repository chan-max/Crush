import {
    compile
} from '@crush/compiler'

import {
    parseCSS
} from '@crush/compiler'

import {
    createApp
} from '@crush/core'


import {
    flatRules
} from '@crush/compiler'

import {
    NodesMap,
    Nodes
} from '@crush/types'


var css = `
    body{
       --if(A){
           background-color:red;
       }
       --else-if(B){
            background-color:green;
       }
       --else{
            background-color:blue;
       }
    }
`

/*



*/

var ast = parseCSS(css)
console.log(ast);

console.log(flatRules(ast));




