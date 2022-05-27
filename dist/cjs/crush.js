'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const isNumber = (value) => (!isNaN(value)) && (typeof value === 'number');
const isString = (value) => typeof value === 'string';
const isArray = Array.isArray;
const isObject = (value) => objectToString.call(value) === '[object Object]';
const isFunction = (value) => typeof value === 'function';
var objectToString = Object.prototype.toString;

const cache = (fn) => {
    const cache = Object.create(null);
    return ((key) => {
        const cached = cache[key];
        return cached === undefined ? (cache[key] = fn(key)) : cached;
    });
};

const camelizeRE = /-(\w)/g;
const camelize = cache((str) => str.replace(camelizeRE, (_, $) => $.toUpperCase()));
const hyphenateRE = /\B([A-Z])/g;
const hyphenate = cache((str) => str.replace(hyphenateRE, '-$1').toLowerCase());
const capitalize = cache((str) => str.charAt(0).toUpperCase() + str.slice(1));

const warn = (...msg) => console.warn(...msg);
const error = (...msg) => {
    throw new Error(...msg);
};

const getEmptyMap = () => Object.create(null);
var id = 0;
const uid = () => id++;
const uStringId = () => String(uid());
const uVar = () => `_${uid()}`;
const EMPTY_OBJ = Object.freeze({});
const EMPTY_ARR = Object.freeze([]);

const arrayToMap = (arr, mapValue = true) => arr.reduce((res, item) => {
    res[item] = mapValue;
    return res;
}, getEmptyMap());
const stringToMap = (str, delimiter) => arrayToMap(str.split(delimiter));
// from vue
const makeMap = (str, delimiter = ',') => {
    var map = arrayToMap(str.split(delimiter));
    return (key) => !!map[key];
};

/*
    use exec to extract the captureGroups
*/
const exec = (target, extractor) => {
    var res = extractor.exec(target);
    if (res) {
        var [_, ...captureGroups] = res;
        return captureGroups;
    }
    return null;
};

/*
    remove an element from array , if not exist return false , or return true
*/
const removeFromArray = (arr, item) => {
    var index = arr.indexOf(item);
    if (index < 0)
        return false;
    arr.splice(index, 1);
    return true;
};
const extend$1 = Object.assign;

const keys = (value) => value ? Object.keys(value) : EMPTY_ARR;

const HTML_TAGS = 'html,body,base,head,link,meta,title,address,article,aside,footer,' +
    'header,h1,h2,h3,h4,h5,h6,nav,section,div,dd,dl,dt,figcaption,' +
    'figure,picture,hr,img,li,main,ol,p,pre,ul,a,b,abbr,bdi,bdo,br,cite,code,' +
    'data,dfn,em,i,kbd,mark,q,rp,rt,ruby,s,samp,small,span,strong,sub,sup,' +
    'time,u,var,wbr,area,audio,map,track,video,embed,object,param,source,' +
    'canvas,script,noscript,del,ins,caption,col,colgroup,table,thead,tbody,td,' +
    'th,tr,button,datalist,fieldset,form,input,label,legend,meter,optgroup,' +
    'option,output,progress,select,textarea,details,dialog,menu,' +
    'summary,template,blockquote,iframe,tfoot,area,base,br,col,embed,hr,img,input,link,meta,param,source,track,wbr';
const isHTMLTag = makeMap(HTML_TAGS);
const SVG_TAGS = 'svg,animate,animateMotion,animateTransform,circle,clipPath,color-profile,' +
    'defs,desc,discard,ellipse,feBlend,feColorMatrix,feComponentTransfer,' +
    'feComposite,feConvolveMatrix,feDiffuseLighting,feDisplacementMap,' +
    'feDistanceLight,feDropShadow,feFlood,feFuncA,feFuncB,feFuncG,feFuncR,' +
    'feGaussianBlur,feImage,feMerge,feMergeNode,feMorphology,feOffset,' +
    'fePointLight,feSpecularLighting,feSpotLight,feTile,feTurbulence,filter,' +
    'foreignObject,g,hatch,hatchpath,image,line,linearGradient,marker,mask,' +
    'mesh,meshgradient,meshpatch,meshrow,metadata,mpath,path,pattern,' +
    'polygon,polyline,radialGradient,rect,set,solidcolor,stop,switch,symbol,' +
    'text,textPath,title,tspan,unknown,use,view';
const isSVGTag = makeMap(SVG_TAGS);

// all is nodes
exports.Nodes = void 0;
(function (Nodes) {
    Nodes[Nodes["NULL"] = 0] = "NULL";
    Nodes[Nodes["FRAGMENT"] = 1] = "FRAGMENT";
    Nodes[Nodes["TEMPLATE"] = 2] = "TEMPLATE";
    Nodes[Nodes["IF"] = 3] = "IF";
    Nodes[Nodes["ELSE_IF"] = 4] = "ELSE_IF";
    Nodes[Nodes["ELSE"] = 5] = "ELSE";
    Nodes[Nodes["FOR"] = 6] = "FOR";
    Nodes[Nodes["HTML_ATTRIBUTE"] = 7] = "HTML_ATTRIBUTE";
    Nodes[Nodes["DOM_ELEMENT"] = 8] = "DOM_ELEMENT";
    Nodes[Nodes["SVG_ELEMENT"] = 9] = "SVG_ELEMENT";
    Nodes[Nodes["HTML_COMMENT"] = 10] = "HTML_COMMENT";
    Nodes[Nodes["TEXT"] = 11] = "TEXT";
    Nodes[Nodes["HTML_ELEMENT"] = 12] = "HTML_ELEMENT";
    Nodes[Nodes["COMPONENT"] = 13] = "COMPONENT";
    Nodes[Nodes["STYLE"] = 14] = "STYLE";
    // class contain dynamic class and static class
    Nodes[Nodes["CLASS"] = 15] = "CLASS";
    Nodes[Nodes["DYNAMIC_CLASS"] = 16] = "DYNAMIC_CLASS";
    Nodes[Nodes["STATIC_CLASS"] = 17] = "STATIC_CLASS";
    Nodes[Nodes["AT"] = 18] = "AT";
    Nodes[Nodes["MEDIA_RULE"] = 19] = "MEDIA_RULE";
    Nodes[Nodes["SUPPORTS_RULE"] = 20] = "SUPPORTS_RULE";
    Nodes[Nodes["KEYFRAMES_RULE"] = 21] = "KEYFRAMES_RULE";
    Nodes[Nodes["EVENT"] = 22] = "EVENT";
    Nodes[Nodes["STYLE_RULE"] = 23] = "STYLE_RULE";
    Nodes[Nodes["KEYFRAME_RULE"] = 24] = "KEYFRAME_RULE";
    /*
     declarationGroup is contain declaratin and mixin
    */
    Nodes[Nodes["DECLARATION_GROUP"] = 25] = "DECLARATION_GROUP";
    Nodes[Nodes["DECLARATION"] = 26] = "DECLARATION";
    Nodes[Nodes["MIXIN"] = 27] = "MIXIN";
    Nodes[Nodes["UNKNOWN"] = 28] = "UNKNOWN";
    Nodes[Nodes["DIRECTIVE_FLAG"] = 29] = "DIRECTIVE_FLAG";
    Nodes[Nodes["BUILTIN_DIRECTIVE"] = 30] = "BUILTIN_DIRECTIVE";
    Nodes[Nodes["CUSTOM_DIRECTIVE"] = 31] = "CUSTOM_DIRECTIVE";
    // use slot
    Nodes[Nodes["SLOT"] = 32] = "SLOT";
    // define slot
    Nodes[Nodes["DEFINE_SLOT"] = 33] = "DEFINE_SLOT";
})(exports.Nodes || (exports.Nodes = {}));
/*
    input nodeType return nodeKeyword
    input nodeKeyword return nodeType
*/
exports.NodesMap = void 0;
(function (NodesMap) {
    NodesMap[NodesMap["if"] = 3] = "if";
    NodesMap[NodesMap["elseIf"] = 4] = "elseIf";
    NodesMap[NodesMap["else"] = 5] = "else";
    NodesMap[NodesMap["for"] = 6] = "for";
    NodesMap[NodesMap["..."] = 27] = "...";
    NodesMap[NodesMap["@"] = 18] = "@";
    NodesMap[NodesMap["--"] = 29] = "--";
    NodesMap[NodesMap["media"] = 19] = "media";
    NodesMap[NodesMap["keyframes"] = 21] = "keyframes";
    NodesMap[NodesMap["supports"] = 20] = "supports";
    NodesMap[NodesMap["style"] = 14] = "style";
    NodesMap[NodesMap["class"] = 15] = "class";
    NodesMap[NodesMap["template"] = 2] = "template";
    NodesMap[NodesMap["slot"] = 32] = "slot";
    NodesMap[NodesMap["defineSlot"] = 33] = "defineSlot";
})(exports.NodesMap || (exports.NodesMap = {}));
const directiveTypeOf = (dirName) => {
    return exports.NodesMap[dirName] || exports.Nodes.CUSTOM_DIRECTIVE;
};
const tagTypeOf = (tagName) => {
    return exports.NodesMap[tagName] ||
        (isHTMLTag(tagName) ?
            exports.Nodes.HTML_ELEMENT : isSVGTag(tagName) ?
            exports.Nodes.SVG_ELEMENT : exports.Nodes.COMPONENT);
};

function createNode(type) {
    return {
        type
    };
}
(({
    type: exports.Nodes.NULL,
    tag: Symbol('empty')
}));
var createElement = (tag, props, children, key) => {
    return {
        tag,
        props,
        children,
        key,
        type: exports.Nodes.HTML_ELEMENT,
    };
};
var Text = Symbol('Text');
var createText = (children, key) => {
    return {
        key,
        tag: Text,
        children,
        type: exports.Nodes.TEXT
    };
};
var createSVGElement = () => { };
var createComment = () => { };
var createFragment = (children, key) => {
    return {
        type: exports.Nodes.FRAGMENT,
        children,
        key
    };
};
var createStyleSheet = (props, children, key = uid()) => {
    var node = createNode(exports.Nodes.STYLE);
    node.props = props;
    node.children = children;
    node.key = key;
    node.tag = 'style'; // used for diff
    return node;
};
var createStyle = (selector, children, key) => {
    return {
        type: exports.Nodes.STYLE_RULE,
        selector,
        children,
        key
    };
};
var createMedia = (media, children, key) => ({
    type: exports.Nodes.MEDIA_RULE,
    media,
    children,
    key
});
var createKeyframes = (keyframes, children, key = uid()) => {
    var node = createNode(exports.Nodes.KEYFRAMES_RULE);
    node.keyframes = keyframes;
    node.children = children;
    node.key = key;
    return node;
};
var createKeyframe = (keyframe, children, key = uid()) => {
    var node = createNode(exports.Nodes.KEYFRAME_RULE);
    node.keyframe = keyframe;
    node.children = children;
    node.key = key;
    return node;
};
const createComponent = (tag, props, children, key = uid()) => {
    var node = createNode(exports.Nodes.COMPONENT);
    node.tag = tag;
    node.props = props;
    node.children = children;
    node.key = key;
    return node;
};
var createSupports = (supports, children, key) => ({
    type: exports.Nodes.SUPPORTS_RULE,
    supports,
    children,
    key
});
var createDeclaration = (children, key) => {
    return {
        type: exports.Nodes.DECLARATION,
        /*
            render function 生成vdom时，会直接合并declaration和mixin，所以此时不再存在declaration group，而是用declaration替代 ， 在进行flat处理时也不会存在declarationgroup
        */
        //type: Nodes.DECLARATION_GROUP,
        children,
        key
    };
};

// compiler helper
class Scanner {
    constructor(source) {
        this.source = source;
        this.move(0); // cut the space
    }
    source;
    move(step) {
        this.source = this.source.slice(step).trimLeft();
    }
    expect(expect, index = 0) {
        return this.source.slice(index, expect.length + index) === expect;
    }
    startsWith(expect) {
        // same as use expect without the second arg
        return this.source.startsWith(expect);
    }
    exec(extractor) {
        var res = extractor.exec(this.source);
        if (!res) {
            return false;
        }
        else {
            var [{ length }, ...token] = res;
            this.move(length);
            return token;
        }
    }
}
const createScanner = (source) => new Scanner(source);

const createAsb = (type) => ({ type });

const openTag = /^<([\w-]+)(?:\:(\w+))?/;
/*
    return the tagName and the modifier,
    tips: when use inline-template, the endtag must contain the same modifier as open , or it will throw a compile error,
*/
const closeTagEx = /^<\/([\w-]+)(?:\:\w+)?\s*>/;
const comment = /<!--((.|[\r\n])*?)-->/;
// capture the mushache first 
const baseAttr = /([^=\s>]+)\s*(?:=\s*(["'])([^\2]*?)\2)?/;
/* there is always return an array of the astTree, althrough only one root node */
const parseHTML = (source) => {
    var scanner = createScanner(source);
    var ast = [], attributes, attributeMap, inOpen = false, tag, modifier; /* extend feature */
    while (scanner.source) {
        if (scanner.expect('<')) {
            if (scanner.expect('/', 1)) {
                var closeTag = scanner.exec(closeTagEx)[0];
                for (var i = ast.length - 1; i >= 0; i--) {
                    if (ast[i].closed)
                        continue;
                    if (ast[i].tag === closeTag) {
                        ast[i].closed = true;
                        var children = ast.splice(i + 1);
                        if (children.length) {
                            ast[i].children = children;
                        }
                        break;
                    }
                }
            }
            else if (scanner.expect('!', 1)) {
                var asb = createAsb(exports.Nodes.HTML_COMMENT);
                asb.children = scanner.exec(comment)[0];
                ast.push(createAsb(exports.Nodes.HTML_COMMENT));
            }
            else {
                [tag, modifier] = scanner.exec(openTag);
                inOpen = true;
            }
        }
        else if (inOpen) {
            if (scanner.expect('/')) {
                /* there is not must for decide a opentag is close or not by '/', so just forget it */
                scanner.move(1);
            }
            else if (scanner.expect('>')) {
                var asb = createAsb(exports.Nodes.DOM_ELEMENT);
                asb.tag = tag;
                asb.tagName = camelize(tag);
                asb.modifier = modifier;
                asb.closed = false;
                asb.attributes = attributes;
                asb.attributeMap = attributeMap;
                ast.push(asb);
                attributes = null;
                attributeMap = null;
                inOpen = false;
                scanner.move(1);
            }
            else {
                /* catch attribute */
                var [attribute, _, value] = scanner.exec(baseAttr);
                var asb = createAsb(exports.Nodes.HTML_ATTRIBUTE);
                asb.attribute = attribute;
                asb.value = value;
                (attributes ||= []).push(asb);
                (attributeMap ||= getEmptyMap())[attribute] = value;
            }
        }
        else { // text
            var textEndsWithTag = /([\s\S]*?)<(\/?)[\w-]+/;
            var textToken, text;
            if ((textToken = textEndsWithTag.exec(scanner.source))) {
                text = textToken[1];
                scanner.move(text.length);
            }
            else {
                // text为结尾 , 直接读取所有内容，并清空
                text = scanner.source;
                scanner.source = '';
            }
            var asb = createAsb(exports.Nodes.TEXT);
            asb.children = text;
            ast.push(asb);
        }
    }
    return ast;
};

// we can use $(exp) as a dynamic content
var extractDynamicSelector = /\$\(([^\)s]*)\)/g;
function parseSelector(selector) {
    var isDynamic = false;
    return {
        selectorText: selector.replace(extractDynamicSelector, (_, content) => {
            isDynamic = true;
            return '${' + content + '}';
        }),
        isDynamic
    };
}

/*
    color : red ;
    color!:red; important
    $color : variable ; support string,array,number
    (variable) : red ;
    $(variable) : variable ;
*/
const extractDeclarationProperty = /(\$)?(\()?([\w-]+)(\))?(!)?/;
const parseDeclaration = (rawProperty, value) => {
    var [_, isDynamicValue, l, property, r, isImportant] = extractDeclarationProperty.exec(rawProperty);
    return {
        //property: camelize(property), setProperty must use - , so no need to camelize
        // property, 
        property: camelize(property),
        value,
        isDynamicValue,
        isDynamicProperty: l && r,
        isImportant
    };
};

const extIteratorExp = /(?:[\{\[\(]?)([\w,]+)(?:[\}\]\)]?)\s*(?:in|of)\s*(.+)/;
const parseIterator = (expression) => {
    const [_, items, iterable] = extIteratorExp.exec(expression);
    return {
        iterable,
        items: items.split(',')
    };
};

const selectorRE = /^([^{};]*)(?<!\s)\s*{/;
const declarationRE = /([$\w!-\]\[]+)\s*:\s*([^;]+);/;
const AtRule = /^@([\w]+)\s*([^{]+)(?<!\s)\s*{/;
const mixinEx = /\.\.\.([^;]+);/;
const CSSDir = /^([\w-]+)\s*(?:\(([^{]*)\))?\s*{/;
/*
    判断是否已保留字开头，来决定是否为指令，不需要再用 '--' 标识
*/
const cssReservedWord = /^(if|else-if|else|for|elseIf)/;
const parseCSS = (source) => {
    var scanner = createScanner(source);
    var ast = [], stack = [], exResult, current, parent = null, closing = false, declarationGroup;
    while (scanner.source) {
        if (scanner.startsWith('}')) {
            closing = true;
        }
        else if (scanner.startsWith(exports.NodesMap[exports.Nodes.AT])) {
            /*
                media conditions
            */
            var [type, content] = scanner.exec(AtRule);
            const nodeType = exports.NodesMap[type];
            var asb = createAsb(nodeType);
            if (nodeType === exports.Nodes.MEDIA_RULE) {
                asb.media = content;
            }
            else if (nodeType === exports.Nodes.KEYFRAMES_RULE) {
                asb.keyframes = content;
            }
            else if (nodeType === exports.Nodes.SUPPORTS_RULE) {
                asb.supports = content;
            }
            current = asb;
        }
        else if (scanner.expect('/*')) ;
        else if (scanner.startsWith(exports.NodesMap[exports.Nodes.MIXIN])) {
            var [mixin] = scanner.exec(mixinEx);
            var asb = createAsb(exports.Nodes.MIXIN);
            asb.mixin = mixin;
            (declarationGroup ||= []).push(asb);
            continue;
        }
        else if (cssReservedWord.test(scanner.source)) {
            /*
                处理指令，指令不再需要通过标识符去判断
            */
            var [dir, content] = scanner.exec(CSSDir);
            var dirType = exports.NodesMap[camelize(dir)];
            var asb = createAsb(dirType);
            switch (dirType) {
                case exports.Nodes.FOR:
                    asb.iterator = parseIterator(content);
                    break;
                case exports.Nodes.IF:
                    asb.condition = content;
                    asb.isBranchStart = true;
                    break;
                case exports.Nodes.ELSE_IF:
                    asb.condition = content;
                    asb.isBranch = true;
                    break;
                case exports.Nodes.ELSE:
                    asb.isBranch = true;
                    break;
            }
            current = asb;
        }
        else if (exResult = scanner.exec(selectorRE)) {
            /*
                try to get the selector
            */
            var asb = createAsb(exports.Nodes.STYLE_RULE);
            asb.selector = parseSelector(exResult[0]);
            current = asb;
        }
        else if (exResult = scanner.exec(declarationRE)) {
            /*
                the last declaration must end with  " ; "
            */
            var declaration = parseDeclaration(exResult[0], exResult[1]);
            var asb = createAsb(exports.Nodes.DECLARATION);
            asb.declaration = declaration;
            (declarationGroup ||= []).push(asb);
            continue;
        }
        else {
            /* error */
            debugger;
        }
        /* process the relation , with cascading struct */
        if (declarationGroup) {
            var asb = createAsb(exports.Nodes.DECLARATION_GROUP);
            asb.children = declarationGroup;
            asb.parent = parent;
            (parent.children ||= []).push(asb);
            declarationGroup = null;
        }
        if (closing) {
            stack.pop();
            parent = stack[stack.length - 1];
            scanner.move(1);
            closing = false;
            continue;
        }
        if (!parent) {
            // while there is no parent , the currentDeclaration is meaningless
            ast.push(current);
        }
        else {
            var children = parent.children ||= [];
            current.parent = parent;
            children.push(current);
        }
        stack.push(current);
        parent = current;
    }
    return ast;
};

var mustache = /\{\{(.*?)\}\}/g;
var parseText = (text) => {
    var texts = [];
    var cursor = 0;
    var execArr;
    while (execArr = mustache.exec(text)) {
        if (execArr.index > cursor) {
            texts.push({
                content: text.slice(cursor, execArr.index),
                isDynamic: false
            });
        }
        if (execArr[1]) {
            texts.push({
                content: execArr[1],
                isDynamic: true
            });
        }
        cursor = execArr[0].length + execArr.index;
    }
    if (cursor < text.length) {
        texts.push({
            content: text.slice(cursor),
            isDynamic: false
        });
    }
    return texts;
};

const NULL = 'null';
const toBackQuotes = (_) => '`' + _ + '`';
const toCodeString$1 = (_) => "'" + _ + "'";
/*  use JSON.stringify will fill the " in every propertynames */
const objectStringify = (target) => {
    return '{' +
        Object.entries(target).map(([property, value]) => {
            return property + ':' + (isObject(value) ? objectStringify(value) : isArray(value) ? toArray(value) : value);
        }).join(',')
        + '}';
};
const stringify = (target) => {
    if (isString(target)) {
        return target;
    }
    else if (isArray(target)) {
        return `[${target.map(stringify).join(',')}]`;
    }
    else if (isObject(target)) {
        return '{' +
            Object.entries(target).map(([property, value]) => {
                return property + ':' + stringify(value);
            }).join(',')
            + '}';
    }
    else {
        return String(target);
    }
};
const toArrowFunction = (returned, params = []) => {
    return `(${params.join(',')})=>(${returned})`;
};
const toArray = (items) => `[${items.join(',')}]`;
const dynamicMapKey = (key) => `[${key}]`;
const callFn = (fnName, ...params) => `${fnName}(${params.join(',')})`;
const ternaryExp = (condition, ifTrue, ifFalse) => `${condition}?(${ifTrue}):(${ifFalse})`;
function ternaryChains(conditions, returns, falseDefault = 'undefined', index = 0) {
    return ternaryExp(conditions[index], returns[index], index < conditions.length - 1 ? ternaryChains(conditions, returns, falseDefault, ++index) : (returns[index + 1] || falseDefault));
}
var declare = (name, value) => `const ${name} = ${value} ;`;

const inlineStyleDelimiter$1 = /\s*[:;]\s*/;
function parseInlineStyle$1(styleString) {
    var chips = styleString.split(inlineStyleDelimiter$1).filter(Boolean);
    var l = chips.length;
    var styleMap = {};
    while (l) {
        styleMap[camelize(chips[l - 2])] = toCodeString$1(chips[l - 1]);
        l -= 2;
    }
    return styleMap;
}
const inlineClassDelimiter$1 = /\s+/;
const parseInlineClass$1 = (classString) => stringToMap(classString, inlineClassDelimiter$1);

/*-----------------------------------------------------------------------------------------*/
const extAttribute = /(@|\$|-{2}|\.|#)?(\()?([\w-]+)(\))?(?::([\w:]+))?(?:\.([\w\.]+))?/;
/*
    如果是函数表达式，生成代码时不需要包裹一层函数
*/
// legal variable name
var varRE = /^\w+$/;
// arrow function
var arrowFnRE = /\(?[\w,\s]*\)?\s*=>\s*.*/;
// normal function
var fnRE = /function[\w\s]*\([\w,\s]*\)\s*{.*}/;
// array
var arrayRE = /\[.*\]/;
function isHandler(exp) {
    return varRE.test(exp) || arrowFnRE.test(exp) || fnRE.test(exp) || arrayRE.test(exp);
}
const processAttribute = (node) => {
    const { type, attributes } = node;
    if (!attributes)
        return;
    for (let i = 0; i < attributes.length; i++) { // not destructur becasue keep the node
        const attr = attributes[i];
        var exResult = exec(attr.attribute, extAttribute);
        var [flag, l, property, r, argumentStr, modifierStr] = exResult;
        attr.property = property;
        attr.value = attr.value;
        attr.isDynamicProperty = l && r;
        attr.isDynamicValue = flag === '$';
        attr.modifiers = modifierStr && modifierStr.split('.');
        attr._arguments = argumentStr && argumentStr.split(':');
        // process directive
        if (flag === exports.NodesMap[exports.Nodes.DIRECTIVE_FLAG]) {
            // directive effect the root node
            var dirName = camelize(property);
            const dirType = directiveTypeOf(dirName);
            attr.type = dirType;
            switch (dirType) {
                case exports.Nodes.IF:
                    if (!node.dirs) {
                        //  此时为元素的第一个指令为if ， 最外层的分支指令会注入到元素节点 ， 在代码生成时用作判断处理
                        node.condition = attr.value;
                        node.isBranchStart = true;
                    }
                    else {
                        attr.condition = attr.value;
                        node.dirs.push(attr);
                    }
                    break;
                case exports.Nodes.ELSE_IF:
                    if (!node.dirs) {
                        node.condition = attr.value;
                        node.isBranch = true;
                    }
                    break;
                case exports.Nodes.ELSE:
                    if (!node.dirs) {
                        node.isBranch = true;
                    }
                    break;
                case exports.Nodes.FOR:
                    attr.iterator = parseIterator(attr.value);
                    (node.dirs ||= []).push(attr);
                    break;
                case exports.Nodes.SLOT:
                    (node.dirs ||= []).push(attr);
                    break;
                case exports.Nodes.DEFINE_SLOT:
                    (node.dirs ||= []).push(attr);
                    break;
                case exports.Nodes.CUSTOM_DIRECTIVE:
                    // 只有自定义指令支持动态指令
                    (node.customDirs ||= []).push(attr);
                    break;
            }
            /*
                attributes 中的内置和自定义指令都会被移出
                编译时指令放在dirs中，
                内置或自定义指令放在customDirs中
            */
            removeFromArray(attributes, attr);
            i--;
            // 因为删除了数组中的元素，所以指针回退一步
        }
        else if (flag === exports.NodesMap[exports.Nodes.AT]) {
            attr.type = exports.Nodes.EVENT;
            // 为 true时代表是一个合法的handler可以直接生成代码，否则需要套一层函数
            attr.isHandler = isHandler(attr.value);
        }
        else if (flag === '#') {
            /*
                #app => id="app"
                #(x) => $id="x"
            */
            attr.value = attr.property;
            attr.property = 'id';
            attr.isDynamicValue = attr.isDynamicProperty;
            attr.isDynamicProperty = false;
        }
        else if (flag === '.') {
            // class 简写形式
            attr.type = exports.Nodes.CLASS;
            if (attr.isDynamicProperty) {
                attr.value = attr.property;
            }
            else {
                attr.value = parseInlineClass$1(attr.property);
            }
        }
        else if (property === exports.NodesMap[exports.Nodes.CLASS]) {
            // contain dynamic class and static class
            attr.type = exports.Nodes.CLASS;
            if (!attr.isDynamicValue) {
                attr.value = parseInlineClass$1(attr.value);
            }
        }
        else if (property === exports.NodesMap[exports.Nodes.STYLE]) {
            attr.type = exports.Nodes.STYLE;
            if (!attr.isDynamicValue) {
                attr.value = parseInlineStyle$1(attr.value);
            }
        }
        else ;
    }
};

/*
    extend the selectors and process keyframes
*/
const processRules = (rules, isKeyframe = false) => {
    rules.forEach((rule) => {
        switch (rule.type) {
            case exports.Nodes.STYLE_RULE:
                const { selector, parent } = rule;
                if (isKeyframe) {
                    rule.type = exports.Nodes.KEYFRAME_RULE;
                }
                else {
                    var extendSelectors = parent?.selectors;
                    if (extendSelectors) {
                        rule.selectors = [...extendSelectors, selector];
                    }
                    else {
                        rule.selectors = [selector];
                    }
                }
                break;
            case exports.Nodes.IF:
            case exports.Nodes.ELSE_IF:
            case exports.Nodes.ELSE:
            case exports.Nodes.FOR:
            case exports.Nodes.MEDIA_RULE:
            case exports.Nodes.SUPPORTS_RULE:
                rule.selectors = rule.parent?.selectors;
                break;
            case exports.Nodes.KEYFRAMES_RULE:
                isKeyframe = true;
                break;
        }
        if (rule.children) {
            processRules(rule.children, isKeyframe);
        }
    });
};

const parseTemplate = (template) => {
    var htmlAst = parseHTML(template);
    parseNodes(htmlAst);
    return htmlAst;
};
const parseNodes = (nodes, ctx = {
    ignoreChildren: false,
}) => {
    nodes.forEach((node) => {
        parseNode(node, ctx);
        if (isArray(node.children) && !ctx.ignoreChildren) {
            parseNodes(node.children, ctx);
        }
        // reset status
        ctx.ignoreChildren = false;
    });
};
function parseNode(node, ctx) {
    const type = node.type;
    if (type === exports.Nodes.DOM_ELEMENT) {
        const tagType = tagTypeOf(node.tagName);
        node.type = tagType;
        switch (tagType) {
            case exports.Nodes.HTML_ELEMENT:
                processAttribute(node);
                break;
            case exports.Nodes.COMPONENT:
                processAttribute(node);
                break;
            case exports.Nodes.SVG_ELEMENT:
                break;
            case exports.Nodes.STYLE:
                processAttribute(node);
                var template = node.children?.[0].children;
                if (template) {
                    var styleAst = parseCSS(template);
                    processRules(styleAst);
                    node.children = styleAst;
                    ctx.ignoreChildren = true;
                }
                break;
            case exports.Nodes.IF:
                node.condition = node.attributeMap['condition'];
                node.isBranchStart = true;
                break;
            case exports.Nodes.ELSE_IF:
                node.condition = node.attributeMap['condition'];
                node.isBranch = true;
                break;
            case exports.Nodes.ELSE:
                node.isBranch = true;
                break;
            case exports.Nodes.FOR:
                node.iterator = parseIterator(node.attributeMap['iterator']);
                break;
            case exports.Nodes.TEMPLATE:
                processAttribute(node);
                break;
            case exports.Nodes.SLOT:
                break;
            case exports.Nodes.DEFINE_SLOT:
                break;
        }
    }
    else if (type === exports.Nodes.TEXT) {
        node.children = parseText(node.children);
        ctx.ignoreChildren = true;
        return;
    }
    else if (type === exports.Nodes.HTML_COMMENT) ;
}

var renderMethods$1 = {
    createComment,
    createElement,
    createFragment,
    createKeyframe,
    createKeyframes,
    createMedia,
    createSVGElement,
    createStyleSheet,
    createStyle,
    createText,
    renderList,
    mergeSelectors,
    display,
    createDeclaration,
    mixin,
    important,
    createSupports,
    flatRules,
    createComponent,
    getComponent,
    getDirective,
    getCurrentScope,
    createEvent,
    createHandlerKey,
    normalizeClass,
    normalizeStyle,
    renderSlot,
    injectDirective,
    injectDirectives
};
const renderMethodsNameMap = Object.entries(renderMethods$1).reduce((res, [name, method]) => {
    res[name] = method.name;
    return res;
}, {});

// rebuilding
const groupSelectorDelimiter = /\s*,\s*/;
const splitSelector = (selector) => selector.split(groupSelectorDelimiter);
const joinSelector = (splitedSelector) => splitedSelector.join(',');
function mergeSelector(p, c) {
    var ref = false; // is using & 
    var merged = c.replace('&', () => {
        ref = true;
        return p;
    });
    return ref ? merged : p + ' ' + c; // default merge
}
/*
    ['header','footer'] , ['h1','h2'] ===> ['header h1' , 'header h2' , 'footer h1' , 'footer h2']
*/
function mergeSplitedSelector(parent, children) {
    return parent.map((p) => {
        return children.map((c) => mergeSelector(p, c));
    }).reduce((x, y) => x.concat(y));
}
const mergeSplitedSelectors = (...selectors) => selectors.reduce(mergeSplitedSelector);
const mergeSplitedSelectorsAndJoin = (...selectors) => joinSelector(mergeSplitedSelectors(...selectors));
function mergeSelectors(...selectors) {
    return mergeSplitedSelectors(...selectors.map(splitSelector)).join(',');
}

// the code Entrance
const genNodes = (nodes, context) => {
    if (!nodes) {
        return NULL;
    }
    const children = genChildren(nodes, context);
    if (children.length === 0) {
        return 'null';
    }
    else if (children.length === 1) {
        return children[0];
    }
    else {
        return genFragment(stringify(children), context);
    }
};
/*
    process if elseIf else branch
*/
function genChildren(nodes, context) {
    if (!nodes) {
        return [];
    }
    /*
        process the condition branch and the first dir is condition ,
        处理分支时会为if边际上branch start ， elseif else 标记为branch，或者元素的第一个指令为分支
    */
    var children = [];
    var inBranch = false;
    nodes.forEach((node) => {
        /*
            branchstart mean if frgment and if the element has the first directive is if
        */
        if (node.isBranchStart) {
            children.push([node]);
            inBranch = true;
        }
        else if (node.isBranch) {
            if (inBranch) {
                children[children.length - 1].push(node);
            }
        }
        else {
            children.push(genNode(node, context));
            inBranch = false;
        }
    });
    children = children.map((child) => {
        if (isArray(child)) {
            const branchCondition = child.map((b) => b.condition).filter(Boolean); // 勇于筛除else的condition ， 其他应该在之前就报错
            const branchContent = child.map((b) => genNode(b, context));
            return ternaryChains(branchCondition, branchContent);
        }
        else {
            return child;
        }
    });
    return children;
}
const genFor = (target, iterator, context) => context.callRenderFn(renderMethodsNameMap.renderList, iterator.iterable, toArrowFunction(target, iterator.items), uStringId() /* 显示的在迭代器中传入掺入一个key，每次渲染时这个key不变，并且子节点会根据索引生成唯一key,只需要子层级即可 */);
const genIf = (target, condition) => ternaryExp(condition, target, 'null');
function genForWithFragment(target, iterator, context) {
    return genFragment(genFor(target, iterator, context), context);
}
const genDirectives = (target, dirs, context) => {
    /*
        there is no possible to exist else-if or else
    */
    if (dirs.length === 0) {
        return target;
    }
    else {
        // from end to start
        var dir = dirs[dirs.length - 1];
        dirs.pop();
        switch (dir.type) {
            case exports.Nodes.IF:
                target = genIf(target, dir.condition);
                break;
            case exports.Nodes.FOR:
                target = genForWithFragment(target, dir.iterator, context);
                break;
            case exports.Nodes.SLOT:
                // where there is a slot directive on a element or component , the target will be the backup content
                var slotName = toBackQuotes(dir.value || 'default');
                target = context.callRenderFn(renderMethodsNameMap.renderSlot, slotName, target);
                break;
            case exports.Nodes.DEFINE_SLOT:
                debugger;
                break;
        }
        return genDirectives(target, dirs, context);
    }
};
function genCustomDirectives(code, customDirs, context) {
    // injectDirective
    var dirs = customDirs.map((directive) => {
        var { property, value, isDynamicProperty, _arguments, modifiers } = directive;
        // 支持动态指令
        var dir = context.callRenderFn(renderMethodsNameMap.getDirective, isDynamicProperty ? property : toCodeString$1(property));
        if (!isDynamicProperty) {
            dir = context.hoistExpression(dir);
        }
        var dirInfos = {
            value,
            _arguments: _arguments && _arguments.map(toCodeString$1),
            modifiers: modifiers && modifiers.map(toCodeString$1)
        };
        return [dir, dirInfos];
    });
    return context.callRenderFn(renderMethodsNameMap.injectDirectives, code, stringify(dirs));
}
function genChildrenString(children, context) {
    if (!children)
        return NULL;
    return stringify(genChildren(children, context));
}
function genDirs(code, node, context) {
    if (node.customDirs) {
        code = genCustomDirectives(code, node.customDirs, context);
    }
    if (node.dirs) {
        code = genDirectives(code, node.dirs, context);
    }
    return code;
}
function genNode(node, context) {
    switch (node.type) {
        case exports.Nodes.IF:
        case exports.Nodes.ELSE_IF:
        case exports.Nodes.ELSE:
            return genNodes(node.children, context);
        case exports.Nodes.FOR:
            // use the fragment , cause the iterator will set the u key in each node , 
            return genForWithFragment(genNodes(node.children, context), node.iterator, context);
        case exports.Nodes.TEMPLATE:
            var code = genNodes(node.children, context);
            if (node.dirs) {
                code = genDirectives(code, node.dirs, context);
            }
            return code;
        case exports.Nodes.SLOT:
            var slotName = toBackQuotes(node.attributeMap?.name || 'default');
            var backup = genNodes(node.children, context);
            return context.callRenderFn(renderMethodsNameMap.renderSlot, slotName, backup);
        case exports.Nodes.DEFINE_SLOT:
            debugger;
            break;
        case exports.Nodes.HTML_ELEMENT:
            var code = context.callRenderFn(renderMethodsNameMap.createElement, toBackQuotes(node.tagName), genProps(node, context), genChildrenString(node.children, context), uStringId());
            code = genDirs(code, node, context);
            return code;
        case exports.Nodes.SVG_ELEMENT:
            debugger;
            return context.callRenderFn(renderMethodsNameMap.createSVGElement);
        case exports.Nodes.COMPONENT:
            var code = context.callRenderFn(renderMethodsNameMap.getComponent, toBackQuotes(node.tagName));
            var uv = context.hoistExpression(code);
            var props = genProps(node, context);
            // var slots = genChildren(node.children, context)
            // debugger
            code = context.callRenderFn(renderMethodsNameMap.createComponent, uv, props, NULL, uStringId());
            code = genDirs(code, node, context);
            return code;
        case exports.Nodes.TEXT:
            return genText(node.children, context);
        case exports.Nodes.STYLE:
            var code = context.callRenderFn(renderMethodsNameMap.createStyleSheet, 'null', stringify(genChildren(node.children, context)), uStringId());
            if (node.dirs) {
                code = genDirectives(code, node.dirs, context);
            }
            if (node.customDirs) {
                code = genCustomDirectives(code, node.customDirs, context);
            }
            return code;
        case exports.Nodes.STYLE_RULE:
            return context.callRenderFn(renderMethodsNameMap.createStyle, genSelector(node.selectors, context), stringify(genChildren(node.children, context)), uStringId());
        case exports.Nodes.MEDIA_RULE:
            const rules = stringify(genChildren(node.children, context));
            return context.callRenderFn(renderMethodsNameMap.createMedia, toBackQuotes(node.media), rules, uStringId());
        case exports.Nodes.KEYFRAMES_RULE:
            return context.callRenderFn(renderMethodsNameMap.createKeyframes, toBackQuotes(node.keyframes), stringify(genChildren(node.children, context)), uStringId());
        case exports.Nodes.KEYFRAME_RULE:
            return context.callRenderFn(renderMethodsNameMap.createKeyframe, toBackQuotes(node.selector.selectorText), stringify(genChildren(node.children, context)), uStringId());
        case exports.Nodes.SUPPORTS_RULE:
            return context.callRenderFn(renderMethodsNameMap.createSupports, toBackQuotes(node.supports), stringify(genChildren(node.children, context)), uStringId());
        case exports.Nodes.DECLARATION_GROUP:
            return context.callRenderFn(renderMethodsNameMap.createDeclaration, genDeclartion(node.children, context), uStringId());
    }
}
const genFragment = (code, context) => context.callRenderFn(renderMethodsNameMap.createFragment, code, uStringId());
const genTextContent = (texts, context) => {
    return texts.map((text) => {
        return text.isDynamic ? context.callRenderFn(renderMethodsNameMap.display, text.content) : toBackQuotes(text.content);
    }).join('+');
};
const genText = (texts, context) => {
    return context.callRenderFn(renderMethodsNameMap.createText, genTextContent(texts, context), uStringId());
};
/*
    while there is unknown selectors
    header,footer ? h1,h2
*/
function genSelector(selectors, context) {
    /*
        先保留数组形式,再进行处理
    */
    var res = [];
    var lastIsStatic = false;
    selectors.forEach(({ selectorText, isDynamic }) => {
        if (isDynamic) {
            res.push(selectorText);
            lastIsStatic = false;
        }
        else {
            var splitedSelector = splitSelector(selectorText);
            if (lastIsStatic) {
                res[res.length - 1] = mergeSplitedSelector(res[res.length - 1], splitedSelector);
            }
            else {
                res.push(splitedSelector);
            }
            lastIsStatic = true;
        }
    });
    var selectorCode = res.map((item) => {
        if (isArray(item)) { // static
            return toBackQuotes(joinSelector(item));
        }
        else { // dynamic
            // scope  
            return toBackQuotes(item);
        }
    });
    return selectorCode.length === 1 ?
        selectorCode[0] :
        context.callRenderFn(renderMethodsNameMap.mergeSelectors, ...selectorCode);
    //! one dynamic selector will effect all 
}
// declaration and mixin
function genDeclartion(declarationGroup, context) {
    var res = [];
    var lastIsDeclaration = false;
    declarationGroup.forEach((declaration) => {
        if (declaration.type === exports.Nodes.MIXIN) {
            res.push(declaration.mixin);
            lastIsDeclaration = false;
        }
        else if (declaration.type === exports.Nodes.DECLARATION) {
            var target;
            if (lastIsDeclaration) {
                target = res[res.length - 1];
            }
            else {
                target = {};
                res.push(target);
                lastIsDeclaration = true;
            }
            const { property, value, isDynamicProperty, isDynamicValue, isImportant } = declaration.declaration;
            const _property = isDynamicProperty ? dynamicMapKey(property) : property;
            const _value = isDynamicValue ? value : toBackQuotes(value);
            const __value = isImportant ? context.callRenderFn(renderMethodsNameMap.important, _value) : _value;
            target[_property] = __value;
        }
    });
    const _res = res.map((item) => {
        if (isObject(item)) {
            return objectStringify(item);
        }
        else {
            return item;
        }
    });
    if (_res.length === 1) {
        return _res[0];
    }
    else {
        return context.callRenderFn(renderMethodsNameMap.mixin, ..._res);
    }
}
function genProps(node, context) {
    var { type, attributes } = node;
    if (!(attributes && attributes.length)) {
        // attributes may be an empty array , becasue the directives
        return NULL;
    }
    var props = {};
    attributes.forEach((attr) => {
        switch (attr.type) {
            case exports.Nodes.EVENT:
                var { property, isDynamicProperty, value, isHandler, /* if true , just use it , or wrap an arrow function */ argument, modifiers } = attr;
                var handlerKey = isDynamicProperty ?
                    dynamicMapKey(context.callRenderFn(renderMethodsNameMap.createHandlerKey, property, stringify(argument.map(toBackQuotes)))) :
                    createHandlerKey(property, argument);
                var callback = isHandler ? value : toArrowFunction(value);
                if (modifiers) {
                    callback = context.callRenderFn(renderMethodsNameMap.createEvent, callback, stringify(modifiers.map(toBackQuotes)));
                }
                props[handlerKey] = callback;
                break;
            case exports.Nodes.CLASS:
                var _class = props.class ||= [];
                _class.push(attr.value);
                break;
            case exports.Nodes.STYLE:
                var style = props.style ||= [];
                style.push(attr.value);
                break;
            case exports.Nodes.HTML_ATTRIBUTE:
                // normal attributes
                var { property, value, isDynamicProperty, isDynamicValue, } = attr;
                props[isDynamicProperty ? dynamicMapKey(property) : property] = isDynamicValue ? value : toBackQuotes(value);
                break;
        }
    });
    // merge class , there could be more than one class
    if (props.class) {
        props.class = context.callRenderFn(renderMethodsNameMap.normalizeClass, stringify(props.class));
    }
    if (props.style) {
        props.style = context.callRenderFn(renderMethodsNameMap.normalizeStyle, stringify(props.style));
    }
    return stringify(props);
}

const createFunction = (content, ...params) => new Function(...params, `${content}`);
class CodeGenerator {
    code;
    methods;
    constructor() {
        this.code = '';
        this.methods = {};
    }
    getCode = () => {
        this.unshift(declare(`{${Object.keys(this.methods).join(',')}}`, RENDER_METHODS));
        return this.code;
    };
    push = (code) => this.code += code;
    unshift = (code) => this.code = code + this.code;
    newLine = () => this.code += '\n';
    tab = () => this.code += '\t';
    pushNewLine(code) {
        this.newLine();
        this.push(code);
    }
    // input an expression and hoist to the context , and return the variable name
    hoistExpression(expression) {
        var varname = uVar();
        this.pushNewLine(declare(varname, expression));
        return varname;
    }
    callRenderFn(fn, ...args) {
        this.methods[fn] = true;
        return callFn(fn, ...args);
    }
}
const RENDER_METHODS = 'renderMethods';
const defaultCompilerConfig = {};
function compile(template, config = defaultCompilerConfig) {
    config &&= extend$1(defaultCompilerConfig, config);
    var ast = parseTemplate(template);
    console.log('nodeast', ast);
    var context = new CodeGenerator();
    // 初始化所有渲染方法
    var SCOPE = context.hoistExpression(context.callRenderFn(renderMethodsNameMap.getCurrentScope));
    const renderCode = genNodes(ast, context);
    const content = `
        with(${SCOPE}){
            return ${toArrowFunction(renderCode)} // the return function is render function
        }    
    `;
    context.pushNewLine(content);
    /*
        the dom template ast will alwways return an array
    */
    return createFunction(context.getCode(), RENDER_METHODS);
}

var activeEffect = null;
var shouldTrack = false;
var effectStack = [];
var targetMap = new WeakMap();
const SYMBOL_WITH = Symbol.unscopables;
class ReactiveEffect {
    fn = null;
    deps = [];
    scheduler = null;
    constructor(fn, options) {
        this.fn = fn;
        this.scheduler = options.scheduler;
    }
    cleanDeps() {
        this.deps.forEach((deps) => {
            deps.delete(this);
        });
        this.deps = [];
    }
    run() {
        effectStack.push(this);
        activeEffect = this;
        shouldTrack = true;
        this.cleanDeps();
        var res = this.fn();
        effectStack.pop();
        activeEffect = effectStack[effectStack.length - 1];
        return res;
    }
}
function effect(fn, options = {}) {
    var _effect = new ReactiveEffect(fn, options);
    if (!options.lazy) {
        _effect.run();
    }
    return _effect;
}
function track(target, key) {
    if (key === SYMBOL_WITH)
        return;
    if (!shouldTrack)
        return;
    if (!activeEffect)
        return;
    let depsMap = targetMap.get(target);
    if (!depsMap) {
        depsMap = new Map();
        targetMap.set(target, depsMap);
    }
    let deps = depsMap.get(key);
    if (!deps) {
        deps = new Set();
        depsMap.set(key, deps);
    }
    deps.add(activeEffect);
    activeEffect.deps.push(deps);
}
function trigger(target, key) {
    if (key === SYMBOL_WITH)
        return;
    const depsMap = targetMap.get(target);
    if (!depsMap)
        return;
    var deps = depsMap.get(key);
    if (!deps)
        return;
    // 克隆一份，防止死循环
    deps = new Set(deps);
    deps.forEach((e) => {
        if (e === activeEffect)
            return;
        if (e.scheduler) {
            e.scheduler(e);
        }
        else {
            e.run();
        }
    });
}
var handler = {
    get(target, key) {
        track(target, key);
        return target[key];
    },
    set(target, key, newValue) {
        trigger(target, key);
        target[key] = newValue;
        return true;
    }
};
function reactive(target) {
    return new Proxy(target, handler);
}
function watch(visitor, callback) {
    effect(visitor, {
        scheduler: () => {
            callback();
        }
    });
}

function injectHook(type, target, hook) {
    var hooks = (target[type] ||= []);
    if (!isArray(hooks)) {
        target[type] = [target[type]];
    }
    // the input hooks supports array
    if (isArray(hook)) {
        hooks = hooks.concat(hook);
    }
    else {
        hooks.push(hook);
    }
}
/*
    binding is used for bind the callback context , it is necessary
*/
function callHook(type, target, options = null, ...args) {
    const hooks = target[type];
    if (!hooks)
        return;
    var { binding, scheduler } = options || EMPTY_OBJ;
    hooks.forEach((hook) => {
        if (scheduler) {
            scheduler(hook, binding, ...args);
        }
        else {
            hook.apply(binding, args);
        }
    });
}
const createHook = (type) => (hook) => injectHook(type, getCurrentInstance(), hook);
const onMounted = createHook("mounted" /* MOUNTED */);

/*
    mixin supports
    ---
    same as directive

    mixin nesting

*/
function injectMixin(options, mixin) {
    for (let key in mixin) {
        switch (key) {
            case exports.ComponentOptionKeys.MIXINS:
                injectMixins(options, options[key]);
                break;
            case exports.ComponentOptionKeys.BEFORE_CREATE:
            case exports.ComponentOptionKeys.CREATE:
            case exports.ComponentOptionKeys.CREATED:
            case exports.ComponentOptionKeys.BEFORE_MOUNT:
            case exports.ComponentOptionKeys.MOUNTED:
            case exports.ComponentOptionKeys.BEFORE_UPDATE:
            case exports.ComponentOptionKeys.UPDATED:
            case exports.ComponentOptionKeys.BEFORE_UNMOUNT:
            case exports.ComponentOptionKeys.UNMOUNTED:
                injectHook(key, options, mixin[key]);
                break;
            default:
                debugger;
        }
    }
    // ! 
    return options;
}
function injectMixins(target, mixins) {
    mixins.forEach((mixin) => {
        injectMixin(target, mixin);
    });
    return target;
}

exports.ComponentOptionKeys = void 0;
(function (ComponentOptionKeys) {
    ComponentOptionKeys["BEFORE_CREATE"] = "beforeCreate";
    ComponentOptionKeys["CREATE"] = "create";
    // setup funcition
    ComponentOptionKeys["CREATED"] = "created";
    ComponentOptionKeys["BEFORE_MOUNT"] = "beforeMount";
    ComponentOptionKeys["MOUNTED"] = "mounted";
    ComponentOptionKeys["BEFORE_UPDATE"] = "beforeUpdate";
    ComponentOptionKeys["UPDATED"] = "updated";
    ComponentOptionKeys["BEFORE_UNMOUNT"] = "beforeUnmount";
    ComponentOptionKeys["UNMOUNTED"] = "unmounted";
    ComponentOptionKeys["TEMPLATE"] = "template";
    ComponentOptionKeys["RENDER"] = "render";
    ComponentOptionKeys["PROPS"] = "props";
    ComponentOptionKeys["MIXINS"] = "mixins";
    ComponentOptionKeys["COMPOENNTS"] = "components";
    ComponentOptionKeys["DIRECTIVES"] = "directives";
})(exports.ComponentOptionKeys || (exports.ComponentOptionKeys = {}));
const initOptions = (options) => {
    for (let key in options) {
        switch (key) {
            // root options only
            case exports.ComponentOptionKeys.TEMPLATE:
                options.createRender = compile(options[exports.ComponentOptionKeys.TEMPLATE]);
                console.log(options.createRender);
                break;
            case exports.ComponentOptionKeys.RENDER:
                // todo
                break;
            case exports.ComponentOptionKeys.CREATE:
            case exports.ComponentOptionKeys.CREATED:
            case exports.ComponentOptionKeys.BEFORE_MOUNT:
            case exports.ComponentOptionKeys.MOUNTED:
            case exports.ComponentOptionKeys.BEFORE_UPDATE:
            case exports.ComponentOptionKeys.UPDATED:
            case exports.ComponentOptionKeys.BEFORE_UNMOUNT:
            case exports.ComponentOptionKeys.UNMOUNTED:
                var option = options[key];
                // all lifecycle hooks should be an array in options or compoennt instance
                if (option && !isArray(option)) {
                    options[key] = [option];
                }
                break;
            case exports.ComponentOptionKeys.MIXINS:
                var mixins = options[key];
                injectMixins(options, mixins);
                break;
            case exports.ComponentOptionKeys.COMPOENNTS:
                break;
            case exports.ComponentOptionKeys.DIRECTIVES:
                break;
        }
    }
    options._isOptions = true;
};

const IMPORTANT_SYMBOL = Symbol('important');
const IMPORTANT_KEY = '!important';
const IMPORTANT = 'important';
/*
    input a value and return the important version ,
    so we can do this while useing dynamic binding
    body{
        $background-color : bg;
    }
    --- js
    bg = important('red')
    the same as
    bg = 'red !important'
    used for when use javascript stylesheet , we can set the declaration important
*/
function important(value) {
    return {
        value,
        [IMPORTANT_SYMBOL]: true
    };
}

const nodeOps = {
    insert: (child, parent, anchor = null) => {
        /* 可能传入不合理的anchor */
        if (anchor && anchor.parentElement !== parent) {
            anchor = null;
        }
        parent.insertBefore(child, anchor);
    },
    remove: (el) => {
        const parent = el.parentNode;
        if (parent) {
            parent.removeChild(el);
        }
    },
    setText() {
    },
    // style
    setProperty: (style, property, value, important = false) => style.setProperty(hyphenate(property), value, important ? IMPORTANT : ''),
    deleteRule: (sheet, index) => sheet.deleteRule(index)
};

function getDeclarationValue(rawValue) {
    var value, important = false;
    if (rawValue === undefined || rawValue === null) {
        value = null;
    }
    else if (rawValue[IMPORTANT_SYMBOL]) {
        value = rawValue.value;
        important = true;
    }
    else {
        value = rawValue;
        important = false;
    }
    if (isString(value) && value.endsWith(IMPORTANT_KEY)) {
        value = value.split(IMPORTANT_KEY)[0].trim();
        important = true;
    }
    // 支持数组
    if (isArray(value)) {
        value = value.join(' ');
    }
    return {
        value,
        important
    };
}
function updateDeclaration(pDeclaration, nDeclaration, style, vnode) {
    var delList = Object.keys(pDeclaration ||= EMPTY_OBJ);
    for (let property in nDeclaration) {
        var { value: pValue, important: pImportant } = getDeclarationValue(pDeclaration[property]);
        var { value: nValue, important: nImportant } = getDeclarationValue(nDeclaration[property]);
        if (pValue !== nValue || pImportant !== nImportant) { /* 当属性值不同并且important不同时均需要更新 */
            /*
                目前处理值只能处理字符串的属性值
            */
            nodeOps.setProperty(style, property, nValue, nImportant);
        }
        removeFromArray(delList, property);
    }
    delList.forEach((property) => nodeOps.setProperty(style, property, '')); // 清空旧的属性
}
function mountDeclaration(declaration, style, vnode) {
    updateDeclaration(EMPTY_OBJ, declaration, style);
}
function unmountDeclaration(declaration, style, vnode) {
    updateDeclaration(declaration, EMPTY_OBJ, style);
}

/*
    mountStyleSheet will create a style element
*/
const mountStyleSheet = (vnode, container) => {
    var ref = document.createElement('style');
    vnode.ref = ref;
    container.appendChild(ref);
    var sheet = ref.sheet;
    const rules = vnode.children;
    mountSheet(sheet, rules, vnode);
};
function mountSheet(sheet, rules, vnode) {
    rules.forEach((rule) => {
        mountRule(sheet, rule, vnode);
    });
}
function mountRule(sheet, rule, vnode, index = sheet.cssRules.length) {
    switch (rule.type) {
        case exports.Nodes.STYLE_RULE:
            mountStyleRule(sheet, rule, vnode, index);
            break;
        case exports.Nodes.MEDIA_RULE:
            mountMediaRule(sheet, rule, vnode, index);
            break;
        case exports.Nodes.SUPPORTS_RULE:
            mountSupportsRule(sheet, rule, vnode, index);
            break;
        case exports.Nodes.KEYFRAMES_RULE:
            mountKeyframesRule(sheet, rule, vnode, index);
            break;
        case exports.Nodes.KEYFRAME_RULE:
            mountKeyframeRule(sheet, rule, vnode, index);
            break;
    }
}
function mountStyleRule(sheet, rule, vnode, // this is style vnode, it carry the special attrs for rendering
insertIndex = sheet.cssRules.length) {
    const { selector, children: declaration // rename
     } = rule;
    if (!declaration)
        return;
    const index = sheet.insertRule(`${selector}{}`, insertIndex);
    const insertedRule = sheet.cssRules[index];
    rule.ref = insertedRule; // set ref
    const insertedRuleStyle = insertedRule.style;
    mountDeclaration(declaration, insertedRuleStyle);
}
function mountMediaRule(sheet, rule, vnode, insertIndex = sheet.cssRules.length) {
    var media = rule.media;
    var rules = rule.children;
    var index = sheet.insertRule(`@media ${media}{}`, insertIndex);
    var newSheet = sheet.cssRules[index];
    mountSheet(newSheet, rules, vnode);
}
function mountSupportsRule(sheet, rule, vnode, insertIndex = sheet.cssRules.length) {
    var supports = rule.supports;
    var rules = rule.children;
    var index = sheet.insertRule(`@supports ${supports}{}`, insertIndex);
    var newSheet = sheet.cssRules[index];
    mountSheet(newSheet, rules, vnode);
}
function mountKeyframesRule(sheet, rule, vnode, insertIndex = sheet.cssRules.length) {
    var keyframes = rule.keyframes;
    var rules = rule.children;
    var index = sheet.insertRule(`@keyframes ${keyframes}{}`, insertIndex);
    rule.ref = sheet.cssRules[insertIndex];
    var newSheet = sheet.cssRules[index];
    mountSheet(newSheet, rules, vnode);
}
function normalizeKeyframe$1(keyframe) {
    if (isArray(keyframe)) {
        return keyframe.map(normalizeKeyframe$1).join(',');
    }
    else if (isNumber(Number(keyframe))) {
        // 为数字或者数字字符串
        return `${keyframe}%`;
    }
    else {
        return keyframe;
    }
}
function mountKeyframeRule(sheet, rule, vnode, insertIndex = sheet.cssRules.length) {
    var { keyframe, children: declaration } = rule;
    keyframe = normalizeKeyframe$1(keyframe);
    // appendRule wont return the index 
    sheet.appendRule(`${keyframe}{}`);
    var index = sheet.cssRules.length - 1;
    const insertedRule = sheet.cssRules[index];
    rule.ref = insertedRule; // set ref
    const insertedRuleStyle = insertedRule.style;
    for (let property in declaration) {
        var { value } = getDeclarationValue(declaration[property]);
        // keyframe 中不能设置important
        nodeOps.setProperty(insertedRuleStyle, property, value);
    }
}

// for renderer
const onRE = /^on[A-Z]/;
const isEvent = (key) => onRE.test(key);
const parseHandlerKey = (handlerKey) => {
    var keys = handlerKey.split(/(?=[A-Z])/).map((key) => key.toLowerCase());
    // remove on
    keys.shift();
    var event = keys[0];
    // remove eventName
    keys.shift();
    return {
        event,
        options: arrayToMap(keys)
    };
};
// for compiler
function createHandlerKey(eventName, options) {
    var handlerKey = `on${capitalize(eventName)}`;
    if (options && options.length !== 0) {
        handlerKey += options.map(capitalize).join(''); // join default with ,
    }
    return handlerKey;
}
const modifierGuards = {
    stop: (e) => e.stopPropagation(),
    prevent: (e) => e.preventDefault(),
    self: (e) => e.target !== e.currentTarget,
    ctrl: (e) => !e.ctrlKey,
    shift: (e) => !e.shiftKey,
    alt: (e) => !e.altKey,
    meta: (e) => !e.metaKey,
    left: (e) => 'button' in e && e.button !== 0,
    middle: (e) => 'button' in e && e.button !== 1,
    right: (e) => 'button' in e && e.button !== 2,
};
/*
    使用修饰符后每次都会创建一个新的函数
*/
function createEvent(fn, modifiers) {
    return (event, ...args) => {
        for (let i = 0; i < modifiers.length; i++) {
            const guard = modifierGuards[modifiers[i]];
            if (guard && guard(event, modifiers))
                return;
        }
        return fn(event, ...args);
    };
}

function updateClass(pClass, nClass, el) {
    pClass ||= EMPTY_OBJ;
    nClass ||= EMPTY_OBJ;
    var classList = el.classList;
    var removeKeys = keys(pClass);
    for (let className in nClass) {
        var pC = pClass[className];
        var nC = nClass[className];
        if (pC && !nC) {
            // remove
            classList.remove(className);
        }
        else if (!pC && nC) {
            // add
            classList.add(className);
        }
        removeFromArray(removeKeys, className);
    }
    removeKeys.forEach((className) => {
        classList.remove(className);
    });
}
function unmountClass(el) {
    el.className = '';
}

function mountProps(vnode) {
    var { ref, props } = vnode;
    if (!props) {
        return;
    }
    else {
        updateProps(EMPTY_OBJ, props, ref);
    }
}
function updateProps(p, n, el, vnode) {
    var removeList = keys(p);
    for (let key in n) {
        var pValue = p[key];
        var nValue = n[key];
        if (key === 'style') {
            updateDeclaration(pValue, nValue, el.style);
        }
        else if (key === 'class') {
            updateClass(pValue, nValue, el);
        }
        else if (isEvent(key)) {
            if (pValue !== nValue) {
                var { event, options } = parseHandlerKey(key);
                el.removeEventListener(event, pValue);
                el.addEventListener(event, nValue, options);
            }
        }
        else {
            if (p[key] == n[key]) {
                el.setAttribute(key, n[key]);
            }
        }
        removeFromArray(removeList, key);
    }
    removeList.forEach((key) => {
        unmountProp(key, p[key], el);
    });
}
function unmountProp(propName, value, el, vnode) {
    if (propName === 'style') {
        unmountDeclaration(value, el.style);
    }
    else if (propName === 'class') {
        unmountClass(el);
    }
    else if (isEvent(propName)) {
        var { event, options } = parseHandlerKey(propName);
        el.removeEventListener(event, value, options);
    }
    else {
        el.removeAttribute(propName);
    }
}

function injectDirectives(target, directives) {
    for (let directive of directives) {
        injectDirective(target, directive);
    }
    return target;
}
function injectDirective(target, [rawDirective, info]) {
    // 指令会携带信息 值 参数 修饰符
    // 保存指令与指令携带信息之间的关系 ， 用于传递新旧节点的指令信息
    var dirInfos = target.dirInfos ||= new Map();
    dirInfos.set(rawDirective, info);
    let directiveOptions = rawDirective;
    if (isFunction(rawDirective)) {
        directiveOptions = {
            ["mounted" /* MOUNTED */]: rawDirective,
            ["updated" /* UPDATED */]: rawDirective
        };
    }
    for (let key in directiveOptions) {
        var hook = directiveOptions[key];
        // save the raw directive on this hook , so while the hook is calling , we can know the hook belong which directive
        hook.directive = rawDirective;
        // !hook.dirInfo = info 不应该在指令上钩子上直接保存指令信息，会存在覆盖问题
        injectHook(key, target, hook);
    }
    // ! 
    return target;
}
function processHook(type, p, n) {
    // 不存在两个节点都不存在
    if (p && n) {
        // ! 只有更新时指令才能拿到 oldValue
        // update 包括普通更新和假卸载和挂载的更新
        var samePatchKey = p.patchKey === n.patchKey;
        if (samePatchKey) {
            // just update , beforeUpdate , updated 
            callHook(type, n, {
                scheduler(hook) {
                    var dirArgs = [
                        n.ref
                    ];
                    if (hook.directive) {
                        // dirInfo 存在的话一定有 dirInfos
                        var dirInfo = n.dirInfos.get(hook.directive);
                        dirInfo.oldValue = p.dirInfos.get(hook.directive).value;
                        dirArgs.push(hook.dirInfo);
                    }
                    // 这里需要拿到旧的指令值
                    hook.apply(null, dirArgs);
                }
            });
        }
        else {
            // 假挂载和假卸载 , 假卸载旧节点 ， 假挂载新节点 , 不需要指令旧值
            callHook(type === "beforeUpdate" /* BEFORE_UPDATE */ ? "beforeUnmount" /* BEFORE_UNMOUNT */ : "unmounted" /* UNMOUNTED */, p, {
                scheduler(hook) {
                    hook.call(null, p.ref, p.dirInfos?.get(hook.directive));
                }
            });
            callHook(type === "updated" /* UPDATED */ ? "mounted" /* MOUNTED */ : "beforeMount" /* BEFORE_MOUNT */, n, {
                scheduler(hook) {
                    hook.call(null, n.ref, n.dirInfos?.get(hook.directive));
                }
            });
        }
    }
    else {
        //  卸载和挂载
        var target = p || n;
        callHook(type, target, {
            scheduler(hook) {
                // 挂载时不存在旧值
                hook.apply(null, target.ref, target.dirInfos?.get(hook.directive));
            }
        });
    }
}

function mount(vnode, container, anchor = null) {
    switch (vnode.type) {
        case exports.Nodes.HTML_ELEMENT:
            mountHTMLElement(vnode, container, anchor);
            break;
        case exports.Nodes.TEXT:
            mountText(vnode, container, anchor);
            break;
        case exports.Nodes.COMPONENT:
            mountComponent(vnode, container, anchor);
            break;
        case exports.Nodes.STYLE:
            mountStyleSheet(vnode, container);
            break;
    }
}
function mountChildren(children, container, anchor) {
    children.forEach((child) => {
        /*
            会出现由于分支产生的 空节点
        */
        if (child) {
            mount(child, container, anchor);
        }
    });
}
function mountText(vnode, container, anchor) {
    var textContent = vnode.children;
    var el = document.createTextNode(textContent);
    vnode.ref = el;
    nodeOps.insert(el, container, anchor);
}
function mountHTMLElement(vnode, container, anchor) {
    const { tag, props, children } = vnode;
    var el = document.createElement(tag);
    vnode.ref = el;
    processHook("created" /* CREATED */, null, vnode);
    mountProps(vnode);
    processHook("beforeMount" /* BEFORE_MOUNT */, null, vnode);
    nodeOps.insert(el, container, anchor);
    processHook("mounted" /* MOUNTED */, null, vnode);
    if (children) {
        mountChildren(children, el, anchor);
    }
}

function unmountComponent(vnode, container, anchor) {
    var { ref: instance } = vnode;
    var vnode = instance.vnode;
    patch(vnode, null, container, anchor);
}

function unmount(vnode, container, anchor) {
    switch (vnode.type) {
        case exports.Nodes.HTML_ELEMENT:
            unmountElement(vnode);
            break;
        case exports.Nodes.TEXT:
            nodeOps.remove(vnode.ref);
            break;
        case exports.Nodes.COMPONENT:
            unmountComponent(vnode, container, anchor);
            break;
    }
}
function unmountChildren(children) {
    // 卸载过程目前不需要锚点
    children.forEach(unmount);
}
function unmountElement(vnode) {
    if (vnode.children) {
        unmountChildren(vnode.children);
    }
    processHook("beforeUnmount" /* BEFORE_UNMOUNT */, vnode, null);
    nodeOps.remove(vnode.ref);
    processHook("unmounted" /* UNMOUNTED */, vnode, null);
}

const insertNull = (arr, index, length = 1) => arr.splice(index, 0, ...new Array(length).fill(null));
const normalizeKeyframe = (keyframe) => isNumber(Number(keyframe)) ? `${keyframe}%` : keyframe;

/*
    diff the dom children and rules children

    the dom vnodes will be reused with the same patchKey and the same type ,
    so , we can make the reused vnodes stay in the same index , this is the first step
    and then , the unsame keyed vnodes , we can reuse them if they have the same type , its the second step,
    apon the process , we get the same length children ,
    and the same type and same key vnodes are in the same index , the same type , not same key nodes also in the same index ,
    so the only things we need todo is loop the chidren each the patch operate,

    but the rules is something different ,
    the same nodeType and same key we can reuse ,
    others can be rsused while they have the same nodeType

    ! something interesting  , the key order will not change
*/
function createMapAndList(children) {
    var map = {};
    var list = children.map((child, index) => {
        var patchKey = child.patchKey;
        var token = {
            node: child,
            patchKey,
            index
        };
        map[patchKey] = token;
        return token;
    });
    return {
        map, list
    };
}
function diffChildren(p, n, isRules) {
    // copy
    p = [...p || []];
    n = [...n || []];
    var nLength = n.length;
    var { map: pMap } = createMapAndList(p);
    var pMoved = 0;
    for (let i = 0; i < nLength; i++) {
        /*
            此次循环用于将两组规则的相同key对应到相同的索引下
        */
        var node = n[i];
        var patchKey = node.patchKey;
        var sameNode = pMap[patchKey];
        if (sameNode && (isRules || (sameNode.node.tag === node.tag))) {
            /*
                the condition of reuse a vnode for dom is same patchkey and same type
                for rules is just the same patchkey
            */
            var sameNodeIndex = sameNode.index + pMoved;
            var diff = i - sameNodeIndex;
            var diffLength = Math.abs(diff);
            if (diff < 0) {
                /* 说明该接点在p中的位置较远，需要再n中条南充元素 */
                insertNull(n, i, diffLength);
                i += diffLength;
                nLength += diffLength;
            }
            else {
                insertNull(p, sameNodeIndex, diffLength);
                pMoved += diffLength;
            }
        }
    }
    return {
        p, n
    };
}

const updateStyleSheet = (p, n) => {
    var ref = n.ref = p.ref;
    var sheet = ref.sheet;
    /*
        更新style元素的props，并且处理特殊属性如，unit,url 等
    */
    updateSheet(p.children, n.children, sheet, n);
};
function updateSheet(pRules, nRules, sheet, vnode) {
    /*
        与更新dom元素不同，规则中只要patchKey相同就一定会复用,
        更新过程依赖patchkey
        patchkey 作为第一优先级
        其次为nodetype,
        !还是假设key相同的节点顺序一定不会变，
    */
    var { p, n } = diffChildren(pRules, nRules, true);
    /*
        经过第一次处理后，还需要进行第二次处理，目的是只有nodeType类型相同的节点会属于相同的节点，其他一律用空节点代替，因为一定会挂载或卸载，
        抛出同一索引下节点类型不相同的情况
    */
    var max = Math.max(p.length, n.length);
    var cursor = 0;
    for (let i = 0; i < max; i++) {
        var pRule = p[i];
        var nRule = n[i];
        /*
            不存在两个对应位置都为空的情况
        */
        if (!pRule) {
            mountRule(sheet, nRule, vnode, cursor);
            cursor++;
        }
        else if (!nRule) {
            // unmount
            sheet.deleteRule(cursor);
            cursor--;
        }
        else if (pRule.nodeType !== nRule.nodeType) {
            // 当节点类型不同时，先卸载，再挂载 
            sheet.deleteRule(cursor);
            mountRule(sheet, nRule, vnode, cursor);
        }
        else {
            // update
            switch (nRule.nodeType) {
                case exports.Nodes.STYLE_RULE:
                    updateStyleRule(pRule, nRule);
                    break;
                case exports.Nodes.MEDIA_RULE:
                    updateMediaRule(pRule, nRule, vnode);
                    break;
                case exports.Nodes.SUPPORTS_RULE:
                    // supports cant update , 
                    break;
                case exports.Nodes.KEYFRAMES_RULE:
                    updateKeyframesRule(pRule, nRule);
                    break;
            }
        }
        cursor++;
    }
}
function updateStyleRule(pRule, nRule, vnode) {
    var ref = nRule.ref = pRule.ref;
    var { selector: pSelector, children: pDeclaration } = pRule;
    var { selector: nSelector, children: nDeclaration } = nRule;
    if (pSelector !== nSelector) {
        ref.selectorText = nSelector;
    }
    var style = ref.style;
    updateDeclaration(pDeclaration, nDeclaration, style);
}
function updateMediaRule(pRule, nRule, vnode) {
    var ref = nRule.ref = pRule.ref;
    var { media: pMedia, children: pRules } = pRule;
    var { media: nMedia, children: nRules } = nRule;
    /* while not the same media condition */
    if (pMedia !== nMedia) {
        debugger;
    }
    updateSheet(pRules, nRules, ref, vnode);
}
function updateKeyframesRule(pRule, nRule, vnode) {
    var keyframesRef = nRule.ref = pRule.ref;
    var { keyframes: pKeyframes, children: pRules } = pRule;
    var { keyframes: nKeyframes, children: nRules } = nRule;
    if (pKeyframes !== nKeyframes) {
        keyframesRef.name = nKeyframes;
    }
    var maxLength = Math.max(pRules.length, nRules.length);
    /*
        最简单的更新策略，只存在keyframe，并且可以设置keyText
    */
    for (let i = 0; i < maxLength; i++) {
        var pk = pRules[i];
        var nk = nRules[i];
        if (!pk) {
            mountKeyframeRule(keyframesRef, nk);
        }
        else if (!nk) {
            keyframesRef.deleteRule(normalizeKeyframe(pk.keyframe));
        }
        else {
            var { keyframe: pKeyframe, children: pDeclaration } = pk;
            var { keyframe: nKeyframe, children: nDeclaration } = nk;
            let keyframeRef = nk.ref = pk.ref;
            var style = keyframeRef.style;
            if (pKeyframe !== nKeyframe) {
                keyframeRef.keyText = nKeyframe;
            }
            updateDeclaration(pDeclaration, nDeclaration, style);
        }
        // 不存在两个都没有的情况
    }
}

function update(p, n, container, anchor) {
    switch (n.type) {
        case exports.Nodes.TEXT:
            updateText(p, n);
            break;
        case exports.Nodes.HTML_ELEMENT:
            updateHTMLElement(p, n, container);
            break;
        case exports.Nodes.COMPONENT:
            break;
        case exports.Nodes.STYLE:
            updateStyleSheet(p, n);
            break;
    }
}
function updateText(p, n) {
    var ref = n.ref = p.ref;
    if (p.children !== n.children) {
        ref.textContent = n.children;
    }
}
function updateHTMLElement(p, n, container, anchor) {
    var el = n.ref = p.ref;
    /* think ?
        存在html元素节点上的钩子一定是指令吗？
        <input  b >
    */
    // 更新钩子仅针对元素与子节点无关
    processHook("beforeUpdate" /* BEFORE_UPDATE */, p, n);
    updateProps(p.props, n.props, el);
    processHook("updated" /* UPDATED */, p, n);
    // updated hooks should be called here ? or after children update
    updateChildren(p.children, n.children, container);
}
function updateChildren(pChildren, nChildren, container, anchor) {
    var { p, n } = diffChildren(pChildren, nChildren, false);
    var max = Math.max(p.length, n.length);
    for (let i = 0; i < max; i++) {
        patch(p[i], n[i], container, getAnchor(p, i + 1));
    }
}
/*
    在已经挂载的vnodes中获取anchor
*/
function getAnchor(vnodes, index) {
    for (let i = index; i < vnodes.length; i++) {
        var ref = vnodes[i]?.ref;
        if (ref) {
            return ref;
        }
    }
}

const patch = (current, next, container, anchor = null) => {
    if (!current) {
        if (next) {
            isArray(next) ? mountChildren(next, container, anchor) : mount(next, container, anchor);
        }
    }
    else {
        if (!next) {
            // 卸载当前节点
            isArray(current) ? unmountChildren(current) : unmount(current, container, anchor);
        }
        else {
            if (isArray(current)) {
                updateChildren(current, isArray(next) ? next : [next], container);
            }
            else {
                if (isArray(next)) {
                    updateChildren([current], next, container);
                }
                else {
                    // 两个单节点 ， 但key可能不同 
                    if (current.tag === next.tag) {
                        // 类型相同，直接更新
                        update(current, next, container);
                    }
                    else {
                        // 类型不同。先卸载，在挂载
                        unmount(current, container, anchor);
                        mount(next, container, anchor);
                    }
                }
            }
        }
    }
};

var nextTick = (fn, args = undefined) => {
    var p = Promise.resolve(args);
    p.then(fn.bind(null));
};

var currentWork = null;
function nextTickSingleWork(work) {
    if (!currentWork) {
        currentWork = work;
        nextTick(() => {
            currentWork();
            currentWork = null;
        });
    }
}

function mixin(...sources) {
    return Object.assign(...sources);
}

function doFlat(rules, flattedRules, parent = null, // 保存parent的作用主要是当遍历到declaration时
key = null) {
    for (let i = 0; i < rules.length; i++) {
        var rule = rules[i];
        if (!rule) {
            continue;
        }
        // 使用传来的key生成唯一的key
        var patchKey = key ? key + '_' + rule.key : rule.key;
        rule.patchKey = patchKey;
        rule.parent = parent;
        switch (rule.type) {
            case exports.Nodes.STYLE_RULE:
                flattedRules.push(rule);
                var _children = rule.children;
                rule.children = null;
                if (_children) {
                    doFlat(_children, flattedRules, rule);
                }
                break;
            case exports.Nodes.DECLARATION:
                if (!rule.parent) {
                    debugger;
                    // 声明不再任何样式规则或媒体规则下时,应该报错
                }
                else if (rule.parent.type === exports.Nodes.STYLE_RULE) {
                    (rule.parent.children ||= []).push(rule);
                }
                else if (rule.parent.type === exports.Nodes.KEYFRAME_RULE) {
                    (rule.parent.children ||= []).push(rule);
                }
                else {
                    /*
                        当一条样式声明不时样式规则的子节点
                    */
                    if (rule.parent.type === exports.Nodes.MEDIA_RULE) {
                        /*
                            一条声明直接存在媒体规则下，会继承媒体规则的选择器并新建一条 styleRule
                            此时和一直寻找parent的选择器
                        */
                        var selector, parent = rule.parent;
                        while (!selector && parent) { /* 当选择器没被找到，并且parent存在时才会继续寻找 */
                            selector = parent.selector;
                            parent = parent.parent;
                        }
                        if (!selector) {
                            error('当前样式声明不存在选择器下');
                        }
                        else {
                            // reset the declaration to styleRule
                            var newRule = createStyle(selector, rule.children, key);
                            newRule.patchKey = patchKey;
                            flattedRules.push(newRule);
                        }
                    }
                }
                continue;
            case exports.Nodes.MEDIA_RULE:
                rule.children = flatRules(rule.children, rule);
                flattedRules.push(rule);
                break;
            case exports.Nodes.SUPPORTS_RULE:
                rule.children = flatRules(rule.children);
                flattedRules.push(rule);
                break;
            case exports.Nodes.KEYFRAMES_RULE:
                rule.children = flatRules(rule.children);
                /*
                    在此处需要把动画下的每一帧的样式处理成对象形式
                */
                rule.children.forEach((keyframe) => {
                    const children = keyframe.children.map((r) => r.children);
                    keyframe.children = mixin(...children);
                });
                flattedRules.push(rule);
                break;
            case exports.Nodes.KEYFRAME_RULE:
                /* 需要和styleRule处理方式一样 */
                flattedRules.push(rule);
                var _children = rule.children;
                rule.children = null;
                if (_children) {
                    doFlat(_children, flattedRules, rule);
                }
                break;
            case exports.Nodes.FRAGMENT:
                // fragment wont be a parent
                doFlat(rule.children, flattedRules, rule.parent, rule.patchKey);
                break;
        }
    }
    return flattedRules;
}

function flatRules(rules, parent = null, key = null
/* 这里传入的key是为了避免由循环产生节点中，当第一层是fragment时，无法为子节点设置上唯一的key  */
) {
    const flatted = doFlat(rules, [], parent, key);
    /*
        当一层平铺结束后 ， 处理declaration
        stylesheet 的 vdom中不会存在fragment，因为在这已经处理完了
    */
    flatted.forEach((rule) => {
        if (rule.type === exports.Nodes.STYLE_RULE) {
            /*
                children有多个子元素时为在规则中含有其他规则或因为指令存在而打断连续性,
                并且 ， 最终生成的vdom中不会出现declaration类型，而是直接使用map结构代替,
                仅需要处理数组结构
            */
            if (isArray(rule.children)) {
                const children = rule.children.map((r) => r.children);
                rule.children = (rule.children.length === 0 ? null : mixin(...children));
            }
        }
    });
    return flatted;
}

/*
    处理结果返回始终是数组
*/
function processdom(node, key = null) {
    if (!node) {
        return null;
    }
    if (!isArray(node)) {
        node = [node];
    }
    var flattedNode = [];
    node.forEach((child) => {
        if (child) {
            if (child.type === exports.Nodes.FRAGMENT) {
                /* 这里给后续传入fragment的key，为了使后续的每个节点都能有唯一的key */
                flattedNode = flattedNode.concat(processdom(child.children, child.key));
            }
            else {
                if (key) {
                    child.patchKey = key + '_' + child.key;
                }
                else {
                    child.patchKey = child.key;
                }
                if (child.type === exports.Nodes.HTML_ELEMENT) {
                    // 子节点递归处理
                    child.children = processdom(child.children);
                }
                if (child.type === exports.Nodes.STYLE) {
                    child.children = flatRules(child.children, null, child.patchKey);
                }
                flattedNode.push(child);
            }
        }
    });
    return flattedNode;
}

// if you are using css function with dynamic binding , use camelized function name 
function addUnit(value, unit) {
    return isNumber(value) ? `${value + unit}` : value;
}
function rgba(...rgba) {
    return `rgba(${rgba.join(',')})`;
}
const rgb = rgba;
/*
    in normal css , the saturation and lightness need to endwith % , but we support to use number , and auto fill %
*/
function hsla(h, s, l, a = 1) {
    return `hsla(
        ${h},
        ${addUnit(s, '%')},
        ${addUnit(l, '%')},
        ${a}
        )`;
}
const hsl = hsla;
/*
    var is a keyword in js , use $var instead
    :root{
        --bg:red;
        $--bg2:'blue';
    }
    body{
        background-color:var(--bg);
        $background-color:$var('--bg2');
    }
*/
function $var(variable) {
    return `var(${variable})`;
}
function attr(attrName) {
    return `attr(${attrName})`;
}
function calc(exp) {
    return `calc(${exp})`;
}
function cubicBzier(x1, y1, x2, y2) {
    return `cubic-bezier(${x1},${y1},${x2},${y2})`;
}
const max = (...items) => `max(${items.join(',')})`;
const min = (...items) => `min(${items.join(',')})`;
function translateX(t) {
    return `translateX(${t})`;
}
function translateY(t) {
    return `translateY(${t})`;
}
function translate3d(x, y, z) {
    return `translate3d(${x},${y},${z})`;
}
function scale(sx, sy) {
    return 'scale(' + sx + (sy ? `,${sy}` : '') + ')';
}
function scale3d(sx, sy, sz) {
    return `scale3d(${sx},${sy},${sz})`;
}
function rotate3d(x, y, z, a) {
    return `rotate3d(${x},${y},${z},${addUnit(a, 'deg')})`;
}
function rotate(a) {
    return `rotate(${addUnit(a, 'deg')})`;
}
function perspective(l) {
    return `perspective(${l})`;
}
function skewX(x) {
    return `skewX(${addUnit(x, 'deg')})`;
}

var cssFunctions = {
    rgba,
    rgb,
    hsl,
    hsla,
    $var,
    attr,
    calc,
    cubicBzier,
    max,
    min,
    translateX,
    translateY,
    scale
};

var proto = {
    ...cssFunctions
};
var initScope = () => Object.create(proto);

function createComponentInstance(options) {
    var app = getCurrentApp();
    if (!options._isOptions) {
        initOptions(options);
    }
    const instance = {
        uid: uid(),
        scope: reactive(initScope()),
        render: null,
        vnode: null,
        createRender: options.createRender,
        components: options.components,
        directives: options.directives,
        // hooks will always be an array
        ["beforeCreate" /* BEFORE_CREATE */]: options["beforeCreate" /* BEFORE_CREATE */] && [...options["beforeCreate" /* BEFORE_CREATE */]],
        ["create" /* CREATE */]: options["create" /* CREATE */] && [...options["create" /* CREATE */]],
        ["created" /* CREATED */]: options["created" /* CREATED */] && [...options["created" /* CREATED */]],
        ["beforeMount" /* BEFORE_MOUNT */]: options["beforeMount" /* BEFORE_MOUNT */] && [...options["beforeMount" /* BEFORE_MOUNT */]],
        ["mounted" /* MOUNTED */]: options["mounted" /* MOUNTED */] && [...options["mounted" /* MOUNTED */]],
        ["beforeUnmount" /* BEFORE_UNMOUNT */]: options["beforeUnmount" /* BEFORE_UNMOUNT */] && [...options["beforeUnmount" /* BEFORE_UNMOUNT */]],
        ["unmounted" /* UNMOUNTED */]: options["unmounted" /* UNMOUNTED */] && [...options["unmounted" /* UNMOUNTED */]],
        ["beforeUpdate" /* BEFORE_UPDATE */]: options["beforeUpdate" /* BEFORE_UPDATE */] && [...options["beforeUpdate" /* BEFORE_UPDATE */]],
        ["updated" /* UPDATED */]: options["updated" /* UPDATED */] && [...options["updated" /* UPDATED */]]
    };
    if (app.mixins) {
        injectMixins(instance, app.mixins);
    }
    return instance;
}
// rendering instance and creating instance
var currentInstance = null;
function setCurrentInstance(instance) {
    currentInstance = instance;
}
function getCurrentInstance() {
    return currentInstance;
}
function getCurrentScope() {
    return getCurrentInstance().scope;
}
const mountComponent = (vnode, container, anchor = null) => {
    var { tag, props, children } = vnode;
    var instance = createComponentInstance(tag);
    vnode.ref = instance;
    const { scope, createRender, } = instance;
    callHook("beforeCreate" /* BEFORE_CREATE */, instance, scope, scope);
    // init instance , we only can use getCurrentInstance in create hook 
    setCurrentInstance(instance);
    callHook("create" /* CREATE */, instance, scope, scope);
    setCurrentInstance(null);
    callHook("created" /* CREATED */, instance, scope, scope);
    // render function  
    setCurrentInstance(instance);
    const render = createRender(renderMethods$1);
    setCurrentInstance(null);
    instance.render = render;
    // component update fn
    function update() {
        const { isMounted, vnode } = instance;
        // 每次更新生成新树
        var nextTree = render();
        // 处理fragment
        nextTree = processdom(nextTree);
        console.log('prevTree', vnode);
        console.log('nextTree', nextTree);
        // test hooks
        callHook(isMounted ? "beforeUpdate" /* BEFORE_UPDATE */ : "beforeMount" /* BEFORE_MOUNT */, instance, scope, scope);
        patch(vnode, nextTree, container);
        callHook(isMounted ? "updated" /* UPDATED */ : "mounted" /* MOUNTED */, instance, scope, scope);
        instance.isMounted = true;
        instance.vnode = nextTree;
    }
    //  call at every update
    instance.update = update;
    effect(() => {
        update();
    }, {
        scheduler: (effect) => {
            nextTickSingleWork(effect.fn);
        }
    });
    return instance;
};

const show = {
    mounted() {
        debugger;
    },
    updated() {
        debugger;
    }
};

const builtInDirectives = {
    show
};
const builtInComponents = {};

function keyframes(name, keyframes) {
    return createKeyframes(name, keyframes);
}
function keyframe(name, keyframes) {
    return createKeyframe(name, keyframes);
}

const flash = keyframes('flash', [
    keyframe([0, 50, 100], {
        opacity: 1
    }),
    keyframe([25, 75], {
        opacity: 0
    })
]);

const backInDown = keyframes('backInDown', [
    keyframe(0, {
        transform: [translateY('-1200px'), scale(0.7)],
        opacity: 0.7
    }),
    keyframe(80, {
        transform: [translateY('0px'), scale(0.7)],
        opacity: 0.7
    }),
    keyframe(100, {
        transform: scale(1),
        opacity: 1
    }),
]);
const backInUp = keyframes('backInUp', [
    keyframe(0, {
        transform: [translateY('1200px'), scale(0.7)],
        opacity: 0.7
    }),
    keyframe(80, {
        transform: [translateY('0px'), scale(0.7)],
        opacity: 0.7
    }),
    keyframe(100, {
        transform: scale(1),
        opacity: 1
    }),
]);
const backInLeft = keyframes('backInLeft', [
    keyframe(0, {
        transform: [translateX('-2000px'), scale(0.7)],
        opacity: 0.7
    }),
    keyframe(80, {
        transform: [translateX('0px'), scale(0.7)],
        opacity: 0.7
    }),
    keyframe(100, {
        transform: scale(1),
        opacity: 1
    }),
]);
const backInRight = keyframes('backInRight', [
    keyframe(0, {
        transform: [translateX('2000px'), scale(0.7)],
        opacity: 0.7
    }),
    keyframe(80, {
        transform: [translateX('0px'), scale(0.7)],
        opacity: 0.7
    }),
    keyframe(100, {
        transform: scale(1),
        opacity: 1
    }),
]);

const hinge = keyframes('hinge', [
    keyframe(0, {
        animationTimingFunction: 'ease-in-out'
    }),
    keyframe([20, 60], {
        animationTimingFunction: 'ease-in-out',
        transform: rotate3d(0, 0, 1, 80)
    }),
    keyframe([40, 80], {
        animationTimingFunction: 'ease-in-out',
        transform: rotate3d(0, 0, 1, 60),
        opacity: 1
    }),
    keyframe(100, {
        transform: translate3d(0, '700px', 0),
        opacity: 0
    })
]);
const jackInTheBox = keyframes('jackInTheBox', [
    keyframe(0, {
        opacity: 0,
        transform: [scale(0.1), rotate(30)],
        transformOrigin: ['center', 'bottom']
    }),
    keyframe(50, {
        transform: rotate(-10),
    }),
    keyframe(70, {
        transform: rotate(3),
    }),
    keyframe(100, {
        opacity: 1,
        transform: scale(1),
    })
]);
const rollIn = keyframes('rollIn', [
    keyframe(0, {
        opacity: 0,
        transform: [translate3d('-100%', 0, 0), rotate3d(0, 0, 1, -120)]
    }),
    keyframe(100, {
        opacity: 1,
        transform: translate3d(0, 0, 0)
    })
]);
const rollOut = keyframes('rollOut', [
    keyframe(0, {
        opacity: 1,
    }),
    keyframe(100, {
        opacity: 0,
        transform: [translate3d('100%', 0, 0), rotate3d(0, 0, 1, 120)]
    })
]);

const flip = keyframes('flip', [
    keyframe(0, {
        transform: [perspective('400px'), scale3d(1, 1, 1), translate3d(0, 0, 0), rotate3d(0, 1, 0, -360)],
        animationTimingFunction: 'ease-out'
    }),
    keyframe(40, {
        transform: [perspective('400px'), scale3d(1, 1, 1), translate3d(0, 0, '150px'), rotate3d(0, 1, 0, -190)],
        animationTimingFunction: 'ease-out'
    }),
    keyframe(50, {
        transform: [perspective('400px'), scale3d(1, 1, 1), translate3d(0, 0, '150px'), rotate3d(0, 1, 0, -170)],
        animationTimingFunction: 'ease-in'
    }),
    keyframe(80, {
        transform: [perspective('400px'), scale3d(0.95, 0.95, 0.95), translate3d(0, 0, 0), rotate3d(0, 1, 0, 0)],
        animationTimingFunction: 'ease-in'
    }),
    keyframe(100, {
        transform: [perspective('400px'), scale3d(1, 1, 1), translate3d(0, 0, 0), rotate3d(0, 1, 0, 0)],
        animationTimingFunction: 'ease-in'
    })
]);
const flipInX = keyframes('flipInX', [
    keyframe(0, {
        transform: [perspective('400px'), rotate3d(1, 0, 0, 90)],
        animationTimingFunction: 'ease-in',
        opacity: 0
    }),
    keyframe(40, {
        transform: [perspective('400px'), rotate3d(1, 0, 0, -20)],
        animationTimingFunction: 'ease-in'
    }),
    keyframe(60, {
        transform: [perspective('400px'), rotate3d(1, 0, 0, 10)],
        animationTimingFunction: 'ease-in',
        opacity: 1
    }),
    keyframe(80, {
        transform: [perspective('400px'), rotate3d(1, 0, 0, -5)],
    }),
    keyframe(100, {
        transform: perspective('400px')
    })
]);
const flipInY = keyframes('flipInY', [
    keyframe(0, {
        transform: [perspective('400px'), rotate3d(0, 1, 0, 90)],
        animationTimingFunction: 'ease-in',
        opacity: 0
    }),
    keyframe(40, {
        transform: [perspective('400px'), rotate3d(0, 1, 0, -20)],
        animationTimingFunction: 'ease-in'
    }),
    keyframe(60, {
        transform: [perspective('400px'), rotate3d(0, 1, 0, 10)],
        animationTimingFunction: 'ease-in',
        opacity: 1
    }),
    keyframe(80, {
        transform: [perspective('400px'), rotate3d(0, 1, 0, -5)],
    }),
    keyframe(100, {
        transform: perspective('400px')
    })
]);
const flipOutX = keyframes('flipOutX', [
    keyframe(0, {
        transform: perspective('400px')
    }),
    keyframe(30, {
        transform: [perspective('400px'), rotate3d(1, 0, 0, -20)],
        opcaity: 1
    }),
    keyframe(100, {
        transform: [perspective('400px'), rotate3d(1, 0, 0, 90)],
        opcaity: 0
    })
]);
const flipOutY = keyframes('flipOutY', [
    keyframe(0, {
        transform: perspective('400px')
    }),
    keyframe(30, {
        transform: [perspective('400px'), rotate3d(0, 1, 0, -20)],
        opcaity: 1
    }),
    keyframe(100, {
        transform: [perspective('400px'), rotate3d(0, 1, 0, 90)],
        opcaity: 0
    })
]);

const lightSpeedInRight = keyframes('lightSpeedInRight', [
    keyframe(0, {
        transform: [translate3d('100%', 0, 0), skewX(-30)],
        opacity: 0
    }),
    keyframe(60, {
        transform: skewX(20),
        opacity: 1
    }),
    keyframe(80, {
        transform: skewX(-5)
    }),
    keyframe(100, {
        transform: translate3d(0, 0, 0)
    }),
]);
const lightSpeedInLeft = keyframes('lightSpeedInLeft', [
    keyframe(0, {
        transform: [translate3d('-100%', 0, 0), skewX(30)],
        opacity: 0
    }),
    keyframe(60, {
        transform: skewX(-20),
        opacity: 1
    }),
    keyframe(80, {
        transform: skewX(5)
    }),
    keyframe(100, {
        transform: translate3d(0, 0, 0)
    }),
]);
const lightSpeedOutRigt = keyframes('lightSpeedOutRight', [
    keyframe(0, {
        opacity: 1
    }),
    keyframe(100, {
        transform: [translate3d('100%', 0, 0), skewX(30)],
        opacity: 0
    }),
]);
const lightSpeedOutLeft = keyframes('lightSpeedOutLeft', [
    keyframe(0, {
        opacity: 1
    }),
    keyframe(100, {
        transform: [translate3d('-100%', 0, 0), skewX(-30)],
        opacity: 0
    }),
]);

var animations = [
    jackInTheBox,
    hinge,
    flash,
    backInUp,
    backInDown,
    backInLeft,
    backInRight,
    rollIn,
    rollOut,
    flip,
    flipInX,
    flipInY,
    flipOutX,
    flipOutY,
    lightSpeedInLeft,
    lightSpeedInRight,
    lightSpeedOutLeft,
    lightSpeedOutRigt
];
function installAnimation() {
    mount(createStyleSheet(null, animations), document.head);
}

var currentApp = null;
function getCurrentApp() {
    return currentApp;
}
class App {
    isMounted = false;
    options = null;
    constructor(options) {
        this.options = options;
        currentApp = this;
        /* 安装动画 */
        this.use(installAnimation);
    }
    components = builtInComponents;
    component(name, options) {
        this.components[name] = options;
    }
    directives = builtInDirectives;
    directive(name, options) {
        this.directives[name] = options;
    }
    mixins = [];
    mixin(mixin) {
        this.mixins.push(mixin);
    }
    instance;
    el = null;
    container = null;
    mount(container) {
        if (this.isMounted)
            return;
        const _container = isString(container) ? document.querySelector(container) : container;
        this.container = _container;
        var options = this.options;
        if (!options.template) {
            options.template = _container.innerHTML;
        }
        _container.innerHTML = '';
        var vnode = createComponent(options, null, null);
        vnode.app = this;
        var instance = mountComponent(vnode, _container);
        this.instance = instance;
        this.isMounted = true;
        return instance;
    }
    unmount() {
    }
    installed = new Set();
    use(installer, ...options) {
        if (!this.installed.has(installer)) {
            installer(this, ...options);
        }
    }
}

const createApp = (options) => new App(options);

function display(displayData) {
    return displayData;
}

var iterableFlag = Symbol.iterator;
var isIterableData = (data) => !!data[iterableFlag];
function renderList(data, callee, key) {
    if (!isIterableData(data)) {
        if (isNumber(data)) {
            var from = [];
            for (var j = 0; j < data; j++) {
                from[j] = j + 1;
            }
            data = from;
        }
        else if (isObject(data)) {
            data = Object.entries(data);
        }
    }
    var i = 0;
    var results = [];
    for (var item of data) {
        var res = isArray(item) ? callee(...item, i) : callee(item, i);
        if (res) {
            results.push(res);
            /* set ukey for diff */
            res.key = key + '_' + i;
            // i++
        }
        i++;
        /*
            需要在循环外部 i++ ，这样保证即使有空元素被排出后，索引位置也是正确的
        */
    }
    return results;
}

function getComponent(name) {
    return getCurrentInstance().components?.[name] || getCurrentApp().components[name];
}
function getDirective(name) {
    return getCurrentInstance().directives?.[name] || getCurrentApp().directives[name];
}

const toCodeString = (_) => "'" + _ + "'";

const inlineStyleDelimiter = /\s*[:;]\s*/;
function parseInlineStyle(styleString) {
    var chips = styleString.split(inlineStyleDelimiter).filter(Boolean);
    var l = chips.length;
    var styleMap = {};
    while (l) {
        styleMap[camelize(chips[l - 2])] = toCodeString(chips[l - 1]);
        l -= 2;
    }
    return styleMap;
}
const inlineClassDelimiter = /\s+/;
const parseInlineClass = (classString) => stringToMap(classString, inlineClassDelimiter);

var renderMethods = {
    createComment,
    createElement,
    createFragment,
    createKeyframe,
    createKeyframes,
    createMedia,
    createSVGElement,
    createStyleSheet,
    createStyle,
    createText,
    renderList,
    mergeSelectors,
    display,
    createDeclaration,
    mixin,
    important,
    createSupports,
    flatRules,
    createComponent,
    getComponent,
    getDirective,
    getCurrentScope,
    createEvent,
    createHandlerKey,
    normalizeClass,
    normalizeStyle,
    renderSlot,
    injectDirective,
    injectDirectives
};
Object.entries(renderMethods).reduce((res, [name, method]) => {
    res[name] = method.name;
    return res;
}, {});

/* object extend */
const extend = Object.assign;

// normalized class always will be a map with true value
function normalizeClass(rawClass) {
    /*
        crush class support
        string
        array
        object
        function : use the return value
    */
    if (isString(rawClass)) {
        return parseInlineClass(rawClass);
    }
    else if (isObject(rawClass)) {
        return rawClass;
    }
    else if (isArray(rawClass)) {
        return extend(...rawClass.map(normalizeClass));
    }
    else if (isFunction(rawClass)) {
        return normalizeClass(rawClass());
    }
}

/*
    the result always return a map
*/
function normalizeStyle(style) {
    if (isObject(style)) {
        return style;
    }
    else if (isString(style)) {
        return parseInlineStyle(style);
    }
    else if (isArray(style)) {
        style = style.map(normalizeStyle);
        return extend(...style);
    }
}

function renderSlot(slotName, backup) {
}

const stateIniterHandler = {
    get(initializer, key) {
        switch (initializer.index) {
            case 0:
                /* define state */
                var scope = getCurrentScope();
                scope[key] = initializer.value;
                initializer.stateName = key;
                initializer.index++;
                return initializer.value;
            case 1:
                /* update state */
                var scope = getCurrentScope();
                var updateFn = (newValue) => {
                    scope[initializer.stateName] = newValue;
                };
                scope[key] = updateFn;
                initializer.index++;
                return updateFn;
            case 2:
                var scope = getCurrentScope();
                function onChange(callback) {
                    watch(() => {
                        scope[initializer.stateName];
                    }, callback);
                }
                initializer.index++;
                return onChange;
            default:
                warn('stop !!!');
        }
    }
};
function useState(value) {
    return new Proxy({
        value,
        index: 0
    }, stateIniterHandler);
}

exports.createApp = createApp;
exports.createComment = createComment;
exports.createComponent = createComponent;
exports.createDeclaration = createDeclaration;
exports.createElement = createElement;
exports.createEvent = createEvent;
exports.createFragment = createFragment;
exports.createHandlerKey = createHandlerKey;
exports.createKeyframe = createKeyframe;
exports.createKeyframes = createKeyframes;
exports.createMedia = createMedia;
exports.createSVGElement = createSVGElement;
exports.createStyle = createStyle;
exports.createStyleSheet = createStyleSheet;
exports.createSupports = createSupports;
exports.createText = createText;
exports.directiveTypeOf = directiveTypeOf;
exports.display = display;
exports.effect = effect;
exports.flatRules = flatRules;
exports.getComponent = getComponent;
exports.getCurrentApp = getCurrentApp;
exports.getCurrentInstance = getCurrentInstance;
exports.getCurrentScope = getCurrentScope;
exports.getDirective = getDirective;
exports.important = important;
exports.injectDirective = injectDirective;
exports.injectDirectives = injectDirectives;
exports.injectHook = injectHook;
exports.mergeSelectors = mergeSelectors;
exports.mergeSplitedSelectorsAndJoin = mergeSplitedSelectorsAndJoin;
exports.mixin = mixin;
exports.mountComponent = mountComponent;
exports.nextTick = nextTick;
exports.nextTickSingleWork = nextTickSingleWork;
exports.normalizeClass = normalizeClass;
exports.normalizeStyle = normalizeStyle;
exports.onMounted = onMounted;
exports.parseHandlerKey = parseHandlerKey;
exports.reactive = reactive;
exports.renderList = renderList;
exports.renderSlot = renderSlot;
exports.setCurrentInstance = setCurrentInstance;
exports.splitSelector = splitSelector;
exports.tagTypeOf = tagTypeOf;
exports.useState = useState;
