import { templateExtract } from "./compiler/template/templateExtract";

// Crush Studio
console.log("%cCrush Studio", "color: #333;  font-size: 10px; font-weight:bold;");

var template = ` 

<body>
  <div class="app">
    <button >button</button>
  </div>
</body>

<script src="./vue3.js"></script>
<script src="./dist/iife/iife.js"></script>

<script>

</script>


`

const DIRECTIVE_FLAG = '--'
const EVENTS_FLAG = '@'
const DATABIND_FLAG = '$'
var x = templateExtract(template)

for(var i of x){
    console.log(i);
}



enum tagTypes{
    HTMLELEMENT = 123,
    SVGELEMENT,
}


