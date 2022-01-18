import { parseDOMTemplate } from "./compiler/parser/parsedom"

var template = `

    <div>
        <button> 早上好 ！ 请 {{ num < 0  }} 登录 </button>
    </div>
    
`


console.log(parseDOMTemplate(template));





