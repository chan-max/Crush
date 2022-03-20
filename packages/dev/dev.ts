import {
    compile
} from '@crush/compiler'

import {
    parseCSS
} from '@crush/compiler'

var template = `
    body{
        --for(i in 6){
            background-color:red;
            h$(i){
                color:red;
            }
        }
    }
`

/*

*/

console.log(parseCSS(template))




