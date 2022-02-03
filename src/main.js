import { parseHTML } from "./compiler/parser/parseHTML";
import { parseAst } from "./compiler/parser/parseAst";
var template = `
<div class="ndeallist clear_fix">
<svg>
    <dd>
        <a rel="nofollow" href="/list/list_15_1.htm" target="_blank">PHP</a>
        <a rel="nofollow" href="/list/list_21_1.htm" target="_blank">ASP.NET</a>
        <a rel="nofollow" href="/list/list_2_1.htm" target="_blank">ASP</a>
        <a rel="nofollow" href="/list/list_3_1.htm" target="_blank">JavaScript</a>
    </dd>
</svg>
</div>


`;
var ast = parseHTML(template);
parseAst(ast);
console.log(ast);
