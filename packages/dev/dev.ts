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
    NodesMap,
    Nodes
} from '@crush/types'
import {
    processRules
} from '@crush/compiler'

var template = `
    <style>
    body{
        color:red;
        blue:red;
        ...mixin;
        --for(i in 6){

        }
    }
    </style>
`

console.log(compile(template));










