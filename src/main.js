import { parseDOMTemplate } from "./compiler/dom-parser/parseDOM";
var template = ` 

<ul id="navList">
      <li>
            <a id="blog_nav_sitehome" class="menu" href="https://www.cnblogs.com/">
                  博客园
            </a>
      </li>
</ul>

`;
console.log(parseDOMTemplate(template));
var attr = '@[click].native.stop';
var attributeExtractRE = /(-{2}|@|$)?(\[)?(\w+)(\])?(\.)/;
console.log(attributeExtractRE.exec(attr));
var parseAttrs = () => {
};
