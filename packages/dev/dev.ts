import {
    compile
} from '@crush/compiler'

import {
    Nodes
} from '@crush/types'

var template = `
<if --="isloign">
    
</if>
`

console.log(compile(template));


