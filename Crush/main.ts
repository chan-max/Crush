import { parseDOMTemplate } from "./compiler/dom-parser/parsedom";

var template = ` 

<ul id="navList">
      <li>
            <a id="blog_nav_sitehome" class="menu" href="https://www.cnblogs.com/">
                  博客园
            </a>
      </li>
</ul>

`

console.log(parseDOMTemplate(template));
