const isUndefined = (value) => typeof value === 'undefined';

const cache = (fn) => {
    const cache = Object.create(null);
    return ((str) => {
        const cached = cache[str];
        return isUndefined(cached) ? (cache[str] = fn(str)) : cached;
    });
};

const HTMLELEMENTS = [
    "html",
    "body",
    "base",
    "head",
    "link",
    "meta",
    "style",
    "title",
    "address",
    "article",
    "aside",
    "footer",
    "header",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "hgroup",
    "nav",
    "section",
    "div",
    "dd",
    "dl",
    "dt",
    "figcaption",
    "figure",
    "picture",
    "hr",
    "img",
    "li",
    "main",
    "ol",
    "p",
    "pre",
    "ul",
    "a",
    "b",
    "abbr",
    "bdi",
    "bdo",
    "br",
    "cite",
    "code",
    "data",
    "dfn",
    "em",
    "i",
    "kbd",
    "mark",
    "q",
    "rp",
    "rt",
    "rtc",
    "ruby",
    "s",
    "samp",
    "small",
    "span",
    "strong",
    "sub",
    "sup",
    "time",
    "u",
    "var",
    "wbr",
    "area",
    "audio",
    "map",
    "track",
    "video",
    "embed",
    "object",
    "param",
    "source",
    "canvas",
    "script",
    "noscript",
    "del",
    "ins",
    "caption",
    "col",
    "colgroup",
    "table",
    "thead",
    "tbody",
    "td",
    "th",
    "tr",
    "button",
    "datalist",
    "fieldset",
    "form",
    "input",
    "label",
    "legend",
    "meter",
    "optgroup",
    "option",
    "output",
    "progress",
    "select",
    "textarea",
    "details",
    "dialog",
    "menu",
    "summary",
    "template",
    "blockquote",
    "iframe",
    "tfoot",
    "area",
    "base",
    "br",
    "col",
    "embed",
    "hr",
    "img",
    "input",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr"
];

const SVGELEMENTS = [
    "svg",
    "animate",
    "animateMotion",
    "animateTransform",
    "circle", "clipPath",
    "color-profile",
    "defs",
    "desc",
    "discard",
    "ellipse",
    "feBlend",
    "feColorMatrix",
    "feComponentTransfer",
    "feComposite",
    "feConvolveMatrix",
    "feDiffuseLighting",
    "feDisplacementMap",
    "feDistanceLight",
    "feDropShadow",
    "feFlood",
    "feFuncA",
    "feFuncB",
    "feFuncG",
    "feFuncR",
    "feGaussianBlur",
    "feImage",
    "feMerge",
    "feMergeNode",
    "feMorphology",
    "feOffset",
    "fePointLight",
    "feSpecularLighting",
    "feSpotLight",
    "feTile",
    "feTurbulence",
    "filter",
    "foreignObject",
    "g",
    "hatch",
    "hatchpath",
    "image",
    "line",
    "linearGradient",
    "marker",
    "mask",
    "mesh",
    "meshgradient",
    "meshpatch",
    "meshrow",
    "metadata",
    "mpath",
    "path",
    "pattern",
    "polygon",
    "polyline",
    "radialGradient",
    "rect",
    "set",
    "solidcolor",
    "stop",
    "switch",
    "symbol",
    "text",
    "textPath",
    "title",
    "tspan",
    "unknown",
    "use",
    "view"
];

const BUILDN_TAG = [
    "if",
    "elseIf",
    "else",
    "for",
    "switch",
    "case",
];

var TagTypes;
(function (TagTypes) {
    TagTypes[TagTypes["HTMLELEMENT"] = 0] = "HTMLELEMENT";
    TagTypes[TagTypes["SVGELEMENT"] = 1] = "SVGELEMENT";
    TagTypes[TagTypes["COMPONENT"] = 2] = "COMPONENT";
    TagTypes[TagTypes["BuiltIn_TAG"] = 3] = "BuiltIn_TAG";
    TagTypes[TagTypes["COMMENT"] = 4] = "COMMENT";
})(TagTypes || (TagTypes = {}));
const isHTMLElements = cache((tagName) => HTMLELEMENTS.includes(tagName));
const isSVGElements = cache((tagName) => SVGELEMENTS.includes(tagName));
const isBuiltInTag = cache((tagName) => BUILDN_TAG.includes(tagName));
const tagTypeOf = cache((tagName) => isHTMLElements(tagName) ? TagTypes.HTMLELEMENT : isSVGElements(tagName) ? TagTypes.SVGELEMENT : isBuiltInTag(tagName) ? TagTypes.BuiltIn_TAG : TagTypes.COMPONENT);

const camelize = cache((str) => str.replace(/-(\w)/g, (_, c) => {
    return c ? c.toUpperCase() : '';
}));

var closeTagRE = /^<\/([\w-]+)\s*>/;
var openTagRE = /^<([\w-]+)/;
var DOMCommentRE = /<!--((.|[\r\n])*?)-->/;
var attributeRE = /^([^=>\s]+)\s*=\s*(["'])([^\1]*?)(\2)/;
var emptyAttributeRE = /^([^=>\s]+)/;
var textRE = /([^<]+)/;
const parseDOMTemplate = (template) => {
    var $, astTree = [], attributeCollection = [], inOpenTag = false, subLength = 0, currentTagName;
    while (template = template.substring(subLength).trimStart()) {
        if (template[0] === '<') {
            if (template[1] === '/') { /* close */
                let [{ length }, tagName] = closeTagRE.exec(template);
                for (var i = astTree.length - 1; i >= 0; i--) {
                    if (astTree[i].closed)
                        continue;
                    if (astTree[i].tagName === tagName) {
                        astTree[i].closed = true;
                        var children = astTree.splice(i + 1);
                        if (children) {
                            astTree[i].children = children;
                        }
                        break;
                    }
                }
                subLength = length;
            }
            else if (template[1] === '!') { /* comment  */
                let [{ length }, comment] = DOMCommentRE.exec(template);
                astTree.push({
                    type: TagTypes.COMMENT,
                    comment
                });
                subLength = length;
            }
            else { /* open */
                let [{ length }, tagName] = openTagRE.exec(template);
                currentTagName = tagName;
                inOpenTag = true;
                subLength = length;
            }
        }
        else if (inOpenTag) { /* attributes */
            if (template[0] === '/') {
                /* there is not must for decide a opentag is close or not by '/' */
                subLength = 1;
            }
            else if (template[0] === '>') {
                /*   tag close  */
                var tagName = camelize(currentTagName);
                var token = {
                    tagName,
                    attributeCollection,
                    type: tagTypeOf(tagName),
                    children: [],
                    closed: false
                };
                astTree.push(token);
                /* reset status */
                attributeCollection = [];
                inOpenTag = false;
                currentTagName = '';
                subLength = 1;
            }
            else if ($ = attributeRE.exec(template)) {
                /*  try to catch the attr map  */
                let [{ length }, attribute, _, value] = $;
                attributeCollection.push({
                    attribute, value
                });
                subLength = length;
            }
            else {
                /* no value attribute */
                let [{ length }, attribute] = emptyAttributeRE.exec(template);
                attributeCollection.push({
                    attribute,
                    value: true
                });
                subLength = length;
            }
        }
        else {
            /* text */
            let [{ length }, text] = textRE.exec(template);
            astTree.push({
                text,
                type: 'text'
            });
            subLength = length;
        }
    }
    return astTree;
};

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
