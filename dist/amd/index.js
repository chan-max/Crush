define(['exports'], (function (exports) { 'use strict';

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
    const error = (...msg) => console.error(...msg);
    const throwError = (...msg) => {
        throw new Error(...msg);
    };

    const getEmptyMap = () => Object.create(null);
    var id = 0;
    const uid = () => id++;
    const ustringid = () => String(uid());
    const uvar = () => `_${uid()}`;
    const EMPTY_MAP = Object.freeze({});
    Object.freeze([]);

    const arrayToMap = (arr, mapValue = true) => arr.reduce((res, item) => {
        res[item] = mapValue;
        return res;
    }, getEmptyMap());
    const stringToMap = (str, delimiter) => arrayToMap(str.split(delimiter));
    const makeMap = (str, delimiter = ',') => {
        var map = arrayToMap(str.split(delimiter));
        return (key) => !!map[key];
    };

    /*
        use exec to extract the captureGroups
    */
    const exec = (target, extractor, resultIsRequired = true) => {
        var res = extractor.exec(target);
        if (res) {
            var [_, ...captureGroups] = res;
            return captureGroups;
        }
        else {
            if (resultIsRequired) {
                throwError(`
                failed to exec
            `);
            }
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
    var Nodes;
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
        Nodes[Nodes["SLOT"] = 32] = "SLOT";
    })(Nodes || (Nodes = {}));
    /*
        input nodeType return nodeKeyword
        input nodeKeyword return nodeType
    */
    var NodesMap;
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
    })(NodesMap || (NodesMap = {}));
    const directiveTypeOf = (dirName) => {
        return NodesMap[dirName] || Nodes.CUSTOM_DIRECTIVE;
    };
    const tagTypeOf = (tagName) => {
        return NodesMap[tagName] ||
            (isHTMLTag(tagName) ?
                Nodes.HTML_ELEMENT : isSVGTag(tagName) ?
                Nodes.SVG_ELEMENT : Nodes.COMPONENT);
    };

    const isBuiltInTag = makeMap('if,elseIf,else,for,slot');
    const isBuiltInDirective = makeMap('if,elseIf,else,for,show');

    (({
        nodeType: Nodes.NULL,
        type: Symbol('empty')
    }));
    var createElement = (type, props, children, key) => {
        return {
            type,
            props,
            children,
            key,
            nodeType: Nodes.HTML_ELEMENT,
        };
    };
    var Text = Symbol('Text');
    var createText = (children, key) => {
        return {
            key,
            type: Text,
            children,
            nodeType: Nodes.TEXT
        };
    };
    var createSVGElement = () => { };
    var createComment = () => { };
    var createFragment = (children, key) => {
        return {
            nodeType: Nodes.FRAGMENT,
            children,
            key
        };
    };
    var createStyleSheet = (props, children, key) => {
        return {
            type: 'style',
            nodeType: Nodes.STYLE,
            props,
            children,
            key
        };
    };
    var createStyle = (selector, children, key) => {
        return {
            nodeType: Nodes.STYLE_RULE,
            selector,
            children,
            key
        };
    };
    var createMedia = (media, children, key) => ({
        nodeType: Nodes.MEDIA_RULE,
        media,
        children,
        key
    });
    var createKeyframes = (keyframes, children, key) => {
        return {
            nodeType: Nodes.KEYFRAMES_RULE,
            keyframes,
            children,
            key
        };
    };
    var createKeyframe = (keyframe, children, key) => {
        return {
            nodeType: Nodes.KEYFRAME_RULE,
            keyframe,
            children,
            key
        };
    };
    const createComponent = (type, props, children) => {
        return {
            nodeType: Nodes.COMPONENT,
            type,
            props,
            children
        };
    };
    var createSupports = (supports, children, key) => ({
        nodeType: Nodes.SUPPORTS_RULE,
        supports,
        children,
        key
    });
    var createDeclaration = (children, key) => {
        return {
            nodeType: Nodes.DECLARATION,
            /*
                render function 生成vdom时，会直接合并declaration和mixin，所以此时不再存在declaration group，而是用declaration替代 ， 在进行flat处理时也不会存在declarationgroup
            */
            //nodeType: Nodes.DECLARATION_GROUP,
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
                    var asb = createAsb(Nodes.HTML_COMMENT);
                    asb.children = scanner.exec(comment)[0];
                    ast.push(createAsb(Nodes.HTML_COMMENT));
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
                    var asb = createAsb(Nodes.DOM_ELEMENT);
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
                    var asb = createAsb(Nodes.HTML_ATTRIBUTE);
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
                var asb = createAsb(Nodes.TEXT);
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
            else if (scanner.startsWith(NodesMap[Nodes.AT])) {
                /*
                    media conditions
                */
                var [type, content] = scanner.exec(AtRule);
                const nodeType = NodesMap[type];
                var asb = createAsb(nodeType);
                if (nodeType === Nodes.MEDIA_RULE) {
                    asb.media = content;
                }
                else if (nodeType === Nodes.KEYFRAMES_RULE) {
                    asb.keyframes = content;
                }
                else if (nodeType === Nodes.SUPPORTS_RULE) {
                    asb.supports = content;
                }
                current = asb;
            }
            else if (scanner.expect('/*')) ;
            else if (scanner.startsWith(NodesMap[Nodes.MIXIN])) {
                var [mixin] = scanner.exec(mixinEx);
                var asb = createAsb(Nodes.MIXIN);
                asb.mixin = mixin;
                (declarationGroup ||= []).push(asb);
                continue;
            }
            else if (cssReservedWord.test(scanner.source)) {
                /*
                    处理指令，指令不再需要通过标识符去判断
                */
                var [dir, content] = scanner.exec(CSSDir);
                var dirType = NodesMap[camelize(dir)];
                var asb = createAsb(dirType);
                switch (dirType) {
                    case Nodes.FOR:
                        asb.iterator = parseIterator(content);
                        break;
                    case Nodes.IF:
                        asb.condition = content;
                        asb.isBranchStart = true;
                        break;
                    case Nodes.ELSE_IF:
                        asb.condition = content;
                        asb.isBranch = true;
                        break;
                    case Nodes.ELSE:
                        asb.isBranch = true;
                        break;
                }
                current = asb;
            }
            else if (exResult = scanner.exec(selectorRE)) {
                /*
                    try to get the selector
                */
                var asb = createAsb(Nodes.STYLE_RULE);
                asb.selector = parseSelector(exResult[0]);
                current = asb;
            }
            else if (exResult = scanner.exec(declarationRE)) {
                /*
                    the last declaration must end with  " ; "
                */
                var declaration = parseDeclaration(exResult[0], exResult[1]);
                var asb = createAsb(Nodes.DECLARATION);
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
                var asb = createAsb(Nodes.DECLARATION_GROUP);
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
    const toString$1 = (_) => "'" + _ + "'";
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
            styleMap[camelize(chips[l - 2])] = toString$1(chips[l - 1]);
            l -= 2;
        }
        return styleMap;
    }
    const inlineClassDelimiter$1 = /\s+/;
    const parseInlineClass$1 = (classString) => stringToMap(classString, inlineClassDelimiter$1);

    const extAttribute = /(@|\$|-{2})?(\()?([\w-]+)(\()?(?::(\w+))?(?:\.([\w\.]+))?/;
    var fnIsCalled = /.+\(.*\)$/;
    const processAttribute = (node) => {
        const { type, attributes } = node;
        if (!attributes)
            return;
        for (let i = 0; i < attributes.length; i++) { // not destructur becasue keep the node
            const attr = attributes[i];
            var exResult = exec(attr.attribute, extAttribute);
            var [flag, l, property, r, argument, modifierList] = exResult;
            var isDynamicProperty = l && r;
            var isDynamicValue = flag === '$';
            var modifiers = modifierList && modifierList.split('.');
            // process directive
            if (flag === NodesMap[Nodes.DIRECTIVE_FLAG]) {
                // directive effect the root node
                var dirName = camelize(property);
                const dirType = directiveTypeOf(dirName);
                attr.type = dirType;
                switch (dirType) {
                    case Nodes.IF:
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
                    case Nodes.ELSE_IF:
                        if (!node.dirs) {
                            node.condition = attr.value;
                            node.isBranch = true;
                        }
                        break;
                    case Nodes.ELSE:
                        if (!node.dirs) {
                            node.isBranch = true;
                        }
                        break;
                    case Nodes.FOR:
                        attr.iterator = parseIterator(attr.value);
                        (node.dirs ||= []).push(attr);
                        break;
                    case Nodes.SLOT:
                        (node.dirs ||= []).push(attr);
                        break;
                    case Nodes.CUSTOM_DIRECTIVE:
                        attr.dirName = dirName;
                        attr.argument = argument;
                        attr.modifiers = modifiers;
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
            else if (flag === NodesMap[Nodes.AT]) {
                // the events attributeValue will always be dynamicMapKey
                /*
                    support :
                    methods name : @click="login"
                    expression : @click="login = true" //此时需要包裹一层函数
                    function : @click="function(){ ... }"
                    arrow function : @click="() => { ... }"
                */
                attr.type = Nodes.EVENT;
                attr.isDynamicValue = true;
                attr.isCalled = fnIsCalled.test(attr.value);
                attr.argument = argument;
                attr.modifiers = modifiers;
                attr.isDynamicProperty = isDynamicProperty;
                attr.property = property;
            }
            else if (property === NodesMap[Nodes.CLASS]) {
                // contain dynamic class and static class
                attr.type = Nodes.CLASS;
                attr.isDynamicValue = isDynamicValue;
                if (!isDynamicValue) {
                    attr.value = parseInlineClass$1(attr.value);
                }
            }
            else if (property === NodesMap[Nodes.STYLE]) {
                attr.type = Nodes.STYLE;
                attr.isDynamicValue = isDynamicValue;
                if (!isDynamicValue) {
                    attr.value = parseInlineStyle$1(attr.value);
                }
            }
            else {
                //  normal attribute
                attr.property = property;
                attr.argument = argument;
                attr.modifiers = modifiers;
                attr.isDynamicValue = isDynamicValue;
                attr.isDynamicProperty = isDynamicProperty;
            }
        }
    };

    /*
        extend the selectors and process keyframes
    */
    const processRules = (rules, isKeyframe = false) => {
        rules.forEach((rule) => {
            switch (rule.type) {
                case Nodes.STYLE_RULE:
                    const { selector, parent } = rule;
                    if (isKeyframe) {
                        rule.type = Nodes.KEYFRAME_RULE;
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
                case Nodes.IF:
                case Nodes.ELSE_IF:
                case Nodes.ELSE:
                case Nodes.FOR:
                case Nodes.MEDIA_RULE:
                case Nodes.SUPPORTS_RULE:
                    rule.selectors = rule.parent?.selectors;
                    break;
                case Nodes.KEYFRAMES_RULE:
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
        if (type === Nodes.DOM_ELEMENT) {
            const tagType = tagTypeOf(node.tagName);
            node.type = tagType;
            switch (tagType) {
                case Nodes.HTML_ELEMENT:
                    processAttribute(node);
                    break;
                case Nodes.COMPONENT:
                    processAttribute(node);
                    break;
                // case Nodes.SVG_ELEMENT:
                //     break
                case Nodes.STYLE:
                    processAttribute(node);
                    var template = node.children?.[0].children;
                    if (template) {
                        var styleAst = parseCSS(template);
                        processRules(styleAst);
                        node.children = styleAst;
                        ctx.ignoreChildren = true;
                    }
                    break;
                case Nodes.IF:
                    node.condition = node.attributeMap['condition'];
                    node.isBranchStart = true;
                    break;
                case Nodes.ELSE_IF:
                    node.condition = node.attributeMap['condition'];
                    node.isBranch = true;
                    break;
                case Nodes.ELSE:
                    node.isBranch = true;
                    break;
                case Nodes.FOR:
                    node.iterator = parseIterator(node.attributeMap['iterator']);
                    break;
                case Nodes.TEMPLATE:
                    processAttribute(node);
                    break;
                case Nodes.SLOT:
                    break;
            }
        }
        else if (type === Nodes.TEXT) {
            node.children = parseText(node.children);
            ctx.ignoreChildren = true;
            return;
        }
        else if (type === Nodes.HTML_COMMENT) ;
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
        toHandlerKey,
        normalizeClass,
        normalizeStyle,
        renderSlot
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
            return genFragment(toArray(children));
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
    const genFor = (target, iterator) => callFn(renderMethodsNameMap.renderList, iterator.iterable, toArrowFunction(target, iterator.items), ustringid() /* 显示的在迭代器中传入掺入一个key，每次渲染时这个key不变，并且子节点会根据索引生成唯一key,只需要子层级即可 */);
    const genIf = (target, condition) => ternaryExp(condition, target, 'null');
    function genForWithFragment(target, iterator) {
        return genFragment(genFor(target, iterator));
    }
    const genDirectives = (target, dirs) => {
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
                case Nodes.IF:
                    target = genIf(target, dir.condition);
                    break;
                case Nodes.FOR:
                    target = genForWithFragment(target, dir.iterator);
                    break;
                case Nodes.SLOT:
                    // where there is a slot directive on a element or component , the target will be the backup content
                    var slotName = toBackQuotes(dir.value || 'default');
                    target = callFn(renderMethodsNameMap.renderSlot, slotName, target);
                    break;
            }
            return genDirectives(target, dirs);
        }
    };
    function genChildrenString(children, context) {
        return toArray(genChildren(children, context));
    }
    function genNode(node, context) {
        switch (node.type) {
            case Nodes.IF:
            case Nodes.ELSE_IF:
            case Nodes.ELSE:
                return genNodes(node.children, context);
            case Nodes.FOR:
                // use for tag not directive
                return genForWithFragment(genNodes(node.children, context), node.iterator);
            case Nodes.TEMPLATE:
                var code = genNodes(node.children, context);
                if (node.dirs) {
                    code = genDirectives(code, node.dirs);
                }
                return code;
            case Nodes.SLOT:
                var slotName = toBackQuotes(node.attributeMap.name || 'default');
                var backup = genNodes(node.children, context);
                return callFn(renderMethodsNameMap.renderSlot, slotName, backup);
            case Nodes.HTML_ELEMENT:
                const tagName = toBackQuotes(node.tagName); // required
                var children = node.children ? genChildrenString(node.children, context) : 'null';
                const props = genProps(node);
                var code = callFn(renderMethodsNameMap.createElement, tagName, props, children, ustringid());
                if (node.dirs) {
                    code = genDirectives(code, node.dirs);
                }
                return code;
            case Nodes.SVG_ELEMENT:
                return callFn(renderMethodsNameMap.createSVGElement);
            case Nodes.COMPONENT:
                var uVar = uvar();
                context.pushNewLine(declare(uVar, callFn(renderMethodsNameMap.getComponent, toBackQuotes(node.tagName))));
                return callFn(renderMethodsNameMap.createComponent, uVar);
            case Nodes.TEXT:
                return genText(node.children);
            case Nodes.STYLE:
                var code = callFn(renderMethodsNameMap.createStyleSheet, 'null', toArray(genChildren(node.children, context)), ustringid());
                if (node.dirs) {
                    code = genDirectives(code, node.dirs);
                }
                return code;
            case Nodes.STYLE_RULE:
                return callFn(renderMethodsNameMap.createStyle, genSelector(node.selectors), toArray(genChildren(node.children, context)), ustringid());
            case Nodes.MEDIA_RULE:
                const rules = toArray(genChildren(node.children, context));
                return callFn(renderMethodsNameMap.createMedia, toBackQuotes(node.media), rules, ustringid());
            case Nodes.KEYFRAMES_RULE:
                return callFn(renderMethodsNameMap.createKeyframes, toBackQuotes(node.keyframes), toArray(genChildren(node.children, context)), ustringid());
            case Nodes.KEYFRAME_RULE:
                return callFn(renderMethodsNameMap.createKeyframe, toBackQuotes(node.selector.selectorText), toArray(genChildren(node.children, context)), ustringid());
            case Nodes.SUPPORTS_RULE:
                return callFn(renderMethodsNameMap.createSupports, toBackQuotes(node.supports), toArray(genChildren(node.children, context)), ustringid());
            case Nodes.DECLARATION_GROUP:
                return callFn(renderMethodsNameMap.createDeclaration, genDeclartion(node.children), ustringid());
            default:
                return '';
        }
    }
    const genFragment = (code) => callFn(renderMethodsNameMap.createFragment, code, ustringid());
    const genTextContent = (texts) => {
        return texts.map((text) => {
            return text.isDynamic ? callFn(renderMethodsNameMap.display, text.content) : toBackQuotes(text.content);
        }).join('+');
    };
    const genText = (texts) => {
        return callFn(renderMethodsNameMap.createText, genTextContent(texts), ustringid());
    };
    /*
        while there is unknown selectors
        header,footer ? h1,h2
    */
    function genSelector(selectors) {
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
            callFn(renderMethodsNameMap.mergeSelectors, ...selectorCode);
        //! one dynamic selector will effect all 
    }
    // declaration and mixin
    function genDeclartion(declarationGroup) {
        var res = [];
        var lastIsDeclaration = false;
        declarationGroup.forEach((declaration) => {
            if (declaration.type === Nodes.MIXIN) {
                res.push(declaration.mixin);
                lastIsDeclaration = false;
            }
            else if (declaration.type === Nodes.DECLARATION) {
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
                const __value = isImportant ? callFn(renderMethodsNameMap.important, _value) : _value;
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
            return callFn(renderMethodsNameMap.mixin, ..._res);
        }
    }
    function genProps(node) {
        var { type, attributes } = node;
        if (!(attributes && attributes.length)) {
            return NULL;
        }
        var props = {};
        attributes.forEach((attr) => {
            switch (attr.type) {
                case Nodes.EVENT:
                    var { property, isDynamicProperty, value, isCalled, /* fn() */ argument, modifiers } = attr;
                    var handlerKey = isDynamicProperty ? dynamicMapKey(callFn(renderMethodsNameMap.toHandlerKey, property)) : toHandlerKey(property);
                    var callback = isCalled ? toArrowFunction(value) : value;
                    if (modifiers) {
                        callback = callFn(renderMethodsNameMap.createEvent, callback, toArray(modifiers.map(toBackQuotes)));
                    }
                    props[handlerKey] = callback;
                    break;
                /*
                    support mutiple class in one element
                    <h1
                        class="top"
                        class="warn"
                        $class="myCustomClass1"
                        $class="myCustomClass2"
                    >
                */
                case Nodes.CLASS:
                    var { isDynamicValue, value } = attr;
                    var _class = props.class ||= [];
                    _class.push(value);
                    break;
                case Nodes.STYLE:
                    var { isDynamicValue, value } = attr;
                    var style = props.style ||= [];
                    style.push(value);
                    break;
                case Nodes.HTML_ATTRIBUTE:
                    // normal attributes
                    var { property, value, isDynamicProperty, isDynamicValue, } = attr;
                    props[isDynamicProperty ? dynamicMapKey(property) : property] = isDynamicValue ? value : toBackQuotes(value);
                    break;
            }
        });
        // merge class , there could be more than one class
        if (props.class) {
            props.class = callFn(renderMethodsNameMap.normalizeClass, stringify(props.class));
        }
        if (props.style) {
            props.style = callFn(renderMethodsNameMap.normalizeStyle, stringify(props.style));
        }
        return stringify(props);
    }

    const createFunction = (content, ...params) => new Function(...params, `${content}`);
    class CodeGenerator {
        code = '';
        getCode = () => this.code;
        push = (code) => this.code += code;
        newLine = () => this.code += '\n';
        tab = () => this.code += '\t';
        pushNewLine = (code) => {
            this.newLine();
            this.push(code);
            this.newLine();
        };
        // input an expression and hoist to the context , and return the variable name
        hoistExpression = (expression) => {
            var varname = uvar();
            this.pushNewLine(declare(varname, expression));
            return varname;
        };
    }
    const RENDER_METHODS = 'renderMethods';
    const defaultCompilerConfig = {};
    const extend$1 = Object.assign;
    function compile(template, config = defaultCompilerConfig) {
        config &&= extend$1(defaultCompilerConfig, config);
        var ast = parseTemplate(template);
        console.log('nodeast', ast);
        var context = new CodeGenerator();
        // 初始化所有渲染方法
        context.push(declare(`{\n${Object.values(renderMethodsNameMap).join(',\n')}\n}`, RENDER_METHODS));
        var SCOPE = context.hoistExpression(callFn(renderMethodsNameMap.getCurrentScope));
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
            console.log('get');
            track(target, key);
            return target[key];
        },
        set(target, key, newValue) {
            console.log('set');
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

    /*
        binding is used for bind the callback context , it is necessary
    */
    function callHook(type, target, binding = null, ...args) {
        const hooks = target[type];
        if (!hooks)
            return;
        hooks.forEach((hook) => hook.apply(binding, args));
    }

    exports.ComponentOptions = void 0;
    (function (ComponentOptions) {
        ComponentOptions["BEFORE_CREATE"] = "beforeCreate";
        ComponentOptions["CREATE"] = "create";
        // setup funcition
        ComponentOptions["CREATED"] = "created";
        ComponentOptions["BEFORE_MOUNT"] = "beforeMount";
        ComponentOptions["MOUNTED"] = "mounted";
        ComponentOptions["BEFORE_UPDATE"] = "beforeUpdate";
        ComponentOptions["UPDATED"] = "updated";
        ComponentOptions["BEFORE_UNMOUNT"] = "beforeUnmount";
        ComponentOptions["UNMOUNTED"] = "unmounted";
        ComponentOptions["TEMPLATE"] = "template";
        ComponentOptions["MIXINS"] = "mixins";
        ComponentOptions["COMPOENNTS"] = "components";
        ComponentOptions["DIRECTIVES"] = "directives";
    })(exports.ComponentOptions || (exports.ComponentOptions = {}));
    const initOptions = (options, target = null) => {
        var initTarget, isMixin = false;
        if (target) {
            initTarget = target;
            isMixin = true;
        }
        else {
            initTarget = options;
        }
        for (let key in options) {
            switch (key) {
                // root options only
                case exports.ComponentOptions.TEMPLATE:
                    initTarget.createRender = compile(options[exports.ComponentOptions.TEMPLATE]);
                    console.log('RENDER_CREATOR', initTarget.createRender);
                    break;
                case exports.ComponentOptions.CREATE:
                    options["create" /* CREATE */] = [options["create" /* CREATE */]];
                    break;
                case exports.ComponentOptions.CREATED:
                    options["created" /* CREATED */] = [options["created" /* CREATED */]];
                    break;
                case exports.ComponentOptions.BEFORE_MOUNT:
                    options["beforeMount" /* BEFORE_MOUNT */] = [options["beforeMount" /* BEFORE_MOUNT */]];
                    break;
                case exports.ComponentOptions.MOUNTED:
                    options["mounted" /* MOUNTED */] = [options["mounted" /* MOUNTED */]];
                    break;
                case exports.ComponentOptions.BEFORE_UNMOUNT:
                    options["beforeUnmount" /* BEFORE_UNMOUNT */] = [options["beforeUnmount" /* BEFORE_UNMOUNT */]];
                    break;
                case exports.ComponentOptions.UNMOUNTED:
                    options["unmounted" /* UNMOUNTED */] = [options["unmounted" /* UNMOUNTED */]];
                    break;
                case exports.ComponentOptions.BEFORE_UPDATE:
                    options["beforeUpdate" /* BEFORE_UPDATE */] = [options["beforeUpdate" /* BEFORE_UPDATE */]];
                    break;
                case exports.ComponentOptions.UPDATED:
                    options["updated" /* UPDATED */] = [options["updated" /* UPDATED */]];
                    break;
                case exports.ComponentOptions.MIXINS:
                    options[exports.ComponentOptions.MIXINS].forEach((mixin) => {
                        initOptions(mixin, initTarget);
                    });
                    break;
            }
        }
        if (!isMixin) {
            options._isOptions = true;
        }
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
        // style
        setProperty: (style, property, value, important = false) => style.setProperty(hyphenate(property), value, important ? IMPORTANT : '')
    };

    function getDeclarationValue(rawValue) {
        var value, important;
        if (!rawValue) {
            value = null; // 这里不能用空字符串，因为会进入下面的判断
            important = false;
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
        return {
            value,
            important
        };
    }
    function updateDeclaration(pDeclaration, nDeclaration, style, vnode) {
        var delList = Object.keys(pDeclaration ||= EMPTY_MAP);
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
        updateDeclaration(EMPTY_MAP, declaration, style);
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
        mountSheet(sheet, rules);
    };
    function mountSheet(sheet, rules, vnode) {
        rules.forEach((rule) => {
            switch (rule.nodeType) {
                case Nodes.STYLE_RULE:
                    mountStyleRule(sheet, rule);
                    break;
                case Nodes.MEDIA_RULE:
                    mountMediaRule(sheet, rule);
                    break;
                case Nodes.SUPPORTS_RULE:
                    mountSupportsRule(sheet, rule);
                    break;
                case Nodes.KEYFRAMES_RULE:
                    mountKeyframesRule(sheet, rule);
                    break;
                case Nodes.KEYFRAME_RULE:
                    mountKeyframeRule(sheet, rule);
                    break;
            }
        });
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
        Object.entries(declaration).forEach(([key, value]) => {
            key = hyphenate(key); // the property shoule be uncamelized
            var { value, important } = getDeclarationValue(value);
            insertedRuleStyle.setProperty(key, value, important ? IMPORTANT : '');
        });
    }
    function mountMediaRule(sheet, rule, vnode, insertIndex = sheet.cssRules.length) {
        var media = rule.media;
        var rules = rule.children;
        var index = sheet.insertRule(`@media ${media}{}`, insertIndex);
        var newSheet = sheet.cssRules[index];
        mountSheet(newSheet, rules);
    }
    function mountSupportsRule(sheet, rule, vnode, insertIndex = sheet.cssRules.length) {
        var supports = rule.supports;
        var rules = rule.children;
        var index = sheet.insertRule(`@supports ${supports}{}`, insertIndex);
        var newSheet = sheet.cssRules[index];
        mountSheet(newSheet, rules);
    }
    function mountKeyframesRule(sheet, rule, vnode, insertIndex = sheet.cssRules.length) {
        var keyframes = rule.keyframes;
        var rules = rule.children;
        var index = sheet.insertRule(`@keyframes ${keyframes}{}`, insertIndex);
        rule.ref = sheet.cssRules[insertIndex];
        var newSheet = sheet.cssRules[index];
        mountSheet(newSheet, rules);
    }
    function mountKeyframeRule(sheet, rule, vnode, insertIndex = sheet.cssRules.length) {
        var { keyframe, children: declaration } = rule;
        keyframe = isNumber(Number(keyframe)) ? `${keyframe}%` : keyframe; // 关键帧支持数字的写法 
        // appendRule wont return the index 
        sheet.appendRule(`${keyframe}{}`);
        var index = sheet.cssRules.length - 1;
        const insertedRule = sheet.cssRules[index];
        rule.ref = insertedRule; // set ref
        const insertedRuleStyle = insertedRule.style;
        Object.entries(declaration).forEach(([property, value]) => {
            property = hyphenate(property); // the property shoule be uncamelized
            var { value } = getDeclarationValue(value);
            // keyframe 中不能设置important
            nodeOps.setProperty(insertedRuleStyle, property, value);
        });
    }

    // for renderer
    const onRE = /^on[A-Z]/;
    const isEvent = (key) => onRE.test(key);
    const getEventName = (handlerKey) => {
        return handlerKey.split('on')[1].toLowerCase();
    };
    // for compiler
    function toHandlerKey(event) {
        return `on${capitalize(event)}`;
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

    function mount(vnode, container, anchor) {
        const type = vnode.nodeType;
        switch (type) {
            case Nodes.HTML_ELEMENT:
                mountHTMLElement(vnode, container, anchor);
                break;
            case Nodes.TEXT:
                mountText(vnode, container, anchor);
                break;
            case Nodes.FRAGMENT:
                mountFragment(vnode, container, anchor);
                break;
            case Nodes.STYLE:
                mountStyleSheet(vnode, container);
                break;
        }
    }
    function mountFragment(vnode, container, anchor) {
        mountChildren(vnode.children, container, anchor);
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
        const { type, props, children } = vnode;
        var ref = document.createElement(type);
        vnode.ref = ref;
        if (props) {
            // mount props
            Object.entries(props).forEach(([key, value]) => {
                if (isEvent(key)) {
                    var event = getEventName(key);
                    ref.addEventListener(event, value);
                }
                else if (key === NodesMap[Nodes.CLASS]) {
                    // mount class
                    var className = Object.keys(value).filter((classKey) => value[classKey]).join(' ');
                    ref.className = className;
                }
                else if (key === NodesMap[Nodes.STYLE]) {
                    mountDeclaration(value, ref.style);
                }
                else {
                    // normal attribute
                    ref.setAttribute(key, value);
                }
            });
        }
        callHook("created" /* CREATED */, vnode, ref);
        callHook("beforeMount" /* BEFORE_MOUNT */, vnode, ref);
        nodeOps.insert(ref, container, anchor);
        callHook("mounted" /* MOUNTED */, vnode);
        if (children) {
            mountChildren(children, ref, anchor);
        }
    }

    function unmount(vnode, container, anchor) {
        switch (vnode.nodeType) {
            case Nodes.HTML_ELEMENT:
                if (vnode.children) {
                    unmountChildren(vnode.children);
                }
                nodeOps.remove(vnode.ref);
                break;
            case Nodes.TEXT:
                nodeOps.remove(vnode.ref);
                break;
        }
    }
    function unmountChildren(children) {
        // 卸载过程目前不需要锚点
        children.forEach(unmount);
    }

    const insertNull = (arr, index, length = 1) => arr.splice(index, 0, ...new Array(length).fill(null));
    const normalizeKeyframe = (keyframe) => isNumber(Number(keyframe)) ? `${keyframe}%` : keyframe;

    const updateStyleSheet = (p, n) => {
        var ref = n.ref = p.ref;
        var sheet = ref.sheet;
        /*
            更新style元素的props，并且处理特殊属性如，unit,url 等
        */
        updateSheet(p.children, n.children, sheet);
    };
    /*
        selector
        media could be updated by mediaList , appendMedium and deleteMedium
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
    function updateSheet(p, n, sheet, vnode) {
        /*
            与更新dom元素不同，规则中只要patchKey相同就一定会复用,
            更新过程依赖patchkey
            patchkey 作为第一优先级
            其次为nodetype,
            !还是假设key相同的节点顺序一定不会变，
        */
        p.length;
        var nLength = n.length;
        var { map: pMap, list: pList } = createMapAndList(p);
        createMapAndList(n);
        var pMoved = 0;
        for (let i = 0; i < nLength; i++) {
            /*
                此次循环用于将两组规则的相同key对应到相同的索引下
            */
            var node = n[i];
            var patchKey = node.patchKey;
            var sameNode = pMap[patchKey];
            if (sameNode) {
                // 存在key相同的节点
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
        /*
            经过第一次处理后，还需要进行第二次处理，目的是只有nodeType类型相同的节点会属于相同的节点，其他一律用空节点代替，因为一定会挂载或卸载，
            抛出同一索引下节点类型不相同的情况
        */
        var maxLength = Math.max(p.length, n.length);
        for (let i = 0; i < maxLength; i++) {
            var pRule = p[i];
            var nRule = n[i];
            /*
                不存在两个对应位置都为空的情况
            */
            if (!pRule) {
                switch (nRule.nodeType) {
                    case Nodes.STYLE_RULE:
                        mountStyleRule(sheet, nRule);
                        break;
                }
            }
            else if (!nRule) {
                sheet.deleteRule(i);
            }
            else if (pRule.nodeType !== nRule.nodeType) {
                // 当节点类型不同时，先卸载，再挂载
                sheet.deleteRule(i);
                switch (nRule.nodeType) {
                    case Nodes.STYLE_RULE:
                        mountStyleRule(sheet, nRule);
                        break;
                }
            }
            else {
                // update
                switch (nRule.nodeType) {
                    case Nodes.STYLE_RULE:
                        updateStyleRule(pRule, nRule);
                        break;
                    case Nodes.MEDIA_RULE:
                        updateMediaRule(pRule, nRule);
                        break;
                    case Nodes.SUPPORTS_RULE:
                        break;
                    case Nodes.KEYFRAMES_RULE:
                        updateKeyframesRule(pRule, nRule);
                        break;
                }
            }
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
        updateSheet(pRules, nRules, ref);
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
        switch (n.nodeType) {
            case Nodes.TEXT:
                var ref = n.ref = p.ref;
                if (p.children !== n.children) {
                    ref.textContent = n.children;
                }
                break;
            case Nodes.HTML_ELEMENT:
                /*
                    update props
                */
                n.ref = p.ref;
                updateChildren(p.children, n.children, container);
                break;
            case Nodes.FRAGMENT:
                updateChildren(p.children, n.children, container);
                break;
            case Nodes.STYLE:
                updateStyleSheet(p, n);
                break;
        }
    }
    function createKeyMapAndList(children) {
        var map = {};
        var list = children.map((node) => {
            var { patchKey, type } = node;
            var status = {
                patchKey,
                type,
                node
            };
            map[patchKey] = status;
            return status;
        });
        return {
            map, list
        };
    }
    function updateChildren(pChildren, nChildren, container, anchor) {
        /*
            相同key的节点类型不一定相同，
            只有类型和key都相同的节点车才会作为同一节点复用，
            不同类型的节点一定会卸载，
            当节点类型相同但key不同并且需要复用时，会进入假挂载和卸载阶段，只是为了相关钩子的调用，并不会真卸载当前元素，
            ! 所有节点一定有唯一key
        */
        /* 此时应该优化，考虑是否要把fragment平铺好 */
        var p = pChildren;
        var n = nChildren;
        // 使用patchkey，不使用key
        var pLength = p.length;
        var nLength = n.length;
        var { map: pMap, list: pList } = createKeyMapAndList(p);
        var { map: nMap, list: nList } = createKeyMapAndList(n);
        var max = pLength < nLength ? n : p;
        var maxLength = max.length;
        var minMap = max === n ? pMap : nMap;
        var maxList = max === p ? pList : nList;
        /*
            新的diff策略，
            首先假设key相同的节点顺序是一定不会变的，
            然后使用一种填充策略，
            将短的一组经过填充，得到两个相同的序列，
            然后在逐一对比，
            因为key和类型均相同的节点是一定不会乱序的，
            所以直接填充即可，直接填充空节点即可
        */
        var newList = [];
        /*
            目标是将短列表的所有节点塞入到新建的模拟列表中,并且将对应的位置填充上，
            此时遍历只能处理key和type均相同的节点并复用，对于key不同但能复用节点，还不能处理
        */
        maxList.forEach((n, index) => {
            var { patchKey, type } = n;
            if (minMap[patchKey] && minMap[patchKey].type === type) {
                // 存在相同key的节点
                newList[index] = minMap[patchKey].node;
            }
        });
        // 最终结果用max和newList逐一patch      
        var current = max === n ? newList : max;
        var next = max === n ? max : newList;
        for (let i = 0; i < maxLength; i++) {
            patch(current[i], next[i], container, getAnchor(current, i + 1));
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
        /*
            both the current and next have there situations
            null | false , as empty node
            single node
            array node
        */
        if (!current) {
            if (next) {
                isArray(next) ? mountChildren(next, container, anchor) : mount(next, container, anchor);
            }
        }
        /*
        ! 两组树均存在节点
         两种都有的情况，并且两组节点都可能存在单个节点或数组节点
         所以当两组节点都只有一个元素时，即使类型相同，也会进入到diff环节
        */
        if (current) {
            if (!next) {
                // 卸载当前节点
                isArray(next) ? unmountChildren(current) : unmount(current);
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
                        if (current.type === next.type) {
                            // 类型相同，直接更新
                            update(current, next, container);
                        }
                        else {
                            // 类型不同。先卸载，在挂载
                            unmount(current);
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
            switch (rule.nodeType) {
                case Nodes.STYLE_RULE:
                    flattedRules.push(rule);
                    var _children = rule.children;
                    rule.children = null;
                    if (_children) {
                        doFlat(_children, flattedRules, rule);
                    }
                    break;
                case Nodes.DECLARATION:
                    if (!rule.parent) {
                        debugger;
                        // 声明不再任何样式规则或媒体规则下时,应该报错
                    }
                    else if (rule.parent.nodeType === Nodes.STYLE_RULE) {
                        (rule.parent.children ||= []).push(rule);
                    }
                    else if (rule.parent.nodeType === Nodes.KEYFRAME_RULE) {
                        (rule.parent.children ||= []).push(rule);
                    }
                    else {
                        /*
                            当一条样式声明不时样式规则的子节点
                        */
                        if (rule.parent.nodeType === Nodes.MEDIA_RULE) {
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
                                throwError('当前样式声明不存在选择器下');
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
                case Nodes.MEDIA_RULE:
                    rule.children = flatRules(rule.children, rule);
                    flattedRules.push(rule);
                    break;
                case Nodes.SUPPORTS_RULE:
                    rule.children = flatRules(rule.children);
                    flattedRules.push(rule);
                    break;
                case Nodes.KEYFRAMES_RULE:
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
                case Nodes.KEYFRAME_RULE:
                    /* 需要和styleRule处理方式一样 */
                    flattedRules.push(rule);
                    var _children = rule.children;
                    rule.children = null;
                    if (_children) {
                        doFlat(_children, flattedRules, rule);
                    }
                    break;
                case Nodes.FRAGMENT:
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
            if (rule.nodeType === Nodes.STYLE_RULE) {
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
                if (child.nodeType === Nodes.FRAGMENT) {
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
                    if (child.nodeType === Nodes.HTML_ELEMENT) {
                        // 子节点递归处理
                        child.children = processdom(child.children);
                    }
                    if (child.nodeType === Nodes.STYLE) {
                        child.children = flatRules(child.children, null, child.patchKey);
                    }
                    flattedNode.push(child);
                }
            }
        });
        return flattedNode;
    }

    // if you are using css function with dynamic binding , use camelized function name 
    function completionUnit(value, unit = '%') {
        return isNumber(value) ? `${value}unit` : value;
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
        ${completionUnit(s)},
        ${completionUnit(l)},
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
        min
    };

    var proto = {
        ...cssFunctions
    };
    var initScope = () => Object.create(proto);

    function createCommonComponentInstance(options) {
        if (!options._isOptions) {
            initOptions(options);
        }
        const instance = {
            uid: uid(),
            scope: reactive(initScope()),
            render: null,
            currentTree: null,
            createRender: options.createRender,
            components: options.components || getEmptyMap(),
            directives: options.direvtives || getEmptyMap(),
            // hooks will always be an array
            ["create" /* CREATE */]: options["create" /* CREATE */] && [...options["create" /* CREATE */]],
            ["created" /* CREATED */]: options["created" /* CREATED */] && [...options["created" /* CREATED */]],
            ["beforeMount" /* BEFORE_MOUNT */]: options["beforeMount" /* BEFORE_MOUNT */] && [...options["beforeMount" /* BEFORE_MOUNT */]],
            ["mounted" /* MOUNTED */]: options["mounted" /* MOUNTED */] && [...options["mounted" /* MOUNTED */]],
            ["beforeUnmount" /* BEFORE_UNMOUNT */]: options["beforeUnmount" /* BEFORE_UNMOUNT */] && [...options["beforeUnmount" /* BEFORE_UNMOUNT */]],
            ["unmounted" /* UNMOUNTED */]: options["unmounted" /* UNMOUNTED */] && [...options["unmounted" /* UNMOUNTED */]],
            ["beforeUpdate" /* BEFORE_UPDATE */]: options["beforeUpdate" /* BEFORE_UPDATE */] && [...options["beforeUpdate" /* BEFORE_UPDATE */]],
            ["updated" /* UPDATED */]: options["updated" /* UPDATED */] && [...options["updated" /* UPDATED */]]
        };
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
    const mountComponent = (vnode, container) => {
        var { type: options } = vnode;
        var instance = createCommonComponentInstance(options);
        const { scope, createRender, } = instance;
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
            const { isMounted, currentTree } = instance;
            // 每次更新生成新树
            var nextTree = render();
            // 处理fragment
            nextTree = processdom(nextTree);
            console.log('currentTree', currentTree);
            console.log('nextTree', nextTree);
            // test hooks
            callHook(isMounted ? "beforeUpdate" /* BEFORE_UPDATE */ : "beforeMount" /* BEFORE_MOUNT */, instance, scope, scope);
            patch(currentTree, nextTree, container);
            callHook(isMounted ? "updated" /* UPDATED */ : "mounted" /* MOUNTED */, instance, scope, scope);
            instance.isMounted = true;
            instance.currentTree = nextTree;
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

    class App {
        el = null;
        isMounted = false;
        components = getEmptyMap();
        directives = getEmptyMap();
        rootOptions = null;
        rootInstance;
        mixins = null;
        constructor(rootOptions) {
            this.rootOptions = rootOptions;
        }
        component(name, options) {
            if (this.components[name]) {
                warn(`
                component has already registered
            `);
                return;
            }
            else if (isBuiltInTag(name)) {
                error(`
                failed to register component ,
                because it is a builtIn tagName
            `);
            }
            else {
                this.components[name] = options;
            }
        }
        directive(name, options) {
            if (this.directives[name]) {
                warn(`
                directive has already registered
            `);
                return;
            }
            else if (isBuiltInDirective(name)) {
                error(`
                failed to register directive ,
                because it is a builtIn directive
            `);
            }
            else {
                this.directives[name] = options;
            }
        }
        mount(container) {
            var el;
            if (isString(container)) {
                el = document.querySelector(container);
            }
            if (!el) {
                error(` not a legal container `);
                return;
            }
            var options = this.rootOptions;
            if (!options.template) {
                options.template = el.innerHTML;
            }
            el.innerHTML = '';
            var instance = mountComponent(createComponent(options, {}, {}), el);
            this.rootInstance = instance;
            this.el = el;
            this.isMounted = true;
            return instance;
        }
        unmount() {
        }
    }

    const createApp = (rootOptions) => new App(rootOptions);

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
        return getCurrentInstance().components[name];
    }
    function getDirective(name) {
        return getCurrentInstance().directives[name];
    }

    const toString = (_) => "'" + _ + "'";

    const inlineStyleDelimiter = /\s*[:;]\s*/;
    function parseInlineStyle(styleString) {
        var chips = styleString.split(inlineStyleDelimiter).filter(Boolean);
        var l = chips.length;
        var styleMap = {};
        while (l) {
            styleMap[camelize(chips[l - 2])] = toString(chips[l - 1]);
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
        toHandlerKey,
        normalizeClass,
        normalizeStyle,
        renderSlot
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
    exports.createKeyframe = createKeyframe;
    exports.createKeyframes = createKeyframes;
    exports.createMedia = createMedia;
    exports.createSVGElement = createSVGElement;
    exports.createStyle = createStyle;
    exports.createStyleSheet = createStyleSheet;
    exports.createSupports = createSupports;
    exports.createText = createText;
    exports.display = display;
    exports.effect = effect;
    exports.flatRules = flatRules;
    exports.getComponent = getComponent;
    exports.getCurrentInstance = getCurrentInstance;
    exports.getCurrentScope = getCurrentScope;
    exports.getDirective = getDirective;
    exports.important = important;
    exports.mergeSelectors = mergeSelectors;
    exports.mergeSplitedSelectorsAndJoin = mergeSplitedSelectorsAndJoin;
    exports.mixin = mixin;
    exports.mountComponent = mountComponent;
    exports.nextTick = nextTick;
    exports.nextTickSingleWork = nextTickSingleWork;
    exports.normalizeClass = normalizeClass;
    exports.normalizeStyle = normalizeStyle;
    exports.reactive = reactive;
    exports.renderList = renderList;
    exports.renderSlot = renderSlot;
    exports.setCurrentInstance = setCurrentInstance;
    exports.splitSelector = splitSelector;
    exports.toHandlerKey = toHandlerKey;
    exports.useState = useState;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
