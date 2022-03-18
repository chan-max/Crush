import {
    compile
} from '@crush/compiler'

import {
    Nodes
} from '@crush/types'

var template = `

<div> 
    <div></div>
    <svg>
        <div>
        <div>
    <div></div>
    <svg>
        <div></div>
    </svg>
</div></div>
    </svg>
</div>

`

console.log(compile(template));


