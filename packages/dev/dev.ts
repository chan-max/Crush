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


var css = `
    body{
        --if(isLogin){
            color:red;
            a{
                color:red;
            }
        }
    }
`

/*



*/

console.log(parseCSS(css));

const app = {
    template: `
        <style>
            div{
                $width:x;
                $height:x;
                background-color:red;
            }
        </style>
        <div @click="pad">
        </div>
    `,
    create(self) {
        self.x = 10
        self.pad = () => self.x += 10
    },
    created(self){

          
    }
}




