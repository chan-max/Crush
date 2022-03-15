import {
    compile
} from '@crush/compiler'

var template = `
    <button --slot:header="666">

    </button>
`

console.log(compile(template));
