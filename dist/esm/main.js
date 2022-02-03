const trimS = (s, len = 0) => s.slice(len).trimStart();

const openTagRE = /^<([\w-]+)(?:\:(\w+))?/;
const closeTagRE = /^<\/([\w-]+)(?:\:\w+)?\s*>/;
const commentRE = /<!--((.|[\r\n])*?)-->/;
const textRE = /((?:\{\{.*?\}\}|[^<])+)/;
/*
    capture the property and value
    $1 : rawProperty
    $2 : the value border , " or ' , we can use except the border in value content , but the ast doesnt need the border
    $3 : the value , the value maybe 'undefined' or empty string , we should to diff the normal property or single property by 'undefined or empty string
*/
const baseAttrRE = /([^=\s>]+)\s*(?:=\s*(["'])([^\2]*?)\2)?/;
const parseHTML = (ts) => {
    var ast = [], attrs, /* use array bbut not map beacuse ,we may support the repeated property and keep the order */ inOpen = false, sl = 0, $, tag, modifier; /* why need the parse the modifier here, because we need to process the nesting domtree by tagName  */
    while (ts = trimS(ts, sl)) {
        if (ts[0] === '<') {
            if (ts[1] === '/') {
                $ = closeTagRE.exec(ts);
                for (var i = ast.length - 1; i >= 0; i--) {
                    if (ast[i].closed)
                        continue;
                    if (ast[i].tag === $[1]) {
                        ast[i].closed = true;
                        var children = ast.splice(i + 1);
                        if (children.length) {
                            ast[i].children = children;
                        }
                        break;
                    }
                }
                sl = $[0].length;
            }
            else if (ts[1] === '!') {
                $ = commentRE.exec(ts);
                ast.push({
                    tag: '!',
                    content: $[1]
                });
                sl = $[0].length;
            }
            else {
                $ = openTagRE.exec(ts);
                tag = $[1];
                modifier = $[2];
                inOpen = true;
                sl = $[0].length;
            }
        }
        else if (inOpen) {
            if (ts[0] === '/') {
                /* there is not must for decide a opentag is close or not by '/', so just forget it */
                sl = 1;
            }
            else if (ts[0] === '>') {
                ast.push({
                    tag,
                    modifier,
                    attrs,
                    children: null,
                    closed: false,
                });
                attrs = null;
                inOpen = false;
                sl = 1;
            }
            else {
                $ = baseAttrRE.exec(ts);
                attrs = attrs || (attrs = []);
                attrs.push({
                    attribute: $[1],
                    value: $[3]
                });
                sl = $[0].length;
            }
        }
        else {
            $ = textRE.exec(ts);
            ast.push({
                tag: '',
                content: $[1]
            });
            sl = $[0].length;
        }
    }
    return ast;
};

const HTML_TAGS = [
    "html",
    "body",
    "base",
    "head",
    "link",
    "meta",
    /* "style",  reserved  */
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

const isHTMLTag = (tagName) => HTML_TAGS.includes(tagName);
var typeMap = {
    '': "TEXT" /* TEXT */,
    '!': "comment" /* COMMENT */,
    'svg': "SVG ELEMENT" /* SVGELEMENT */,
    'style': "style" /* STYLE */,
    'if': "if" /* IF */,
    'elseIf': "elseIf" /* ELSEIF */,
    'else': "else" /* ELSE */,
    'for': "for" /* FOR */
};
const nodeTypeOf = (key) => {
    var type = typeMap[key];
    return type || (isHTMLTag(key) ? "HTML ELEMENT" /* HTMLELEMENT */ : "COMPONENT" /* COMPONENT */);
};

var camelize = (target) => target.replace(/-(\w)/, (_, l) => l.toLowerCase());

var objectToString = Object.prototype.toString;
const isArray = Array.isArray;
const isObject = (value) => objectToString.call(value) === '[object Object]';

const extIteratorExp = /(?:[\{\[\(]?)([\w,]+)(?:[\}\]\)]?)\s*(?:in|of)\s*(.+)/;
const parseIterator = (expression) => {
    const [_, items, iterable] = extIteratorExp.exec(expression);
    return {
        iterable,
        items: items.split(',')
    };
};

const attributeExtractRE = /^([@$~])?(\[)?([\w-]+)(\])?(\.)?([\w\.]+)?/;
/* 这里需要传入完整节点，根据不同的节点类型对属性进行不同的处理，对于特殊属性挂载到节点本身  */
const parseAttr = (ast) => {
    ast.attrs.forEach((attr) => {
        var extracted = attributeExtractRE.exec(attr.attribute);
        var [_, flag, l, attrName, r, hasModifier, modifiers] = extracted;
        attr.property = camelize(attrName);
        attr.modifiers = hasModifier && modifiers.split('.');
        attr.dynamicProperty = l && r;
        attr.dynamicValue = flag;
        if (flag === '@') {
            attr.nodeType = "events" /* EVENT */;
            (ast.events || (ast.events = [])).push(attr);
        }
        else if (flag === '~') {
            if (attr.property === 'for') {
                ast.iterator = parseIterator(attr.value);
            }
            attr.nodeType = "directives" /* DIRECTIVE */;
            (ast.direvtives || (ast.directives = [])).push(attr);
        }
        else if (flag === '$' || !flag) {
            attr.nodeType = "attributes" /* ATTRIBUTE */;
            (ast.attributes || (ast.attributes = [])).push(attr);
        }
    });
};

var extractActiveSelector = /\$\[([^\]]*)\]/g;
function parseSelector(selector) {
    var dynamic = false;
    return {
        content: selector.replace(extractActiveSelector, (_, content) => {
            dynamic = true;
            return '${' + content + '}';
        }),
        dynamic
    };
}

/*
    color : red ;
    color!:red; important
    $color : variable ; support string,array,number
    [variable] : red ;
    $[variable] : variable ;
*/
const extractDeclarationProperty = /(\$)?(\[)?([\w-]+)(\])?(!)?/;
const parseDeclaration = (rawProperty, value) => {
    var [_, dynamicValue, l, property, r, important] = extractDeclarationProperty.exec(rawProperty);
    return {
        nodeType: "declaration" /* DECLARATION */,
        property,
        value,
        dynamicValue,
        dynamicProperty: l && r,
        important
    };
};

const selectorRE = /^([^{};]*)(?<!\s)\s*{/;
const declarationRE = /([$\w!-\]\[]+)\s*:\s*([^;]+);/;
const CSSCommentRE = /\/\*([\s\S]*?)\*\//;
const CSSDirectiveRE = /^--([\w]+)\s*(?:\(([^{]+)\))?\s*{/;
const AtRuleRE = /^@([\w]+)\s*([^{]+)(?<!\s)\s*{/;
const mixinRE = /\.\.\.([^;]+);/;
const parseCSS = (cs) => {
    var ast = [], stack = [], sl = 0, $, currentRule;
    while (cs = trimS(cs, sl)) {
        if (cs[0] === '@') {
            $ = AtRuleRE.exec(cs);
            switch ($[1]) {
                case 'media':
                    currentRule = {
                        nodeType: "media rule" /* MEDIARULE */,
                        mediaCondition: $[2],
                        children: [],
                        declaration: []
                    };
                    break;
                case 'keyframes':
                    currentRule = {
                        nodeType: "keyframes rule" /* KEYFRAMESRULE */,
                        keyframesName: $[2],
                        children: [],
                        declaration: []
                    };
                    break;
            }
        }
        else if (cs.startsWith('~')) {
            $ = CSSDirectiveRE.exec(cs);
        }
        else if (cs.startsWith('...')) {
            $ = mixinRE.exec(cs);
            stack[stack.length - 1].declaration.push({
                nodeType: "declaration mixin" /* MIXIN */,
                mixin: $[1]
            });
            sl = $[0].length;
            continue;
        }
        else if (cs.startsWith('/*')) {
            $ = CSSCommentRE.exec($[0]);
        }
        else if ($ = selectorRE.exec(cs)) {
            currentRule = {
                nodeType: "style rule" /* STYLERULE */,
                selector: parseSelector($[1]),
                children: [],
                declaration: []
            };
        }
        else if (cs[0] === '}') {
            stack.pop();
            sl = 1;
            continue;
        }
        else if ($ = declarationRE.exec(cs)) {
            stack[stack.length - 1].declaration.push(parseDeclaration($[1], $[2]));
            sl = $[0].length;
            continue;
        }
        var parent = stack[stack.length - 1];
        if (!parent) {
            ast.push(currentRule);
        }
        else {
            parent.children.push(currentRule);
            currentRule.parent = parent;
        }
        stack.push(currentRule);
        sl = $[0].length;
    }
    return ast;
};

var mustacheRE = /\{\{(.*?)\}\}/g;
var parseText = (text) => {
    var texts = [];
    var cursor = 0;
    text.replace(mustacheRE, (capture, expression, index) => {
        var staticString = text.substring(cursor, index).trim();
        if (staticString) {
            texts.push({
                dynamic: false,
                content: staticString
            });
        }
        if (expression = expression.trim()) {
            texts.push({
                dynamic: true,
                content: expression
            });
        }
        cursor = index + capture.length;
    });
    var staticString = text.substring(cursor, text.length).trim();
    if (staticString) {
        texts.push({
            dynamic: false,
            content: staticString
        });
    }
    return texts;
};

function flatRules(rules, flattedRules) {
    rules.forEach((rule) => {
        if (rule.nodeType === "style rule" /* STYLERULE */) {
            var { selector, parent, children } = rule;
            if (parent?.selectors) {
                rule.selectors = [...parent.selectors, selector];
            }
            else {
                rule.selectors = [selector];
            }
            flattedRules.push(rule);
            flatRules(children, flattedRules);
        }
        else if (rule.nodeType === "media rule" /* MEDIARULE */ || rule.nodeType === "support rule" /* SUPPORTRULE */) {
            rule.selectors = rule.parent?.selectors;
            rule.rules = proprecessRules(rule.children);
            flattedRules.push(rule);
        }
        else if (rule.type === "keyframes rule" /* KEYFRAMESRULE */) {
            flattedRules.push(rule);
        }
    });
    return flattedRules;
}

function proprecessRules(ast) {
    return flatRules(ast, []);
}

const getValueByAttriute = (attrs, keys) => {
    for (var item of attrs) {
        if (keys.includes(item.attribute)) {
            return item.value;
        }
    }
};
const parseAst = (ast, nodeType /* the default nodeType , some situation dont need to use the nodetypeof */) => {
    if (isArray(ast)) {
        var i = 0;
        var l = ast.length;
        for (i; i < l; i++) {
            parseAst(ast[i], nodeType);
        }
        return;
    } // 递归处理子树
    var tagName = ast.tagName = camelize(ast.tag);
    /* mark the nodetype  */
    if (nodeType) {
        nodeType = tagName === '' ? "TEXT" /* TEXT */ : nodeType; // 处理svg标签中的文本标签
    }
    else {
        nodeType = nodeTypeOf(tagName);
    }
    ast.nodeType = nodeType;
    switch (nodeType) {
        case "for" /* FOR */:
            /* 筛选出迭代器属性，其他的抛弃 */
            for (var item of ast.attrs) {
                if (item.attribute === '~' || item.attribute === 'iterator') {
                    ast.iterator = parseIterator(item.value);
                    break;
                }
            }
            parseAst(ast.children);
            break;
        case "if" /* IF */:
            ast.condition = getValueByAttriute(ast.attrs, ['~', 'conditon']);
            break;
        case "HTML ELEMENT" /* HTMLELEMENT */:
            if (ast.attrs) {
                parseAttr(ast);
            }
            break;
        case "SVG ELEMENT" /* SVGELEMENT */:
            if (ast.children) {
                parseAst(ast.children, "SVG ELEMENT" /* SVGELEMENT */);
            }
            break;
        case "style" /* STYLE */:
            if (ast.children) {
                var rawSheet = parseCSS(ast.children[0].content);
                ast.rules = proprecessRules(rawSheet);
            }
            break;
        case "TEXT" /* TEXT */:
            ast.texts = parseText(ast.content);
            break;
    }
    if (ast.children) {
        parseAst(ast.children);
    }
};

const dataDisplay = (value) => {
    return value;
};

/*
    provide a source data , and a callee function,
    return the result
    here is the iterable datatype
    -----
    array
    object
    string
    number
    map
    set
*/
var nativeIterableFlag = Symbol.iterator;
var isIterableData = (data) => !!data[nativeIterableFlag];
const iterateCall = (data, callee) => {
    var results = [];
    var i = 0;
    if (isIterableData(data)) {
        for (var item of data) {
            results[i] = isArray(item) ? callee(...item, i) : callee(item, i);
            i++;
        }
    }
    return results;
};

var fragment = Symbol('fragment');
function createFragment(children) {
    return {
        nodeType: "FRAGMENT" /* FRAGMENT */,
        type: fragment,
        children
    };
}
var text = Symbol('text');
function createText(content) {
    return {
        nodeType: "TEXT" /* TEXT */,
        type: text,
        content
    };
}
function createElement(type, props = null, children = null) {
    return {
        nodeType: "HTML ELEMENT" /* HTMLELEMENT */,
        type,
        props,
        children
    };
}
function createSVGElement(type, props = null, children = null) {
    return {
        nodeType: "SVG ELEMENT" /* SVGELEMENT */,
        type,
        props,
        children
    };
}
function createComponent(type, props = null, slots = null) {
    return {
        nodeType: "COMPONENT" /* COMPONENT */,
        type,
        props,
        slots
    };
}

var empty = Symbol('empty');
const createEmpty = () => {
    return {
        type: empty,
        nodeType: "empty node" /* EMPTY */
    };
};
const error = () => 'fuck off !!!';

function createSheet(config, rules) {
    return {
        nodeType: "sheet" /* SHEET */,
        config,
        rules
    };
}
function createStyleRule(selector, declaration) {
    return {
        nodeType: "style rule" /* STYLERULE */,
        selector, declaration
    };
}
function createMediaRule(media, rules) {
    return {
        nodeType: "media rule" /* MEDIARULE */,
        media, rules
    };
}
function createKeyframesRule(name, rules) {
    return {
        nodeType: "keyframes rule" /* KEYFRAMESRULE */,
        name, rules
    };
}
function createKeyframeRule(frame, declaration) {
    return {
        nodeType: "keyframe rule" /* KEYFRAMERULE */,
        frame, declaration
    };
}
function createSupportRule(condition, rules) {
    return {
        nodeType: "support rule" /* SUPPORTRULE */,
        condition, rules
    };
}

const groupSelectorDelimiter = /\s*,\s*/;
function mergeSelector(parent, child) {
    return parent.split(groupSelectorDelimiter).map((p) => {
        return child.split(groupSelectorDelimiter).map((c) => {
            var refP = false;
            var merged = c.replace('&', () => {
                refP = true;
                return p;
            });
            return refP ? merged : p + ' ' + c;
        }).join(',');
    }).join(',');
}
const mergeSelectors = (...selectors) => selectors.reduce(mergeSelector);

var propertyMixin = (...sources) => Object.assign(...sources);

const rfs = 'rfs';
const scope = 'scope';
/*
    the render fns name maping
*/
/* this is for compiler */
const renderSource = {
    FRAGMENT: rfs + '.' + createFragment.name,
    EMPTY: rfs + '.' + createEmpty.name,
    ELEMENT: rfs + '.' + createElement.name,
    SVGELEMENT: rfs + '.' + createSVGElement.name,
    TEXT: rfs + '.' + createText.name,
    DATADISPLAY: rfs + '.' + dataDisplay.name,
    COMPONENT: rfs + '.' + createComponent.name,
    SHEET: rfs + '.' + createSheet.name,
    STYLERULE: rfs + '.' + createStyleRule.name,
    MEDIARULE: rfs + '.' + createMediaRule.name,
    MERGESELECTORS: rfs + '.' + mergeSelectors.name,
    ERROR: rfs + '.' + error.name,
    PROPERTYMIXIN: rfs + '.' + propertyMixin.name,
    ITERATECALL: rfs + '.' + iterateCall.name,
};
/* this is for renderer */
const renderMethods = {
    createFragment,
    createEmpty,
    createElement,
    createComponent,
    createText,
    dataDisplay,
    mergeSelectors,
    createSheet,
    createStyleRule,
    createKeyframeRule,
    createMediaRule,
    createSupportRule,
    createKeyframesRule,
    propertyMixin,
    iterateCall,
    error
};

const toFunctionCall = (functionName, parameters = []) => `${functionName}(${parameters.join(',')})`;
const toBackQuotes = (_) => '`' + _ + '`';
const toString = (_) => "'" + _ + "'";
/*  use JSON.stringify will fill the " in every propertynames */
/*
    使用json.stringify会把所有key，value加上双引号
*/
const objectStringify = (target) => {
    return '{' +
        Object.entries(target).map(([property, value]) => {
            return property + ':' + (isObject(value) ? objectStringify(value) : isArray(value) ? toArray(value) : value);
        }).join(',')
        + '}';
};
const toArrowFunction = (returned, params) => {
    return `(${params.join(',')})=>(${returned})`;
};
/* to ternary expression */
const toTernaryExp = (condition, ifTrue, ifFalse) => `${condition}?${ifTrue}:${ifFalse}`;
const toArray = (items) => `[${items.join(',')}]`;

/* 针对不数量确定的节点，生成单个节点或者fragment */
function genCode(ast) {
    return ast.length === 1 ? genNode(ast[0]) : genFragment(genChildren(ast));
}
function genNode(ast) {
    var callFn;
    var params = [];
    switch (ast.nodeType) {
        case "for" /* FOR */:
            return genFor(ast.iterator, genCode(ast.children));
        case "if" /* IF */:
            var el = genCode(ast.children);
            return genIf(ast.condition, el);
        /* the normal element ,svgelement and component is almostly same as this  */
        case "HTML ELEMENT" /* HTMLELEMENT */:
            var el = genElement(ast.tagName, ast.attrs, ast.children);
            if (ast.iterator) {
                return genFor(ast.iterator, el);
            }
            else {
                return el;
            }
        /* text  */
        case "TEXT" /* TEXT */:
            return genText(ast.texts);
        /* style */
        case "style" /* STYLE */:
            callFn = renderSource.ELEMENT;
            params = [
                toString(ast.tagName),
                'null',
                toFunctionCall(renderSource.SHEET, [
                    'null',
                    ast.children ? genChildren(ast.rules) : 'null'
                ])
            ];
            break;
        case "style rule" /* STYLERULE */:
            callFn = renderSource.STYLERULE;
            params = [
                genSelector(ast.selectors),
                genDeclaration(ast.declaration)
            ];
            break;
        case "media rule" /* MEDIARULE */:
            callFn = renderSource.MEDIARULE;
            params = [
                toString(ast.mediaCondition),
                genChildren(ast.rules)
            ];
            break;
        default:
            callFn = renderSource.ERROR;
    }
    return toFunctionCall(callFn, params);
}
/* 将所有子元素包裹一层fragment */
function genFragment(ast) {
    return toFunctionCall(renderSource.FRAGMENT, [ast]);
}
function genChildren(ast) {
    var children = ast.map((ast) => genNode(ast));
    return toArray(children);
}
/* for 循环必须用一个fragment包裹 */
function genFor(iterator, target) {
    return genFragment(toFunctionCall(renderSource.ITERATECALL, [
        iterator.iterable,
        toArrowFunction(target, iterator.items)
    ]));
}
function genIf(condition, target) {
    return toTernaryExp(condition, target, toFunctionCall(renderSource.EMPTY));
}
function genElement(tagName, props, children) {
    return toFunctionCall(renderSource.ELEMENT, [
        toString(tagName),
        'null',
        children ? genChildren(children) : 'null'
    ]);
}
function genText(texts) {
    var textExp = texts.map((text) => {
        return text.dynamic ?
            toFunctionCall(renderSource.DATADISPLAY, [text.content]) :
            toBackQuotes(text.content);
    }).join('+');
    return toFunctionCall(renderSource.TEXT, [
        textExp
    ]);
}
/*
    合并多个选择器，当选择其中有一个是动态的，那么所有的选择器会在运行时进行计算，并且每次更新都会重新计算
    不建议使用 ！！！
*/
function genSelector(selectors) {
    var contents = [];
    var isStatic = selectors.every((selector) => {
        contents.push(selector.content);
        return !selector.dynamic;
    });
    return isStatic ?
        toString(mergeSelectors(...contents)) :
        toFunctionCall(renderSource.MERGESELECTORS, contents.map(toBackQuotes));
}
/* 处理css样式声明和样式混入 */
function genDeclaration(declarations) {
    var collection = [];
    var properties = {};
    declarations.forEach((declaration) => {
        if (declaration.nodeType === "declaration" /* DECLARATION */) {
            properties[`[${declaration.dynamicProperty ? declaration.property : toString(declaration.property)}]`] = declaration.dynamicValue ? declaration.value : toString(declaration.value);
        }
        else if (declaration.nodeType === "declaration mixin" /* MIXIN */) {
            var part = objectStringify(properties);
            if (part !== '{}') {
                collection.push(part);
            }
            collection.push(declaration.mixin);
            properties = {};
        }
    });
    if (Object.keys(properties).length !== 0) {
        collection.push(objectStringify(properties));
    }
    return collection.length === 1 ? collection[0] : toFunctionCall(renderSource.PROPERTYMIXIN, collection);
}

const compile = (template) => {
    var ast = parseHTML(template);
    parseAst(ast);
    console.log('Ast', ast);
    var code = genCode(ast);
    return new Function(scope, rfs, `with(${scope}){ 
        return ${code} 
    }`);
};

var uid = 0;
function createComponentInstance(options) {
    var render = options.render || (options.render = compile(options.template));
    var instance = {
        isMounted: false,
        uid: uid++,
        render,
        init: options.init,
        scope: Object.create(null)
    };
    return instance;
}

function mountComponent(options, el) {
    var instance = createComponentInstance(options);
    instance.init(instance.scope);
    var nextTree = instance.render(instance.scope, renderMethods);
    el.innerText = JSON.stringify(nextTree, null, 2);
    return instance;
}

const createApp = (appOptions) => {
    var app = {};
    app.container = document.querySelector(appOptions.container);
    app.mount = (rootComponent) => {
        return mountComponent(rootComponent, app.container);
    };
    return app;
};

export { createApp };
