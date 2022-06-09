(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Crush = {}));
})(this, (function (exports) { 'use strict';

    function setDisplay(el, show) {
        if (show) {
            el.style.display = el._display;
        }
        else {
            el.style.display = 'none';
        }
    }
    const show = {
        beforeMount(el, { value }) {
            el._display = el.style.display;
            setDisplay(el, value);
        },
        updated(el, { value, oldValue }) {
            if (!value !== !oldValue) {
                setDisplay(el, value);
            }
        }
    };

    const model = {
        beforeCreate() {
        },
        created() {
        },
        beforeMount() {
        },
        mounted() {
        },
        beforeUpdate(el, infos, vnode) {
            vnode.props._assigner;
            debugger;
        },
        updated() {
        },
        beforeUnmount() {
        },
        unmounted() {
        }
    };

    /*
        transition for single Element
    */
    const transition = {
        beforeMount() {
            debugger;
        }
    };

    const builtInComponents = {};
    const builtInDirectives = {
        show,
        model,
        transition
    };

    const cache = (fn) => {
        const cache = Object.create(null);
        return ((key) => {
            const cached = cache[key];
            return cached === undefined ? (cache[key] = fn(key)) : cached;
        });
    };

    const warn = (...msg) => console.warn(...msg);
    const error = (msg) => {
        throw `${msg}`;
    };

    function getEmptyObject() {
        return Object.create(null);
    }
    var id = 0;
    const uid = () => id++;
    const uStringId = () => String(uid());
    const uVar = () => `_${uid()}`;
    const emptyObject = Object.freeze({});
    const emptyArray = Object.freeze([]);

    const arrayToMap = (arr, mapValue = true) => arr.reduce((res, item) => {
        res[item] = mapValue;
        return res;
    }, getEmptyObject());
    const stringToMap = (str, delimiter) => arrayToMap(str.split(delimiter));
    // from vue
    const makeMap = (str, delimiter = ',') => {
        var map = arrayToMap(str.split(delimiter));
        return (key) => !!map[key];
    };

    const removeFromArray = (arr, item) => {
        var index = arr.indexOf(item);
        if (index < 0)
            return false;
        arr.splice(index, 1);
        return true;
    };

    function exec(target, extractor) {
        return extractor.exec(target);
    }
    function execCaptureGroups(target, extractor) {
        var res = exec(target, extractor);
        if (!res) {
            return null;
        }
        else {
            var [_, ...captureGroups] = res;
            return captureGroups;
        }
    }

    function isNumber(value) {
        return typeof value === 'number' && value !== NaN;
    }
    function isString(value) {
        return typeof value === 'string';
    }
    const isNumberString = (value) => isNumber(Number(value));
    const isObject = (value) => objectToString.call(value) === '[object Object]';
    const isUndefined = (value) => typeof value === 'undefined';
    const isFunction = (value) => typeof value === 'function';
    const objectToString = Object.prototype.toString;
    function typeOf(value) {
        // ! do not toLowerCase
        return objectToString.call(value).slice(8, -1);
    }
    const isArray = Array.isArray;

    const camelizeRE = /(\w)-(\w)/g;
    const camelize = cache((str) => str.replace(camelizeRE, (_, l, r) => {
        return l + r.toUpperCase();
    }));
    const hyphenateRE = /\B([A-Z])/g;
    const hyphenate = cache((str) => str.replace(hyphenateRE, '-$1').toLowerCase());
    const capitalize = cache((str) => str.charAt(0).toUpperCase() + str.slice(1));

    const hasOwnProperty = Object.prototype.hasOwnProperty;
    const hasOwn = (target, key) => hasOwnProperty.call(target, key);

    const svgNS = 'http://www.w3.org/2000/svg';
    const addClass = (el, className) => el.classList.add(className);
    const removeClass = (el, className) => el.classList.remove(className);
    const docCreateElement = (tagName, isSVG = false) => isSVG ? document.createElementNS(svgNS, tagName) : document.createElement(tagName);
    const docCreateComment = (text) => document.createComment(text);
    const docCreateText = (text) => document.createTextNode(text);
    const setText = (textEl, text) => textEl.nodeValue = text;
    const insertElement = (child, parent, anchor = null) => {
        /* 可能传入不合理的anchor */
        if (anchor && anchor.parentElement !== parent) {
            anchor = null;
        }
        parent.insertBefore(child, anchor);
    };
    const removeElement = (el) => {
        const parent = el.parentNode;
        if (parent) {
            parent.removeChild(el);
        }
    };
    const setAttribute = (el, attribute, value) => el.setAttribute(attribute, value);
    const removeAttribute = (el, attribute) => el.removeAttribute(attribute);
    const addEventListener = (el, event, handler, options = null) => el.addEventListener(event, handler, options);
    const removeEventListener = (el, event, handler, options = null) => el.removeEventListener(event, handler, options);
    function onceListener(el, event, handler, options = null) {
        var onceHandler = () => {
            handler();
            removeEventListener(el, event, onceHandler, options);
        };
        addEventListener(el, event, onceHandler, options);
    }

    exports.Nodes = void 0;
    (function (Nodes) {
        Nodes[Nodes["NULL"] = 0] = "NULL";
        Nodes[Nodes["FRAGMENT"] = 1] = "FRAGMENT";
        Nodes[Nodes["TEMPLATE"] = 2] = "TEMPLATE";
        Nodes[Nodes["IF"] = 3] = "IF";
        Nodes[Nodes["ELSE_IF"] = 4] = "ELSE_IF";
        Nodes[Nodes["ELSE"] = 5] = "ELSE";
        Nodes[Nodes["FOR"] = 6] = "FOR";
        Nodes[Nodes["ATTRIBUTE"] = 7] = "ATTRIBUTE";
        Nodes[Nodes["DOM_ELEMENT"] = 8] = "DOM_ELEMENT";
        Nodes[Nodes["SVG_ELEMENT"] = 9] = "SVG_ELEMENT";
        Nodes[Nodes["HTML_COMMENT"] = 10] = "HTML_COMMENT";
        Nodes[Nodes["DYNAMIC_ELEMENT"] = 11] = "DYNAMIC_ELEMENT";
        Nodes[Nodes["TEXT"] = 12] = "TEXT";
        Nodes[Nodes["HTML_ELEMENT"] = 13] = "HTML_ELEMENT";
        Nodes[Nodes["COMPONENT"] = 14] = "COMPONENT";
        Nodes[Nodes["DYNAMIC_COMPONENT"] = 15] = "DYNAMIC_COMPONENT";
        Nodes[Nodes["STYLE"] = 16] = "STYLE";
        // class contain dynamic class and static class
        Nodes[Nodes["CLASS"] = 17] = "CLASS";
        Nodes[Nodes["DYNAMIC_CLASS"] = 18] = "DYNAMIC_CLASS";
        Nodes[Nodes["STATIC_CLASS"] = 19] = "STATIC_CLASS";
        Nodes[Nodes["AT"] = 20] = "AT";
        Nodes[Nodes["MEDIA_RULE"] = 21] = "MEDIA_RULE";
        Nodes[Nodes["SUPPORTS_RULE"] = 22] = "SUPPORTS_RULE";
        Nodes[Nodes["KEYFRAMES_RULE"] = 23] = "KEYFRAMES_RULE";
        Nodes[Nodes["EVENT"] = 24] = "EVENT";
        Nodes[Nodes["STYLE_RULE"] = 25] = "STYLE_RULE";
        Nodes[Nodes["KEYFRAME_RULE"] = 26] = "KEYFRAME_RULE";
        /*
         declarationGroup is contain declaratin and mixin
        */
        Nodes[Nodes["DECLARATION_GROUP"] = 27] = "DECLARATION_GROUP";
        Nodes[Nodes["DECLARATION"] = 28] = "DECLARATION";
        Nodes[Nodes["MIXIN"] = 29] = "MIXIN";
        Nodes[Nodes["UNKNOWN"] = 30] = "UNKNOWN";
        Nodes[Nodes["DIRECTIVE_FLAG"] = 31] = "DIRECTIVE_FLAG";
        Nodes[Nodes["BUILTIN_DIRECTIVE"] = 32] = "BUILTIN_DIRECTIVE";
        Nodes[Nodes["CUSTOM_DIRECTIVE"] = 33] = "CUSTOM_DIRECTIVE";
        // use slot
        Nodes[Nodes["SLOT"] = 34] = "SLOT";
        // define slot
        Nodes[Nodes["OUTLET"] = 35] = "OUTLET";
        // form binding
        Nodes[Nodes["MODEL"] = 36] = "MODEL";
        Nodes[Nodes["RESERVED_PROP"] = 37] = "RESERVED_PROP";
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
        NodesMap[NodesMap["slot"] = 34] = "slot";
        NodesMap[NodesMap["outlet"] = 35] = "outlet";
        NodesMap[NodesMap["..."] = 29] = "...";
        NodesMap[NodesMap["@"] = 20] = "@";
        NodesMap[NodesMap["--"] = 31] = "--";
        NodesMap[NodesMap["media"] = 21] = "media";
        NodesMap[NodesMap["keyframes"] = 23] = "keyframes";
        NodesMap[NodesMap["supports"] = 22] = "supports";
        NodesMap[NodesMap["style"] = 16] = "style";
        NodesMap[NodesMap["class"] = 17] = "class";
        NodesMap[NodesMap["template"] = 2] = "template";
        NodesMap[NodesMap["element"] = 11] = "element";
        NodesMap[NodesMap["component"] = 15] = "component";
        NodesMap[NodesMap["model"] = 36] = "model";
    })(exports.NodesMap || (exports.NodesMap = {}));
    function keyOf(nodeType) {
        return exports.NodesMap[nodeType];
    }

    const SYMBOL_ITERATOR$1 = Symbol.iterator;

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

    function createNode(nodeType) {
        return {
            key: null,
            nodeType,
            type: null,
            props: null,
            children: null
        };
    }
    function createComponent(type, props, slots, key = uid()) {
        var component = createNode(exports.Nodes.COMPONENT);
        component.type = type;
        component.props = props;
        component.children = slots;
        component.key = key;
        return component;
    }
    function createElement(tagName, props, children, key = uid()) {
        var node = createNode(exports.Nodes.HTML_ELEMENT);
        node.type = tagName;
        node.props = props;
        node.children = children;
        node.key = key;
        return node;
    }
    const SYMBOL_TEXT = Symbol('Text');
    // the key is for other node
    function createText(text, key = uid()) {
        var node = createNode(exports.Nodes.TEXT);
        node.type = SYMBOL_TEXT;
        node.children = text;
        node.key = key;
        return node;
    }
    function createFragment(children, key = uid()) {
        const f = createNode(exports.Nodes.FRAGMENT);
        f.children = children;
        f.key = key;
        return f;
    }

    var createStyleSheet = (props, children, key = uid()) => {
        var node = createNode(exports.Nodes.STYLE);
        node.props = props;
        node.children = children;
        node.key = key;
        node.type = 'style'; // used for diff
        return node;
    };
    var createStyle = (selector, children, key) => {
        return {
            nodeType: exports.Nodes.STYLE_RULE,
            selector,
            children,
            key
        };
    };
    var createMedia = (media, children, key) => ({
        nodeType: exports.Nodes.MEDIA_RULE,
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
    var createSupports = (supports, children, key) => ({
        nodeType: exports.Nodes.SUPPORTS_RULE,
        supports,
        children,
        key
    });
    var createDeclaration = (children, key) => {
        return {
            nodeType: exports.Nodes.DECLARATION,
            /*
                render function 生成vdom时，会直接合并declaration和mixin，所以此时不再存在declaration group，而是用declaration替代 ， 在进行flat处理时也不会存在declarationgroup
            */
            //type: Nodes.DECLARATION_GROUP,
            children,
            key
        };
    };

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
                    else if (rule.parent.nodeType === exports.Nodes.STYLE_RULE) {
                        (rule.parent.children ||= []).push(rule);
                    }
                    else if (rule.parent.nodeType === exports.Nodes.KEYFRAME_RULE) {
                        (rule.parent.children ||= []).push(rule);
                    }
                    else {
                        /*
                            当一条样式声明不时样式规则的子节点
                        */
                        if (rule.parent.nodeType === exports.Nodes.MEDIA_RULE) {
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
                                debugger;
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
        var result = [];
        flatted.forEach((rule) => {
            if (rule.nodeType === exports.Nodes.STYLE_RULE) {
                /*
                    children有多个子元素时为在规则中含有其他规则或因为指令存在而打断连续性,
                    并且 ， 最终生成的vdom中不会出现declaration类型，而是直接使用map结构代替,
                    仅需要处理数组结构
                */
                if (isArray(rule.children)) {
                    const children = rule.children.map((r) => r.children);
                    rule.children = (rule.children.length === 0 ? null : mixin(...children));
                }
                // 去除没有children的 style rule
                if (rule.children) {
                    result.push(rule);
                }
            }
            else {
                result.push(rule);
            }
        });
        return result;
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
            if (!child)
                return; // 空节点筛除  
            if (child.nodeType === exports.Nodes.FRAGMENT) {
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
                if (child.nodeType === exports.Nodes.HTML_ELEMENT) {
                    // 子节点递归处理
                    child.children = processdom(child.children);
                }
                if (child.nodeType === exports.Nodes.STYLE) {
                    child.children = flatRules(child.children, null, child.patchKey);
                }
                flattedNode.push(child);
            }
        });
        return flattedNode;
    }

    const insertNull = (arr, index, length = 1) => arr.splice(index, 0, ...new Array(length).fill(null));
    const isReservedProp = (key) => key.startsWith(`_${key}`);
    const getReservedProp = (key) => key.slice(1);
    function unionkeys(...maps) {
        var _ = {};
        for (let i in maps || emptyObject) {
            for (let key in maps[i]) {
                _[key] = true;
            }
        }
        return Object.keys(_);
    }
    /*
        用于 props 的diff 算法 输入两个map类型，
        返回一个map ， 一个key 对应两个value
        例如：
        {
            key1 : [1,2] ,
            key2 : [3,4]
        }
    */
    function createMapEntries(...maps) {
        var res = {};
        for (let i in maps) {
            var map = maps[i];
            if (!map)
                continue;
            for (let key in map) {
                var value = map[key];
                var collection = res[key] ||= [];
                collection[i] = value;
            }
        }
        return res;
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

    const IMPORTANT_SYMBOL = Symbol('Important');
    const IMPORTANT_KEY = '!important';
    const IMPORTANT = 'important';
    function important(value) {
        return {
            value,
            [IMPORTANT_SYMBOL]: true
        };
    }

    // support number , from , to
    function normalizeKeyText(keyframe) {
        if (isArray(keyframe)) {
            return keyframe.map(normalizeKeyText).join(',');
        }
        if (isNumberString(keyframe)) {
            // 为数字或者数字字符串
            return `${keyframe}%`;
        }
        return `${keyframe}`;
    }
    const setKeyText = (keyframe, key) => keyframe.keyText = normalizeKeyText(key);
    const insertRule = (sheet, rule, index = sheet.cssRules.length) => sheet.insertRule(rule, index);
    const insertStyle = (sheet, selector, index) => insertRule(sheet, `${selector}{}`, index);
    const insertMedia = (sheet, media, index) => insertRule(sheet, `@media ${media}{}`, index);
    const insertSupports = (sheet, supports, index) => insertRule(sheet, `@supports ${supports}{}`, index);
    const insertKeyframes = (sheet, keyframes, index) => insertRule(sheet, `@keyframes ${keyframes}{}`, index);
    // appendRule wont return the index 
    const insertKeyframe = (sheet, keyText) => sheet.appendRule(`${normalizeKeyText(keyText)}{}`);
    const deleteRule = (sheet, index) => sheet.deleteRule(index);
    const deleteKeyframe = (keyframes, keyText) => keyframes.deleteRule(normalizeKeyText(keyText));
    // update
    const setSelector = (styleRule, selector) => styleRule.selectorText = selector;
    const setKeyframesName = (keyframesRule, name) => keyframesRule.name = name;
    const deleteMedium = (mediaRule, medium) => mediaRule.media.deleteMedium(medium);
    const appendMedium = (mediaRule, medium) => mediaRule.media.appendMedium(medium);
    const setStyleProperty = (style, property, value, important = false) => style.setProperty(hyphenate(property), value, important ? IMPORTANT : '');

    function parseStyleValue(rawValue) {
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
    function updateDeclaration(style, pDeclaration, nDeclaration) {
        pDeclaration ||= emptyObject;
        nDeclaration ||= emptyObject;
        for (let propName of unionkeys(pDeclaration, nDeclaration)) {
            var { value: pValue, important: pImportant } = parseStyleValue(pDeclaration[propName]);
            var { value: nValue, important: nImportant } = parseStyleValue(nDeclaration[propName]);
            if (pValue !== nValue || pImportant !== nImportant) {
                setStyleProperty(style, propName, nValue, nImportant);
            }
        }
    }
    function mountDeclaration(style, declaration) {
        return updateDeclaration(style, emptyObject, declaration);
    }
    // export 
    const setElementStyleDeclaration = (el, declaration) => mountDeclaration(el.style, declaration);
    function unmountDeclaration(style, declaration) {
        return updateDeclaration(style, declaration, emptyObject);
    }
    // ready for animation and transition
    function getStyleValue(style, key) {
        var property = hyphenate(key);
        var value = style.getPropertyValue(property);
        var isImportant = !!style.getPropertyPriority(property);
        return isImportant ? important(value) : value;
    }
    function getElementStyleValue(el, key) {
        return getStyleValue(el.style, key);
    }
    function getStyle(style, keys) {
        if (isObject(keys)) {
            keys = Object.keys(keys);
        }
        else if (isString(keys)) {
            keys = keys.split(',');
        }
        var declaration = {};
        for (let key of keys) {
            declaration[camelize(key)] = getStyleValue(style, key);
        }
        return declaration;
    }
    function getElementStyle(el, keys) {
        return getStyle(el.style, keys);
    }
    function getElementComputedStyle(el, keys) {
        return getStyle(window.getComputedStyle(el), keys);
    }

    function updateClass(el, pClass, nClass) {
        pClass ||= emptyObject;
        nClass ||= emptyObject;
        for (let className of unionkeys(pClass, nClass)) {
            var p = pClass[className];
            var n = nClass[className];
            p ? (n || removeClass(el, className)) : (n && addClass(el, className));
        }
    }
    function mountClass(_class, el) {
        updateClass(emptyObject, _class, el);
    }
    function unmountClass(el) {
        el.className = '';
    }
    function mountAttributes(el, props) {
        updateAttributes(el, emptyObject, props);
    }
    function updateAttributes(el, pProps, nProps) {
        pProps ||= emptyObject;
        nProps ||= emptyObject;
        for (let propName of unionkeys(pProps, nProps)) {
            var pValue = pProps[propName];
            var nValue = nProps[propName];
            if (isEvent(propName)) {
                if (pValue !== nValue) {
                    var { event, options } = parseHandlerKey(propName);
                    removeEventListener(el, event, pValue, options);
                    if (nValue) {
                        addEventListener(el, event, nValue, options);
                    }
                }
            }
            else if (propName === keyOf(exports.Nodes.STYLE)) {
                updateDeclaration(el.style, pValue, nValue);
            }
            else if (propName === keyOf(exports.Nodes.CLASS)) {
                updateClass(el, pValue, nValue);
            }
            else if (isReservedProp(propName)) {
                debugger;
            }
            else {
                // attribute
                (pValue !== nValue) && (nValue ? setAttribute(el, propName, nValue) : removeAttribute(el, propName));
            }
        }
    }
    // unmountAttribute

    /*
        mountStyleSheet will create a style element
    */
    const mountStyleSheet = (vnode, container, anchor) => {
        const { props, children } = vnode;
        var el = docCreateElement('style');
        mountAttributes(el, props);
        vnode.el = el;
        insertElement(el, container, anchor);
        var sheet = el.sheet;
        mountSheet(sheet, children, vnode);
    };
    function mountSheet(sheet, rules, vnode) {
        rules.forEach((rule) => {
            mountRule(sheet, rule, vnode);
        });
    }
    function mountRule(sheet, rule, vnode, index = sheet.cssRules.length) {
        switch (rule.nodeType) {
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
        const { selector, children: declaration } = rule;
        if (!declaration)
            return;
        const index = insertStyle(sheet, selector, insertIndex);
        const insertedRule = sheet.cssRules[index];
        rule.rule = insertedRule; // set rule
        const insertedRuleStyle = insertedRule.style;
        mountDeclaration(insertedRuleStyle, declaration);
    }
    function mountMediaRule(sheet, rule, vnode, insertIndex = sheet.cssRules.length) {
        var media = rule.media;
        var rules = rule.children;
        if (isArray(media)) {
            media = media.join(',');
        }
        var index = insertMedia(sheet, media, insertIndex);
        var newSheet = sheet.cssRules[index];
        rule.rule = newSheet;
        mountSheet(newSheet, rules, vnode);
    }
    function mountSupportsRule(sheet, rule, vnode, insertIndex = sheet.cssRules.length) {
        var supports = rule.supports;
        var rules = rule.children;
        var index = insertSupports(sheet, supports, insertIndex);
        var newSheet = sheet.cssRules[index];
        mountSheet(newSheet, rules, vnode);
    }
    function mountKeyframesRule(sheet, rule, vnode, insertIndex = sheet.cssRules.length) {
        var keyframes = rule.keyframes;
        var rules = rule.children;
        var index = insertKeyframes(sheet, keyframes, insertIndex);
        rule.rule = sheet.cssRules[insertIndex];
        var newSheet = sheet.cssRules[index];
        mountSheet(newSheet, rules, vnode);
    }
    function mountKeyframeRule(sheet, rule, vnode, insertIndex = sheet.cssRules.length) {
        var { keyframe, children: declaration } = rule;
        insertKeyframe(sheet, keyframe);
        sheet.appendRule(`${keyframe}{}`);
        var index = sheet.cssRules.length - 1;
        const insertedRule = sheet.cssRules[index];
        rule.rule = insertedRule; // set rule
        const insertedRuleStyle = insertedRule.style;
        for (let property in declaration) {
            var { value } = parseStyleValue(declaration[property]);
            // keyframe 中不能设置important
            setStyleProperty(insertedRuleStyle, property, value);
        }
    }

    function mount(vnode, container, anchor = null) {
        switch (vnode.nodeType) {
            case exports.Nodes.HTML_ELEMENT:
                mountElement(vnode, container, anchor);
                break;
            case exports.Nodes.TEXT:
                mountText(vnode, container, anchor);
                break;
            case exports.Nodes.COMPONENT:
                mountComponent(vnode, container, anchor);
                break;
            case exports.Nodes.STYLE:
                mountStyleSheet(vnode, container, anchor);
                break;
        }
    }
    function mountChildren(children, container, anchor) {
        children.forEach((child) => {
            mount(child, container, anchor);
        });
    }
    function mountElement(vnode, container, anchor) {
        const { type, props, children } = vnode;
        processHook("beforeCreate" /* BEFORE_CREATE */, vnode);
        // create 
        var el = docCreateElement(type);
        vnode.el = el;
        mountAttributes(el, props);
        processHook("created" /* CREATED */, vnode);
        processHook("beforeMount" /* BEFORE_MOUNT */, vnode);
        insertElement(el, container, anchor);
        processHook("mounted" /* MOUNTED */, vnode);
        if (children) {
            mountChildren(children, el, anchor);
        }
    }
    function mountText(vnode, container, anchor) {
        var el = docCreateText(vnode.children);
        vnode.el = el;
        insertElement(el, container, anchor);
    }

    const unmountComponent = (component, container, anchor) => {
        const { instance } = component;
        const { vnode } = instance;
        processHook("beforeUnmount" /* BEFORE_UNMOUNT */, component);
        patch(vnode, null, container, anchor);
        processHook("unmounted" /* UNMOUNTED */, component);
    };

    function unmount(vnode, container, anchor) {
        switch (vnode.nodeType) {
            case exports.Nodes.HTML_ELEMENT:
                unmountElement(vnode);
                break;
            case exports.Nodes.STYLE:
                unmountElement(vnode, true);
            case exports.Nodes.TEXT:
                removeElement(vnode.el);
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
    function unmountElement(vnode, isStyle = false) {
        if (vnode.children && !isStyle) {
            unmountChildren(vnode.children);
        }
        processHook("beforeUnmount" /* BEFORE_UNMOUNT */, vnode);
        removeElement(vnode.el);
        processHook("unmounted" /* UNMOUNTED */, vnode);
    }

    const updateComponent = (p, n, container, anchor) => {
        // key 不同应该卸载
        if (p.patchKey === n.patchKey) {
            var instance = n.instance = p.instance;
            // update props ...
            instance.update(p, n);
        }
        else {
            unmountComponent(p, container, anchor);
            mountComponent(n, container, anchor);
        }
    };

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
    function sortChildren(p, n, isRules) {
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
            if (sameNode && (isRules || (sameNode.node.type === node.type))) {
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
        var el = n.el = p.el;
        var sheet = el.sheet;
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
        var { p, n } = sortChildren(pRules, nRules, true);
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
                deleteRule(sheet, cursor);
                cursor--;
            }
            else if (pRule.nodeType !== nRule.nodeType) {
                // 当节点类型不同时，先卸载，再挂载 
                deleteRule(sheet, cursor);
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
                        // supports can't update 
                        deleteRule(sheet, cursor);
                        mountRule(sheet, nRule, vnode, cursor);
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
        var rule = nRule.rule = pRule.rule;
        debugger;
        var style = rule.style;
        if (!style)
            return;
        var { selector: pSelector, children: pDeclaration } = pRule;
        var { selector: nSelector, children: nDeclaration } = nRule;
        if (pSelector !== nSelector) {
            setSelector(rule, nSelector);
        }
        updateDeclaration(style, pDeclaration, nDeclaration);
    }
    // same as selector delimiter
    const mediumDelimiter = /\s*,\s*/;
    const normalizeMedium = (medium) => isArray(medium) ? medium : medium.trim().split(mediumDelimiter);
    function updateMedium(mediaRule, pMediaum, nMediaum) {
        pMediaum = normalizeMedium(pMediaum);
        nMediaum = normalizeMedium(nMediaum);
        pMediaum.forEach((m) => {
            if (!nMediaum.includes(m)) {
                deleteMedium(mediaRule, m);
            }
        });
        nMediaum.forEach((m) => {
            if (!pMediaum.includes(m)) {
                appendMedium(mediaRule, m);
            }
        });
    }
    function updateMediaRule(pRule, nRule, vnode) {
        var rule = nRule.rule = pRule.rule;
        var { media: pMedia, children: pRules } = pRule;
        var { media: nMedia, children: nRules } = nRule;
        updateMedium(rule, pMedia, nMedia);
        updateSheet(pRules, nRules, rule, vnode);
    }
    function updateKeyframesRule(pRule, nRule, vnode) {
        var keyframesrule = nRule.rule = pRule.rule;
        var { keyframes: pKeyframes, children: pRules } = pRule;
        var { keyframes: nKeyframes, children: nRules } = nRule;
        if (pKeyframes !== nKeyframes) {
            setKeyframesName(keyframesrule, nKeyframes);
        }
        var maxLength = Math.max(pRules.length, nRules.length);
        /*
            最简单的更新策略，只存在keyframe，并且可以设置keyText
        */
        for (let i = 0; i < maxLength; i++) {
            var pk = pRules[i];
            var nk = nRules[i];
            if (!pk) {
                mountKeyframeRule(keyframesrule, nk);
            }
            else if (!nk) {
                deleteKeyframe(keyframesrule, pk.keyframe);
            }
            else {
                var { keyframe: pKeyframe, children: pDeclaration } = pk;
                var { keyframe: nKeyframe, children: nDeclaration } = nk;
                let keyframerule = nk.rule = pk.rule;
                var style = keyframerule.style;
                if (pKeyframe !== nKeyframe) {
                    setKeyText(keyframerule, nKeyframe);
                }
                updateDeclaration(style, pDeclaration, nDeclaration);
            }
            // 不存在两个都没有的情况
        }
    }

    function update(p, n, container, anchor) {
        switch (n.nodeType) {
            case exports.Nodes.TEXT:
                updateText(p, n);
                break;
            case exports.Nodes.HTML_ELEMENT:
                updateHTMLElement(p, n, container);
                break;
            case exports.Nodes.STYLE:
                updateStyleSheet(p, n);
                break;
            case exports.Nodes.COMPONENT:
                updateComponent(p, n, container, anchor);
        }
    }
    function updateText(p, n) {
        var el = n.el = p.el;
        if (p.children !== n.children) {
            el.textContent = n.children;
        }
    }
    function updateHTMLElement(p, n, container, anchor) {
        var el = n.el = p.el;
        processHook("beforeUpdate" /* BEFORE_UPDATE */, n, p);
        updateAttributes(el, p.props, n.props);
        processHook("updated" /* UPDATED */, n, p);
        // updated hooks should be called here ? or after children update
        updateChildren(p.children, n.children, container);
    }
    function updateChildren(pChildren, nChildren, container, anchor) {
        var { p, n } = sortChildren(pChildren, nChildren, false);
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
                        if (current.type === next.type) {
                            // 类型相同，直接更新
                            update(current, next, container, anchor);
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
    function track$1(target, key) {
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
    function trigger$1(target, key) {
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
            track$1(target, key);
            return target[key];
        },
        set(target, key, newValue) {
            trigger$1(target, key);
            target[key] = newValue;
            return true;
        }
    };
    function reactive$1(target) {
        return new Proxy(target, handler);
    }
    function computed(getter) {
        var value;
        var dirty = true;
        var _effect = effect(getter, {
            scheduler: () => {
            },
            lazy: true
        });
        var res = {
            get value() {
                return dirty ? _effect.run() : value;
            }
        };
        return res;
    }
    function watch(visitor, callback) {
        effect(visitor, {
            scheduler: () => {
                callback();
            }
        });
    }

    exports.ReactiveTypes = void 0;
    (function (ReactiveTypes) {
        ReactiveTypes["OBJECT"] = "Object";
        ReactiveTypes["ARRAY"] = "Array";
        ReactiveTypes["MAP"] = "Map";
        ReactiveTypes["SET"] = "Set";
        ReactiveTypes["WEAK_MAP"] = "WeakMap";
        ReactiveTypes["WEAK_SET"] = "WeakSet";
    })(exports.ReactiveTypes || (exports.ReactiveTypes = {}));
    function toRaw(reactiveData) {
        return reactiveData["raw" /* RAW */];
    }
    function isReactive(value) {
        return value["isReactive" /* IS_REACTIVE */];
    }
    function isShallow(value) {
        return value["isShallow" /* IS_SHALLOW */];
    }
    function isRef(value) {
        return value["isRef" /* IS_REF */];
    }

    function track(...args) {
        console.warn('track');
    }
    function trigger(...args) {
        console.warn('trigger');
    }

    const createReactiveObject = (value) => new Proxy(value, reactiveHandler);
    const createReadonlyObject = (value) => new Proxy(value, readonlyHandler);
    const createShallowReactiveObject = (value) => new Proxy(value, shallowReactiveHandler);
    const createShallowReadonlyObject = (value) => new Proxy(value, shallowReadonlyHandler);
    const createReactiveCollection = (value) => new Proxy(value, reactiveCollectionHandler);
    const createReadonlyCollection = (value) => new Proxy(value, readonlyCollectionHandler);
    const createShallowReactiveCollection = (value) => new Proxy(value, shallowReactiveCollectionHandler);
    const createShallowReadonlyCollection = (value) => new Proxy(value, shallowReadonlyCollectionHandler);
    function createProxy(value, isReadonly, isShallow) {
        switch (typeOf(value)) {
            case exports.ReactiveTypes.OBJECT:
            case exports.ReactiveTypes.ARRAY:
                return isReadonly ?
                    (isShallow ? createShallowReadonlyObject(value) : createReadonlyObject(value)) :
                    (isShallow ? createShallowReactiveObject(value) : createReactiveObject(value));
            case exports.ReactiveTypes.MAP:
            case exports.ReactiveTypes.WEAK_MAP:
            case exports.ReactiveTypes.SET:
            case exports.ReactiveTypes.WEAK_SET:
                return isReadonly ?
                    (isShallow ? createShallowReadonlyCollection(value) : createReadonlyCollection(value)) :
                    (isShallow ? createShallowReactiveCollection(value) : createReactiveCollection(value));
            default:
                return value;
        }
    }
    function reactive(value) {
        return createProxy(value, false, false);
    }
    function readonly(value) {
        return createProxy(value, true, false);
    }

    // global state
    let _isReadonly = false;
    let _isShallow = false;
    let _target;
    let _key;
    const getLastVisitTarget = () => _target;
    const getLastVisitKey = () => _key;
    const collectionHandlers = {
        add(value) {
            var target = toRaw(this);
            if (_isReadonly) {
                return console.warn(target, 'is readonly , cant add');
            }
            var result = target.add(value);
            console.warn('trigger add');
            // 返回set对象本身
            return result;
        },
        // map set
        clear() {
            var target = toRaw(this);
            if (_isReadonly) {
                return console.warn(target, 'is readonly cant clear');
            }
            target.clear();
            console.warn('trigger clear');
            return;
        },
        // map weakmap set weakset
        delete(key) {
            var target = toRaw(this);
            if (_isReadonly) {
                return console.warn(target, 'is readonly cant delete');
            }
            const result = target.delete(key);
            if (result) { // 返回为 true 为删除成功
                console.warn('trigger');
            }
            return result;
        },
        // map set
        entries() {
            var target = toRaw(this);
            console.warn('track');
            return target.entries();
        },
        // map set
        forEach(fn) {
            var target = toRaw(this);
            console.warn('track');
            return target.forEach(fn);
        },
        // set map weakset weakmap
        has(key) {
            var target = toRaw(this);
            console.warn('track');
            return target.has(key);
        },
        // map set
        keys() {
            var target = toRaw(this);
            console.warn('track');
            return target.keys();
        },
        // map set
        values() {
            var target = toRaw(this);
            console.warn('track');
            return target.values();
        },
        // map weakmap
        set(key, value) {
            var target = toRaw(this);
            if (_isReadonly) {
                return console.warn(target, 'is readonly , cant set');
            }
            var result = target.set(key, value);
            console.warn('trigger');
            return result;
        },
        // map weakmap
        get(key) {
            var target = toRaw(this);
            if (!_isReadonly) {
                console.warn('track');
            }
            var value = target.get(key);
            return _isShallow ? value : reactive(value);
        }
    };
    function arrayHandlerWithTrack(...args) {
        if (!_isReadonly) { // 非只读才会收集
            console.warn('ARRAY track');
        }
        let result = _target[_key](...args);
        return result;
    }
    function arrayHandlerWithTrigger(...args) {
        if (_isReadonly) {
            return console.error('readonly');
        }
        let result = _target[_key](...args);
        console.warn('trigger');
        return result;
    }
    const arrayHandlers = {
        // should track
        includes: arrayHandlerWithTrack,
        indexOf: arrayHandlerWithTrack,
        lastIndexOf: arrayHandlerWithTrack,
        // should trigger
        push: arrayHandlerWithTrigger,
        pop: arrayHandlerWithTrigger,
        shift: arrayHandlerWithTrigger,
        unshift: arrayHandlerWithTrigger,
        splice: arrayHandlerWithTrigger
    };
    const SYMBOL_ITERATOR = Symbol.iterator;
    const specialKeyHandler = {
        [SYMBOL_ITERATOR]: (value) => {
            // should track ?
            return value.bind(_target);
        }
    };
    function createGetter(isReadonly, isShallow, isCollection) {
        return (target, key, receiver) => {
            // cache global state
            _isReadonly = isReadonly;
            _isShallow = isShallow;
            _target = target;
            _key = key;
            // reserved keys
            if (key === "raw" /* RAW */) {
                return target;
            }
            else if (key === "isReactive" /* IS_REACTIVE */) {
                return !isReadonly;
            }
            else if (key === "isShallow" /* IS_SHALLOW */) {
                return isShallow;
            }
            else if (key === "isReadonly" /* IS_READONLY */) {
                return isReadonly;
            }
            if (isCollection) {
                if (key === 'size') {
                    track(target);
                    return target.size;
                }
                if (hasOwn(collectionHandlers, key) && key in target) {
                    // collection methods reset
                    return collectionHandlers[key];
                }
            }
            else if (hasOwn(target, key)) {
                // !  可收集属性， 是自身属性时才会收集 , readonly 不会收集
                if (!isReadonly) {
                    track(target, key);
                }
                var value = Reflect.get(target, key, receiver);
                if (isShallow) {
                    //! readonly 和 shallowreadonly 都不会收集 , 直接返回原始值
                    return value;
                }
                return isReadonly ? readonly(value) : reactive(value);
            }
            else if (isArray(target) && hasOwn(arrayHandlers, key)) {
                // 数组重写方法
                return arrayHandlers[key];
            }
            var value = Reflect.get(target, key, receiver);
            // 特殊key处理器
            if (hasOwn(specialKeyHandler, key)) {
                value = specialKeyHandler[key](value);
            }
            return value;
        };
    }
    function createSetter(isReadonly = false, isShallow = false) {
        return (target, key, newValue, receiver) => {
            // 返回 false 时会报错
            if (isReadonly) {
                return true;
            }
            if (hasOwn(target, key)) {
                // 不允许设置非自身属性
                Reflect.set(target, key, newValue, receiver);
                console.warn('trigger set', target, key);
            }
            return true;
        };
    }
    function has(target, key) {
        /*
            has 包括非自身的key
        */
        if (hasOwn(target, key)) {
            console.warn('track has', target, key);
        }
        return Reflect.has(target, key);
    }
    function ownKeys(target) {
        console.warn('track ownKeys', target);
        return Reflect.ownKeys(target);
    }
    function deleteProperty(target, key) {
        // 为 true 表示删除成功
        const result = Reflect.deleteProperty(target, key);
        if (result && hasOwn(target, key)) {
            target[key];
            console.warn('trigger deleteProperty');
        }
        return result;
    }
    function readonlyDeleteProperty(target, key) {
        console.warn('readonly cant delete');
    }
    // object handlers
    const reactiveHandler = {
        get: createGetter(false, false, false),
        set: createSetter(false, false),
        ownKeys,
        deleteProperty,
        has
    };
    const shallowReactiveHandler = {
        get: createGetter(false, true, false),
        set: createSetter(false, true),
        ownKeys,
        deleteProperty,
        has
    };
    const readonlyHandler = {
        get: createGetter(true, false, false),
        set: createSetter(true, false),
        deleteProperty: readonlyDeleteProperty
    };
    const shallowReadonlyHandler = {
        get: createGetter(true, true, false),
        set: createSetter(true, true),
        deleteProperty: readonlyDeleteProperty
    };
    // collection handlers
    const reactiveCollectionHandler = {
        get: createGetter(false, false, true)
    };
    const readonlyCollectionHandler = {
        get: createGetter(true, false, true)
    };
    const shallowReactiveCollectionHandler = {
        get: createGetter(false, true, true)
    };
    const shallowReadonlyCollectionHandler = {
        get: createGetter(true, true, true)
    };
    /*
        todo
        shallowReactiveDeepReadonly
        shallowReadonlyDeepReactive
    */

    function ref(value) {
        return new Ref(value);
    }
    class Ref {
        ["isRef" /* IS_REF */] = true;
        _value;
        constructor(value) {
            this._value = value;
        }
        get value() {
            // track
            console.warn('ref track');
            return this._value;
        }
        set value(newValue) {
            if (this._value === newValue) {
                return;
            }
            this._value = newValue;
            // trigger
            console.warn('ref trigger');
        }
    }

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

    // rendering instance and creating instance
    exports.currentInstance = null;
    function setCurrentInstance(instance) {
        exports.currentInstance = instance;
    }
    function getCurrentInstance() {
        return exports.currentInstance;
    }
    function getCurrentScope() {
        return getCurrentInstance().scope;
    }
    function mountComponent(component, container, anchor = null) {
        var { type, props, children } = component;
        const instance = createComponentInstance(type);
        component.instance = instance;
        processHook("beforeCreate" /* BEFORE_CREATE */, component);
        // setup instance
        const { scope, createRender } = instance;
        instance.props = props || emptyObject;
        instance.slots = children || emptyObject;
        // process props
        // create 钩子只能 通过组件选项定义，无法通过指令或者节点钩子添加
        setCurrentInstance(instance);
        callHook("create" /* CREATE */, instance, scope, scope);
        setCurrentInstance(null);
        // render function  
        setCurrentInstance(instance);
        const render = createRender(renderMethods);
        setCurrentInstance(null);
        processHook("created" /* CREATED */, component);
        instance.render = render;
        // component update fn
        function update(p, n) {
            const { isMounted, vnode } = instance;
            // 每次更新生成新树
            if (n) {
                component = n;
            }
            setCurrentInstance(instance);
            var nextTree = render();
            setCurrentInstance(null);
            // 处理树
            nextTree = processdom(nextTree);
            // console.log('prevTree', vnode);
            console.log('nextTree', nextTree);
            /*
                这里发生的更新是自身状态变化发生的更新，不存在生成新节点
            */
            processHook(isMounted ? "beforeUpdate" /* BEFORE_UPDATE */ : "beforeMount" /* BEFORE_MOUNT */, component, p);
            patch(vnode, nextTree, container);
            processHook(isMounted ? "updated" /* UPDATED */ : "mounted" /* MOUNTED */, component, p);
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

    function display(displayData) {
        return displayData;
    }

    function getComponent(name) {
        var component = getCurrentInstance().components?.[name] || getCurrentApp().components[name];
        if (!component) {
            error(`cant find compnent ${name}`);
        }
        return component;
    }
    function getDirective(name) {
        var directive = getCurrentInstance().directives?.[name] || getCurrentApp().directives[name];
        if (!directive) {
            error(`can't find directive ${name}`);
        }
        return directive;
    }

    function setScopeExp(exp) {
        return exp;
    }

    const NULL = 'null';
    const toBackQuotes = (_) => '`' + _ + '`';
    const toSingleQuotes = (_) => "'" + _ + "'";
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
    const toArrowFunction = (returned, ...params) => {
        return `(${params.join(',')})=>(${returned})`;
    };
    /* to ternary expression */
    const toTernaryExp = (condition, ifTrue, ifFalse) => `${condition}?${ifTrue}:${ifFalse}`;
    const toArray = (items) => `[${items.join(',')}]`;
    const dynamicMapKey = (key) => `[${key}]`;
    const callFn = (fnName, ...params) => `${fnName}(${params.join(',')})`;
    const ternaryExp = (condition, ifTrue, ifFalse) => `${condition}?(${ifTrue}):(${ifFalse})`;
    function ternaryChains(conditions, returns, falseDefault = 'undefined', index = 0) {
        return ternaryExp(conditions[index], returns[index], index < conditions.length - 1 ? ternaryChains(conditions, returns, falseDefault, ++index) : (returns[index + 1] || falseDefault));
    }
    const destructur = (target) => `...${target}`;
    var declare = (name, value) => `const ${name} = ${value} ;`;
    const toReservedProp = (prop) => `_${prop}`;

    const extAttributeRE = /(\$-{2}|@|\$|-{2}|\.|#)?(\()?([\w-\?]+)(\))?(?::([\w:]+))?(?:\.([\w\.]+))?(@|\$|!|\.|#)?/;
    // both for html attribute and css declaration
    function parseAttribute(attribute, value) {
        var res = execCaptureGroups(attribute, extAttributeRE);
        if (!res) {
            error(`${attribute} is not legal attribute`);
            return;
        }
        var [flag, left, property, right, argumentStr, modifierStr, endFlag] = res;
        var isBooleanProperty = isUndefined(value);
        var isDynamicProperty = !!(left && right);
        var isDynamicValue = flag === '$';
        var _arguments = argumentStr && argumentStr.split(':');
        var modifiers = modifierStr && modifierStr.split('.');
        if (!isDynamicProperty) {
            property = camelize(property);
        }
        return {
            isBooleanProperty,
            property,
            isDynamicProperty,
            isDynamicValue,
            value,
            flag,
            endFlag,
            left,
            right,
            _arguments,
            modifiers
        };
    }

    const createScanner = (source) => new Scanner(source);
    // operate the string template
    class Scanner {
        source;
        constructor(source) {
            this.source = source.trim();
        }
        move(step) {
            this.source = this.source.slice(step).trimLeft();
        }
        at(index) {
            return this.source[index];
        }
        expect(expect, index = 0) {
            return this.source.slice(index, expect.length + index) === expect;
        }
        startsWith(expect) {
            // same as use expect without the second arg
            return this.source.startsWith(expect);
        }
        exec(extractor) {
            var res = exec(this.source, extractor);
            if (!res) {
                return null;
            }
            else {
                var [_, ...groups] = res;
                this.move(_.length);
                return groups;
            }
        }
    }

    const openTagRE = /^<([\w-]+)(?:\.([\w\.]+))?/;
    var closeTagRE = /^<\/([\w-]+)(?:\.[\w\.]+)?\s*>/;
    const htmlCommentRE = /<!--((.|[\r\n])*?)-->/;
    const attributeRE = /([^=\s>]+)\s*(?:=\s*(["'])([^\2]*?)\2)?/;
    function baseParseHTML(template) {
        var scanner = createScanner(template);
        var ast = [], attributes, attributeMap, //! duplicate names will be overwritten
        inOpen, tag, modifiers;
        while (scanner.source) {
            if (scanner.startsWith('<')) {
                if (scanner.at(1) === '/') {
                    // tag close
                    var exRes = scanner.exec(closeTagRE);
                    var closeTag = exRes[0];
                    for (let i = ast.length - 1; i >= 0; i--) {
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
                else if (scanner.at(1) === '!') {
                    var exRes = scanner.exec(htmlCommentRE);
                    ast.push({
                        tag: '!',
                        children: exRes[0]
                    });
                }
                else {
                    var exRes = scanner.exec(openTagRE);
                    tag = exRes[0];
                    modifiers = exRes[1];
                    inOpen = true;
                }
            }
            else if (inOpen) {
                if (scanner.startsWith('/')) {
                    scanner.move(1); // ignore
                }
                else if (scanner.startsWith('>')) {
                    // open tag close
                    ast.push({
                        tag,
                        closed: false,
                        attributes,
                        attributeMap,
                        children: null,
                        modifiers: modifiers && modifiers.split(':')
                    });
                    tag = null;
                    modifiers = null;
                    attributes = null;
                    attributeMap = null;
                    inOpen = false;
                    scanner.move(1);
                }
                else {
                    /* catch attribute */
                    var exRes = scanner.exec(attributeRE);
                    var attribute = exRes[0];
                    var value = exRes[2];
                    const _attribute = parseAttribute(attribute, value);
                    (attributeMap ||= getEmptyObject())[_attribute.property] = _attribute;
                    (attributes ||= []).push(_attribute);
                }
            }
            else {
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
                ast.push({
                    tag: '',
                    children: text.trim()
                });
            }
        }
        return ast;
    }

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

    const extIteratorExp = /(?:[\{\[\(]?)([\w,]+)(?:[\}\]\)]?)\s*(?:in|of)\s*(.+)/;
    function parseIterator(expression) {
        const [_, items, iterable] = extIteratorExp.exec(expression);
        return {
            iterable,
            items: items.split(',')
        };
    }

    const selectorRE = /^([^{};]*)(?<!\s)\s*{/;
    const declarationRE = /([$\w!-\]\[]+)\s*:\s*([^;]+);/;
    const AtRuleRE = /^@([\w]+)\s*([^{]+)(?<!\s)\s*{/;
    const mixinRE = /\.\.\.([^;]+);/;
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
            else if (scanner.startsWith(keyOf(exports.Nodes.AT))) {
                /*
                    media conditions
                */
                var [key, content] = scanner.exec(AtRuleRE);
                var type = exports.NodesMap[key];
                current = {
                    type
                };
                if (type === exports.Nodes.MEDIA_RULE) {
                    current.media = content;
                }
                else if (type === exports.Nodes.KEYFRAMES_RULE) {
                    current.keyframes = content;
                }
                else if (type === exports.Nodes.SUPPORTS_RULE) {
                    current.supports = content;
                }
            }
            else if (scanner.expect('/*')) ;
            else if (scanner.startsWith(keyOf(exports.Nodes.MIXIN))) {
                var [mixin] = scanner.exec(mixinRE);
                var m = {
                    type: exports.Nodes.MIXIN,
                    mixin
                };
                (declarationGroup ||= []).push(m);
                continue;
            }
            else if (cssReservedWord.test(scanner.source)) {
                /*
                    处理指令，指令不再需要通过标识符去判断
                */
                var [dir, content] = scanner.exec(CSSDir);
                var type = keyOf(dir);
                var d = { type };
                switch (type) {
                    case exports.Nodes.FOR:
                        d.iterator = parseIterator(content);
                        break;
                    case exports.Nodes.IF:
                        d.condition = content;
                        d.isBranchStart = true;
                        break;
                    case exports.Nodes.ELSE_IF:
                        d.condition = content;
                        d.isBranch = true;
                        break;
                    case exports.Nodes.ELSE:
                        d.isBranch = true;
                        break;
                }
                current = d;
            }
            else if (exResult = scanner.exec(selectorRE)) {
                /*
                    try to get the selector
                */
                current = {
                    type: exports.Nodes.STYLE_RULE,
                    selector: parseSelector(exResult[0])
                };
            }
            else if (exResult = scanner.exec(declarationRE)) {
                /*
                    the last declaration must end with  " ; "
                */
                var declaration = parseAttribute(exResult[0], exResult[1]);
                var { property, flag, endFlag } = declaration;
                if (flag === '$') {
                    declaration.isDynamicValue = true;
                }
                else if (flag === '$--') {
                    declaration.isDynamicValue = true;
                    declaration.property = '--' + property;
                    declaration.illegalKey = true;
                }
                else if (flag === '--') {
                    declaration.property = '--' + property;
                    declaration.illegalKey = true;
                }
                //! important
                declaration.isImportant = endFlag === '!';
                (declarationGroup ||= []).push({
                    declaration,
                    type: exports.Nodes.DECLARATION
                });
                continue;
            }
            else {
                /* error */
                debugger;
            }
            /* process the relation , with cascading struct */
            if (declarationGroup) {
                var asb = { type: exports.Nodes.DECLARATION_GROUP };
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

    const inlineStyleDelimiter = /\s*[:;]\s*/;
    function parseInlineStyle(styleString) {
        var chips = styleString.split(inlineStyleDelimiter).filter(Boolean);
        var l = chips.length;
        var styleMap = {};
        while (l) {
            styleMap[camelize(chips[l - 2])] = toSingleQuotes(chips[l - 1]);
            l -= 2;
        }
        return styleMap;
    }
    const inlineClassDelimiter = /\s+/;
    const parseInlineClass = (classString) => stringToMap(classString, inlineClassDelimiter);

    // parse for codegen 
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
    var reservedDirMap = {
        if: exports.Nodes.IF,
        elseIf: exports.Nodes.ELSE_IF,
        else: exports.Nodes.ELSE,
        for: exports.Nodes.FOR,
        slot: exports.Nodes.SLOT,
        outlet: exports.Nodes.OUTLET,
        model: exports.Nodes.MODEL
    };
    const reservedAttributeMap = {
        style: exports.Nodes.STYLE,
        class: exports.Nodes.CLASS,
        created: true,
        beforeMount: true,
        mounted: true,
        beforeUpdate: true,
        updated: true,
        beforeUnmount: true,
        unmounted: true
    };
    function processAttribute(ast) {
        var attributes = ast.attributes;
        if (!attributes)
            return;
        for (let i = 0; i < attributes.length; i++) {
            var attribute = attributes[i];
            var { flag } = attribute;
            if (flag === '@') {
                // event
                attribute.type = exports.Nodes.EVENT;
                attribute.isHandler = isHandler(attribute.value);
            }
            else if (flag === '--') {
                // direvtive
                const type = reservedDirMap[attribute.property];
                const isCustomDirective = attribute.isDynamicProperty || !type;
                if (isCustomDirective) {
                    (ast.customDirectives ||= []).push(attribute);
                }
                else {
                    // reserved directive
                    var directives = ast.directives ||= [];
                    switch (attribute.type = type) {
                        case exports.Nodes.IF:
                            if (!directives.length) {
                                //  此时为元素的第一个指令为if ， 最外层的分支指令会注入到元素节点 ， 在代码生成时用作判断处理
                                ast.condition = attribute.value;
                                ast.isBranchStart = true;
                            }
                            else {
                                directives.push(attribute);
                            }
                            break;
                        case exports.Nodes.ELSE_IF:
                            if (!directives.length) {
                                ast.isBranch = true;
                            }
                            else {
                                debugger;
                                //! else-if 指令只会在第一个指令出现 error
                            }
                            break;
                        case exports.Nodes.ELSE:
                            if (!directives.length) {
                                ast.isBranch = true;
                            }
                            else {
                                debugger;
                                // else-if 指令只会在第一个指令出现
                            }
                            break;
                        case exports.Nodes.FOR:
                            attribute.iterator = parseIterator(attribute.value);
                            directives.push(attribute);
                            break;
                        case exports.Nodes.SLOT:
                            directives.push(attribute);
                            break;
                        case exports.Nodes.OUTLET:
                            // define slot
                            ast.outlet = {
                                name: attribute._arguments[0],
                                scope: attribute.value
                            };
                            break;
                        case exports.Nodes.MODEL:
                            ast.tagName;
                            ast.attributes.unshift({
                                type: exports.Nodes.RESERVED_PROP,
                                property: 'assigner',
                                isDynamicValue: true,
                                value: toArrowFunction(`${attribute.value}=_`, '_')
                            });
                            i++;
                            (ast.customDirectives ||= []).push(attribute);
                            break;
                    }
                }
            }
            else {
                // 其他属性
                var type = reservedAttributeMap[attribute.property];
                if (attribute.flag === '#') {
                    // id shorthand
                    attribute.type = exports.Nodes.ATTRIBUTE;
                    attribute.value = attribute.property;
                    attribute.property = 'id';
                    attribute.isDynamicValue = attribute.isDynamicProperty;
                    attribute.isDynamicProperty = false;
                }
                else if (attribute.flag === '.') {
                    // class shourthand
                    attribute.type = exports.Nodes.CLASS;
                    attribute.value = attribute.property;
                    attribute.property = 'class';
                    attribute.isDynamicValue = attribute.isDynamicProperty;
                    attribute.isDynamicProperty = false;
                }
                else if (!type || attribute.isDynamicProperty) {
                    attribute.type = exports.Nodes.ATTRIBUTE;
                }
                else {
                    switch (type) {
                        case exports.Nodes.STYLE:
                            attribute.type = exports.Nodes.STYLE;
                            attribute.value = attribute.isDynamicValue ? attribute.value : parseInlineStyle(attribute.value);
                            break;
                        case exports.Nodes.CLASS:
                            attribute.type = exports.Nodes.CLASS;
                            attribute.value = attribute.isDynamicValue ? attribute.value : parseInlineClass(attribute.value);
                            break;
                        default:
                            // 自定义保留属性，不对外开放
                            attribute.type = exports.Nodes.RESERVED_PROP;
                    }
                }
            }
        }
    }
    var reservedTagMap = {
        if: exports.Nodes.IF,
        elseIf: exports.Nodes.ELSE_IF,
        else: exports.Nodes.ELSE,
        for: exports.Nodes.FOR,
        slot: exports.Nodes.SLOT,
        outlet: exports.Nodes.OUTLET,
        '': exports.Nodes.TEXT,
        '!': exports.Nodes.HTML_COMMENT,
        'template': exports.Nodes.TEMPLATE,
        'component': exports.Nodes.DYNAMIC_COMPONENT,
        'element': exports.Nodes.DYNAMIC_ELEMENT,
        'style': exports.Nodes.STYLE
    };
    /*
        tips
        why should devide the componet and element tag
        bcause the children is different
    */
    function processAst(ast) {
        if (isArray(ast)) {
            ast.forEach(processAst);
            return;
        }
        const tag = ast.tag;
        const tagName = camelize(tag);
        ast.tagName = tagName;
        processAttribute(ast);
        let ignoreChildren = false;
        const type = reservedTagMap[tagName];
        if (type) {
            // reserved tag
            switch (ast.type = type) {
                case exports.Nodes.HTML_COMMENT:
                    break;
                case exports.Nodes.TEXT:
                    ast.children = parseText(ast.children);
                    ignoreChildren = true;
                    break;
                case exports.Nodes.STYLE:
                    var template = ast.children?.[0].children;
                    if (template) {
                        var styleAst = parseCSS(template);
                        processRules(styleAst);
                        ast.children = styleAst;
                    }
                    ignoreChildren = true;
                    break;
                case exports.Nodes.IF:
                    ast.condition = ast.attributeMap['condition'];
                    ast.isBranchStart = true;
                    break;
                case exports.Nodes.ELSE_IF:
                    ast.condition = ast.attributeMap['condition'];
                    ast.isBranch = true;
                    break;
                case exports.Nodes.ELSE:
                    ast.isBranch = true;
                    break;
                case exports.Nodes.FOR:
                    ast.iterator = parseIterator(ast.attributeMap['iterator']);
                    break;
                case exports.Nodes.OUTLET:
                    ast.outlet = {
                        name: ast.attributeMap?.['name'],
                        scope: ast.attributeMap?.['scope']
                    };
                    break;
                case exports.Nodes.DYNAMIC_ELEMENT:
                    break;
            }
        }
        else if (isHTMLTag(tagName)) {
            ast.type = exports.Nodes.HTML_ELEMENT;
        }
        else if (isSVGTag(tagName)) {
            ast.type = exports.Nodes.SVG_ELEMENT;
        }
        else {
            ast.type = exports.Nodes.COMPONENT;
        }
        if (!ignoreChildren && ast.children) {
            processAst(ast.children);
        }
    }

    var rfs = {
        createComment: '',
        createElement: '',
        createFragment: '',
        createKeyframe: '',
        createKeyframes: '',
        createMedia: '',
        createSVGElement: '',
        createStyleSheet: '',
        createStyle: '',
        createText: '',
        renderList: '',
        mergeSelectors: '',
        display: '',
        createDeclaration: '',
        mixin: '',
        important: '',
        createSupports: '',
        flatRules: '',
        createComponent: '',
        getComponent: '',
        getDirective: '',
        getCurrentScope: '',
        createEvent: '',
        createHandlerKey: '',
        normalizeClass: '',
        normalizeStyle: '',
        renderSlot: '',
        injectDirective: '',
        injectDirectives: '',
        injectReservedProps: ''
    };
    const renderMethodsNameMap = Object.entries(rfs).reduce((res, [name, method]) => {
        res[name] = name;
        //res[name] = method.name
        return res;
    }, {});

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
    const genFor = (target, iterator, context) => context.callRenderFn(renderMethodsNameMap.renderList, iterator.iterable, toArrowFunction(target, ...iterator.items), uStringId() /* 显示的在迭代器中传入掺入一个key，每次渲染时这个key不变，并且子节点会根据索引生成唯一key,只需要子层级即可 */);
    const genIf = (target, condition) => ternaryExp(condition, target, NULL);
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
                    // where there is a slot directive on a element or component , the target will be the fallback content
                    var slotName = toBackQuotes(dir.value || 'default');
                    // 指令插槽的渲染无法携带作用域信息
                    target = context.callRenderFn(renderMethodsNameMap.renderSlot, slotName, NULL, toArrowFunction(target), uid());
                    break;
                case exports.Nodes.OUTLET:
                    // 不在此处处理outlet
                    break;
            }
            return genDirectives(target, dirs, context);
        }
    };
    function genCustomDirectives(code, customDirectives, context) {
        // injectDirective
        var dirs = customDirectives.map((rawDir) => {
            var { property, value, isDynamicProperty, _arguments, modifiers } = rawDir;
            // 支持动态指令
            var directive = context.callRenderFn(renderMethodsNameMap.getDirective, isDynamicProperty ? property : toSingleQuotes(property));
            if (!isDynamicProperty) {
                directive = context.hoistExpression(directive);
            }
            var dirInfos = [
                directive,
                value,
                _arguments && _arguments.map(toSingleQuotes),
                modifiers && modifiers.map(toSingleQuotes)
            ];
            return dirInfos;
        });
        return context.callRenderFn(renderMethodsNameMap.injectDirectives, code, stringify(dirs));
    }
    function genChildrenString(children, context) {
        if (!children)
            return NULL;
        return stringify(genChildren(children, context));
    }
    function genDirs(code, node, context) {
        if (node.customDirectives) {
            code = genCustomDirectives(code, node.customDirectives, context);
        }
        if (node.directives) {
            code = genDirectives(code, node.directives, context);
        }
        return code;
    }
    function genSlotContent(node, context) {
        var { children } = node;
        /*
            关于插槽的定义 ,
            插槽指令只能 存在子节点的最外一层，并在处理指令时 提升到最外层节点上
            如 <template --slot:header=""> ,
            暂时插槽数量还是固定的，无法通过循环定义多个具名插槽
        */
        if (!children)
            return NULL;
        var _default;
        var slots = {};
        children.forEach((child) => {
            var { name, scope } = child.outlet || emptyObject;
            if (name) {
                slots[name] = toArrowFunction(genNode(child, context), scope);
            }
            else {
                (_default ||= []).push(child);
            }
        });
        if (_default) {
            slots.default = toArrowFunction(genNodes(_default, context));
        }
        return stringify(slots);
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
                var fallback = toArrowFunction(genNodes(node.children, context));
                // todo 插槽作用域
                return context.callRenderFn(renderMethodsNameMap.renderSlot, slotName, NULL, fallback, uid());
            case exports.Nodes.OUTLET:
                return genNodes(node.children, context);
            case exports.Nodes.DYNAMIC_ELEMENT:
                var { value, isDynamicValue } = node.attributeMap['is'];
                var code = context.callRenderFn(renderMethodsNameMap.createElement, isDynamicValue ? value : toSingleQuotes(value), genProps(node, context), genChildrenString(node.children, context), uStringId());
                code = genDirs(code, node, context);
                return code;
            case exports.Nodes.HTML_ELEMENT:
                var code = context.callRenderFn(renderMethodsNameMap.createElement, toBackQuotes(node.tagName), genProps(node, context), genChildrenString(node.children, context), uStringId());
                code = genDirs(code, node, context);
                return code;
            case exports.Nodes.SVG_ELEMENT:
                debugger;
                return context.callRenderFn(renderMethodsNameMap.createSVGElement);
            case exports.Nodes.DYNAMIC_COMPONENT:
                var { value, isDynamicValue } = node.attrMap['is'];
                var component = context.callRenderFn(renderMethodsNameMap.getComponent, isDynamicValue ? value : toSingleQuotes(value));
                // 动态组件不会提升
                var props = genProps(node, context);
                var slots = genSlotContent(node, context);
                code = context.callRenderFn(renderMethodsNameMap.createComponent, component, props, slots, uStringId());
                code = genDirs(code, node, context);
                return code;
            case exports.Nodes.COMPONENT:
                var code = context.callRenderFn(renderMethodsNameMap.getComponent, toBackQuotes(node.tagName));
                var uv = context.hoistExpression(code);
                var props = genProps(node, context);
                var slots = genSlotContent(node, context);
                code = context.callRenderFn(renderMethodsNameMap.createComponent, uv, props, slots, uStringId());
                code = genDirs(code, node, context);
                return code;
            case exports.Nodes.TEXT:
                return genText(node.children, context);
            case exports.Nodes.STYLE:
                var props = genProps(node, context);
                var code = context.callRenderFn(renderMethodsNameMap.createStyleSheet, props, stringify(genChildren(node.children, context)), uStringId());
                code = genDirs(code, node, context);
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
                var { property, value, isDynamicProperty, isDynamicValue, isImportant, illegalKey } = declaration.declaration;
                if (isDynamicProperty) {
                    // 动态的key不存在不合法情况
                    property = dynamicMapKey(property);
                }
                else {
                    if (illegalKey) {
                        property = dynamicMapKey(toSingleQuotes(property));
                    }
                }
                if (!isDynamicValue) {
                    value = toBackQuotes(value);
                }
                if (isImportant) {
                    value = context.callRenderFn(renderMethodsNameMap.important, value);
                }
                target[property] = value;
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
        if (!attributes) {
            return NULL;
        }
        var props = {};
        attributes.forEach((attr) => {
            switch (attr.type) {
                case exports.Nodes.EVENT:
                    var { property, isDynamicProperty, value, isHandler, /* if true , just use it , or wrap an arrow function */ _arguments, modifiers } = attr;
                    var handlerKey = isDynamicProperty ?
                        dynamicMapKey(context.callRenderFn(renderMethodsNameMap.createHandlerKey, property, stringify(_arguments.map(toBackQuotes)))) : createHandlerKey(property, _arguments);
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
                case exports.Nodes.ATTRIBUTE:
                    // normal attributes
                    var { property, value, isDynamicProperty, isDynamicValue, } = attr;
                    props[isDynamicProperty ? dynamicMapKey(property) : property] = isDynamicValue ? value : toBackQuotes(value);
                    break;
                case exports.Nodes.RESERVED_PROP:
                    // 当确定是保留属性时，一定是非动态属性名
                    var { property, value, isDynamicValue, } = attr;
                    props[toReservedProp(property)] = isDynamicValue ? value : toBackQuotes(value);
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
        return stringify(props) === '{}' ? NULL : stringify(props);
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
    function compile(template) {
        var ast = baseParseHTML(template);
        processAst(ast);
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
        var rf = createFunction(context.getCode(), RENDER_METHODS);
        console.log(rf);
        return rf;
    }

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

    function renderSlot(name, scope, fallback, uid) {
        var instance = getCurrentInstance();
        var slot = (instance.slots[name] || fallback)();
        if (!slot) {
            return null;
        }
        slot.key = uid; // 唯一插槽节点的key
        return slot;
    }

    var renderMethods = {
        important,
        getCurrentScope,
        createElement,
        createText,
        renderList,
        createFragment,
        display,
        getDirective,
        getComponent,
        injectDirectives,
        createStyleSheet,
        createStyle,
        createDeclaration,
        createKeyframe,
        createKeyframes,
        createMedia,
        createSupports,
        mixin,
        normalizeClass,
        normalizeStyle,
        createComponent,
        renderSlot
    };

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
    function cubicBezier(x1, y1, x2, y2) {
        return `cubic-bezier(${x1},${y1},${x2},${y2})`;
    }
    const max = (...items) => `max(${items.join(',')})`;
    const min = (...items) => `min(${items.join(',')})`;
    function rotateY(deg) {
        return `rotateY(${addUnit(deg, 'deg')})`;
    }
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
    function skewY(y) {
        return `skewX(${addUnit(y, 'deg')})`;
    }
    function skew(x, y) {
        return `skew(${addUnit(x, 'deg')},${addUnit(y, 'deg')})`;
    }
    function scaleY(n) {
        return `scaleY(${n})`;
    }

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

    const bounce = keyframes('bounce', [
        keyframe([0, 20, 53, 100], {
            animationTimingFunction: cubicBezier(0.215, 0.61, 0.355, 1),
            transform: translate3d(0, 0, 0)
        }),
        keyframe([40, 43], {
            animationTimingFunction: cubicBezier(0.755, 0.05, 0.855, 0.06),
            transform: [translate3d(0, '-30px', 0), scaleY(1.1)]
        }),
        keyframe(70, {
            animationTimingFunction: cubicBezier(0.755, 0.05, 0.855, 0.06),
            transform: [translate3d(0, '-15px', 0), scaleY(1.05)]
        }),
        keyframe(80, {
            animationTimingFunction: cubicBezier(0.215, 0.61, 0.355, 1),
            transform: [translate3d(0, 0, 0), scaleY(0.95)]
        }),
        keyframe(90, {
            transform: [translate3d(0, '-4px', 0), scaleY(1.02)]
        })
    ]);

    var animations = {
        bounce,
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
    };
    const checkBuiltInAnimations = () => Object.keys(animations);
    const installAnimation = () => mount(createStyleSheet(null, Object.values(animations)), document.head);

    /*
        过渡动画逻辑
        使用transition , 先保留之前元素的tansition  , 设置新的 transtion ，然后设置新的样式
    */
    function setElementTranstion(el) {
    }

    var currentApp;
    function getCurrentApp() {
        if (!currentApp) {
            debugger;
        }
        return currentApp;
    }
    function normalizeContainer(container) {
        if (isString(container)) {
            container = document.querySelector(container);
        }
        if (!(container instanceof Element)) {
            error('not legal container');
        }
        return container;
    }
    class App {
        isMounted = false;
        rootComponent;
        constructor(rootComponent) {
            this.rootComponent = rootComponent;
            this.use(installAnimation);
            currentApp = this;
        }
        components = builtInComponents;
        component(name, component) {
            if (this.directives[name]) {
                return warn('component is already exist');
            }
            this.components[name] = component;
        }
        directives = builtInDirectives;
        directive(name, directive) {
            if (this.directives[name]) {
                return warn('directive is already exist');
            }
            this.directives[name] = directive;
        }
        mixins = [];
        mixin(mixin) {
            this.mixins.push(mixin);
        }
        plugins = new Set();
        use(plugin, ...options) {
            if (!this.plugins.has(plugin)) {
                plugin(this, ...options);
            }
        }
        container = null;
        rootInstance;
        useSelectorTemplate = false;
        mount(container) {
            container = normalizeContainer(container);
            // todo validate legal container 
            this.container = container;
            var component = this.rootComponent;
            if (!component.template && !component.render) {
                component.template = container.innerHTML;
                this.useSelectorTemplate = true;
            }
            // clear page template
            container.innerHTML = '';
            // mount root component
            this.rootInstance = mountComponent(createComponent(component, null, null), container);
            this.isMounted = true;
        }
        unmount() {
        }
    }

    const createApp = (rootComponent) => new App(rootComponent);

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
    function injectMapHooks(target, mapHooks) {
        for (let type in mapHooks) {
            injectHook(type, target, mapHooks[type]);
        }
        return target;
    }
    /*
        binding is used for bind the callback context , it is necessary
    */
    function callHook(type, target, options = null, ...args) {
        const hooks = target[type];
        if (!hooks)
            return;
        var { binding, scheduler } = options || emptyObject;
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
    // no beforeCreate
    const onCreated = createHook("created" /* CREATED */);
    const onBeforeMount = createHook("beforeMount" /* BEFORE_MOUNT */);
    const onMounted = createHook("mounted" /* MOUNTED */);
    const onBeforeUpdate = createHook("beforeUpdate" /* BEFORE_UPDATE */);
    const onUpdated = createHook("updated" /* UPDATED */);
    const onBeforeUnmount = createHook("beforeUnmount" /* BEFORE_UNMOUNT */);
    const onUnmounted = createHook("unmounted" /* UNMOUNTED */);

    function injectMixin(options, mixin) {
        for (let key in mixin) {
            switch (key) {
                case exports.ComponentOptions.MIXINS:
                    injectMixins(options, options[key]);
                    break;
                case exports.ComponentOptions.BEFORE_CREATE:
                case exports.ComponentOptions.CREATE:
                case exports.ComponentOptions.CREATED:
                case exports.ComponentOptions.BEFORE_MOUNT:
                case exports.ComponentOptions.MOUNTED:
                case exports.ComponentOptions.BEFORE_UPDATE:
                case exports.ComponentOptions.UPDATED:
                case exports.ComponentOptions.BEFORE_UNMOUNT:
                case exports.ComponentOptions.UNMOUNTED:
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
        ComponentOptions["RENDER"] = "render";
        ComponentOptions["PROPS"] = "props";
        ComponentOptions["MIXINS"] = "mixins";
        ComponentOptions["COMPOENNTS"] = "components";
        ComponentOptions["DIRECTIVES"] = "directives";
    })(exports.ComponentOptions || (exports.ComponentOptions = {}));
    function initOptions(options) {
        for (let key in options) {
            switch (key) {
                case exports.ComponentOptions.TEMPLATE:
                    options.createRender = compile(options[key]);
                    break;
                case exports.ComponentOptions.RENDER:
                    // todo
                    break;
                case exports.ComponentOptions.BEFORE_CREATE:
                case exports.ComponentOptions.CREATE:
                case exports.ComponentOptions.CREATED:
                case exports.ComponentOptions.BEFORE_MOUNT:
                case exports.ComponentOptions.MOUNTED:
                case exports.ComponentOptions.BEFORE_UPDATE:
                case exports.ComponentOptions.UPDATED:
                case exports.ComponentOptions.BEFORE_UNMOUNT:
                case exports.ComponentOptions.UNMOUNTED:
                    var option = options[key];
                    if (option && !isArray(option)) {
                        options[key] = [option];
                    }
                    break;
                case exports.ComponentOptions.MIXINS:
                    var mixins = options[key];
                    injectMixins(options, mixins);
                    break;
                case exports.ComponentOptions.COMPOENNTS:
                    break;
                case exports.ComponentOptions.DIRECTIVES:
                    break;
            }
        }
        options._isOptions = true;
    }

    function initScope() {
        return {};
    }

    function createComponentInstance(options) {
        if (!options._isOptions) {
            initOptions(options);
        }
        var app = getCurrentApp();
        const instance = {
            uid: uid(),
            scope: reactive$1(initScope()),
            render: null,
            vnode: null,
            slots: null,
            props: null,
            createRender: options.createRender,
            components: options.components,
            directives: options.directives,
            // hooks will always be an array
            beforeCreate: options.beforeCreate && [...options.beforeCreate],
            create: options.create && [...options.create],
            created: options.created && [...options.created],
            beforeMount: options.beforeMount && [...options.beforeMount],
            mounted: options.mounted && [...options.mounted],
            beforeUnmount: options.beforeUnmount && [...options.beforeUnmount],
            unmounted: options.unmounted && [...options.unmounted],
            beforeUpdate: options.beforeUpdate && [...options.beforeUpdate],
            updated: options.updated && [...options.updated]
        };
        if (app.mixins) {
            injectMixins(instance, app.mixins);
        }
        return instance;
    }

    function injectDirectives(target, directives) {
        for (let directive of directives) {
            injectDirective(target, directive);
        }
        return target;
    }
    /*
        参数和修饰符是一个数组结构但自身挂载了所有的key，可以灵活运用
    */
    function setOwnKey(arr) {
        for (let key of arr) {
            arr[key] = true;
        }
        return arr;
    }
    /*
        指令注入不能直接添加在钩子中 ，需要额外处理指令信息等
    */
    function injectDirective(target, [directive, value, _arguments, modifiers]) {
        // 指令会携带信息 值 参数 修饰符
        var dirs = target.dirs ||= new Map();
        const infos = {
            value,
            directive,
            _arguments: _arguments && setOwnKey(_arguments),
            modifiers: modifiers && setOwnKey(modifiers)
        };
        dirs.set(directive, infos);
        // ! 
        return target;
    }
    /*
        pervious 节点存在一定是更新 ， 但可能存在key不相同，此时需要进入节点的卸载和新节点的挂载
    */
    function processHook(type, next, previous = null) {
        // 不存在两个节点都不存在
        if (previous) {
            if (next.patchKey === previous.patchKey) {
                // same node update
                doProcessHook(type, next, previous);
            }
            else {
                // fake mount and unmount
                // 卸载旧节点 beforeUnmount , unmounted
                // 挂载新节点 beforeCreate , created , beforeMount , mounted
                if (type === "beforeUpdate" /* BEFORE_UPDATE */) {
                    processHook("beforeUnmount" /* BEFORE_UNMOUNT */, previous);
                    processHook("unmounted" /* UNMOUNTED */, previous);
                }
                else if (type === "updated" /* UPDATED */) {
                    processHook("beforeCreate" /* BEFORE_CREATE */, next);
                    processHook("created" /* CREATED */, next);
                    processHook("beforeMount" /* BEFORE_MOUNT */, next);
                    processHook("mounted" /* MOUNTED */, next);
                }
            }
        }
        else {
            doProcessHook(type, next);
        }
    }
    function normalizeDirective(directive) {
        return isFunction(directive) ? {
            mounted: directive,
            updated: directive
        } : directive;
    }
    function doProcessHook(type, next, previous = undefined) {
        const isComponent = next.nodeType === exports.Nodes.COMPONENT;
        if (isComponent) {
            var instance = next.instance;
            // 组件需要处理实例钩子
            var scope = instance.scope;
            callHook(type, instance, { binding: scope }, scope);
        }
        for (let [dir, infos] of next.dirs || emptyArray) {
            var _dir = normalizeDirective(dir);
            var hook = _dir[type];
            if (hook) {
                if (previous) {
                    infos.oldValue = previous.dirs.get(dir).value;
                }
                // 
                hook(isComponent ? next.instance.scope : next.el, infos, next, previous);
            }
        }
    }

    exports.$var = $var;
    exports.App = App;
    exports.emptyArray = emptyArray;
    exports.emptyObject = emptyObject;
    exports.IMPORTANT = IMPORTANT;
    exports.IMPORTANT_KEY = IMPORTANT_KEY;
    exports.IMPORTANT_SYMBOL = IMPORTANT_SYMBOL;
    exports.NULL = NULL;
    exports.SYMBOL_ITERATOR = SYMBOL_ITERATOR$1;
    exports.addClass = addClass;
    exports.addEventListener = addEventListener;
    exports.appendMedium = appendMedium;
    exports.arrayToMap = arrayToMap;
    exports.attr = attr;
    exports.builtInComponents = builtInComponents;
    exports.builtInDirectives = builtInDirectives;
    exports.cache = cache;
    exports.calc = calc;
    exports.callFn = callFn;
    exports.callHook = callHook;
    exports.camelize = camelize;
    exports.capitalize = capitalize;
    exports.checkBuiltInAnimations = checkBuiltInAnimations;
    exports.compile = compile;
    exports.computed = computed;
    exports.createApp = createApp;
    exports.createComponent = createComponent;
    exports.createComponentInstance = createComponentInstance;
    exports.createDeclaration = createDeclaration;
    exports.createElement = createElement;
    exports.createEvent = createEvent;
    exports.createFragment = createFragment;
    exports.createFunction = createFunction;
    exports.createHandlerKey = createHandlerKey;
    exports.createKeyframe = createKeyframe;
    exports.createKeyframes = createKeyframes;
    exports.createMapEntries = createMapEntries;
    exports.createMedia = createMedia;
    exports.createNode = createNode;
    exports.createSetter = createSetter;
    exports.createStyle = createStyle;
    exports.createStyleSheet = createStyleSheet;
    exports.createSupports = createSupports;
    exports.createText = createText;
    exports.cubicBezier = cubicBezier;
    exports.declare = declare;
    exports.deleteKeyframe = deleteKeyframe;
    exports.deleteMedium = deleteMedium;
    exports.deleteRule = deleteRule;
    exports.destructur = destructur;
    exports.sortChildren = sortChildren;
    exports.display = display;
    exports.doFlat = doFlat;
    exports.docCreateComment = docCreateComment;
    exports.docCreateElement = docCreateElement;
    exports.docCreateText = docCreateText;
    exports.dynamicMapKey = dynamicMapKey;
    exports.effect = effect;
    exports.error = error;
    exports.exec = exec;
    exports.execCaptureGroups = execCaptureGroups;
    exports.extend = extend;
    exports.flatRules = flatRules;
    exports.getComponent = getComponent;
    exports.getCurrentApp = getCurrentApp;
    exports.getCurrentInstance = getCurrentInstance;
    exports.getCurrentScope = getCurrentScope;
    exports.getDirective = getDirective;
    exports.getElementComputedStyle = getElementComputedStyle;
    exports.getElementStyle = getElementStyle;
    exports.getElementStyleValue = getElementStyleValue;
    exports.getEmptyObject = getEmptyObject;
    exports.getLastVisitKey = getLastVisitKey;
    exports.getLastVisitTarget = getLastVisitTarget;
    exports.getReservedProp = getReservedProp;
    exports.getStyle = getStyle;
    exports.getStyleValue = getStyleValue;
    exports.unionkeys = unionkeys;
    exports.hasOwn = hasOwn;
    exports.hsl = hsl;
    exports.hsla = hsla;
    exports.hyphenate = hyphenate;
    exports.important = important;
    exports.initOptions = initOptions;
    exports.initScope = initScope;
    exports.injectDirective = injectDirective;
    exports.injectDirectives = injectDirectives;
    exports.injectHook = injectHook;
    exports.injectMapHooks = injectMapHooks;
    exports.injectMixin = injectMixin;
    exports.injectMixins = injectMixins;
    exports.insertElement = insertElement;
    exports.insertKeyframe = insertKeyframe;
    exports.insertKeyframes = insertKeyframes;
    exports.insertMedia = insertMedia;
    exports.insertNull = insertNull;
    exports.insertRule = insertRule;
    exports.insertStyle = insertStyle;
    exports.insertSupports = insertSupports;
    exports.installAnimation = installAnimation;
    exports.isArray = isArray;
    exports.isEvent = isEvent;
    exports.isFunction = isFunction;
    exports.isHTMLTag = isHTMLTag;
    exports.isNumber = isNumber;
    exports.isNumberString = isNumberString;
    exports.isObject = isObject;
    exports.isReactive = isReactive;
    exports.isRef = isRef;
    exports.isReservedProp = isReservedProp;
    exports.isSVGTag = isSVGTag;
    exports.isShallow = isShallow;
    exports.isString = isString;
    exports.isUndefined = isUndefined;
    exports.joinSelector = joinSelector;
    exports.keyOf = keyOf;
    exports.keyframe = keyframe;
    exports.keyframes = keyframes;
    exports.makeMap = makeMap;
    exports.max = max;
    exports.mergeSelectors = mergeSelectors;
    exports.mergeSplitedSelector = mergeSplitedSelector;
    exports.mergeSplitedSelectorsAndJoin = mergeSplitedSelectorsAndJoin;
    exports.min = min;
    exports.mixin = mixin;
    exports.mount = mount;
    exports.mountAttributes = mountAttributes;
    exports.mountChildren = mountChildren;
    exports.mountClass = mountClass;
    exports.mountComponent = mountComponent;
    exports.mountDeclaration = mountDeclaration;
    exports.mountKeyframeRule = mountKeyframeRule;
    exports.mountRule = mountRule;
    exports.mountStyleRule = mountStyleRule;
    exports.mountStyleSheet = mountStyleSheet;
    exports.nextTick = nextTick;
    exports.nextTickSingleWork = nextTickSingleWork;
    exports.normalizeClass = normalizeClass;
    exports.normalizeKeyText = normalizeKeyText;
    exports.normalizeStyle = normalizeStyle;
    exports.objectStringify = objectStringify;
    exports.onBeforeMount = onBeforeMount;
    exports.onBeforeUnmount = onBeforeUnmount;
    exports.onBeforeUpdate = onBeforeUpdate;
    exports.onCreated = onCreated;
    exports.onMounted = onMounted;
    exports.onUnmounted = onUnmounted;
    exports.onUpdated = onUpdated;
    exports.onceListener = onceListener;
    exports.parseHandlerKey = parseHandlerKey;
    exports.parseInlineClass = parseInlineClass;
    exports.parseInlineStyle = parseInlineStyle;
    exports.parseStyleValue = parseStyleValue;
    exports.patch = patch;
    exports.perspective = perspective;
    exports.processHook = processHook;
    exports.processdom = processdom;
    exports.reactive = reactive$1;
    exports.reactiveCollectionHandler = reactiveCollectionHandler;
    exports.reactiveHandler = reactiveHandler;
    exports.readonlyCollectionHandler = readonlyCollectionHandler;
    exports.readonlyHandler = readonlyHandler;
    exports.ref = ref;
    exports.removeAttribute = removeAttribute;
    exports.removeClass = removeClass;
    exports.removeElement = removeElement;
    exports.removeEventListener = removeEventListener;
    exports.removeFromArray = removeFromArray;
    exports.renderList = renderList;
    exports.renderSlot = renderSlot;
    exports.rgb = rgb;
    exports.rgba = rgba;
    exports.rotate = rotate;
    exports.rotate3d = rotate3d;
    exports.rotateY = rotateY;
    exports.scale = scale;
    exports.scale3d = scale3d;
    exports.scaleY = scaleY;
    exports.setAttribute = setAttribute;
    exports.setCurrentInstance = setCurrentInstance;
    exports.setElementStyleDeclaration = setElementStyleDeclaration;
    exports.setElementTranstion = setElementTranstion;
    exports.setKeyText = setKeyText;
    exports.setKeyframesName = setKeyframesName;
    exports.setScopeExp = setScopeExp;
    exports.setSelector = setSelector;
    exports.setStyleProperty = setStyleProperty;
    exports.setText = setText;
    exports.shallowReactiveCollectionHandler = shallowReactiveCollectionHandler;
    exports.shallowReactiveHandler = shallowReactiveHandler;
    exports.shallowReadonlyCollectionHandler = shallowReadonlyCollectionHandler;
    exports.shallowReadonlyHandler = shallowReadonlyHandler;
    exports.skew = skew;
    exports.skewX = skewX;
    exports.skewY = skewY;
    exports.splitSelector = splitSelector;
    exports.stringToMap = stringToMap;
    exports.stringify = stringify;
    exports.ternaryChains = ternaryChains;
    exports.ternaryExp = ternaryExp;
    exports.toArray = toArray;
    exports.toArrowFunction = toArrowFunction;
    exports.toBackQuotes = toBackQuotes;
    exports.toRaw = toRaw;
    exports.toReservedProp = toReservedProp;
    exports.toSingleQuotes = toSingleQuotes;
    exports.toTernaryExp = toTernaryExp;
    exports.track = track;
    exports.translate3d = translate3d;
    exports.translateX = translateX;
    exports.translateY = translateY;
    exports.trigger = trigger;
    exports.typeOf = typeOf;
    exports.uStringId = uStringId;
    exports.uVar = uVar;
    exports.uid = uid;
    exports.unmount = unmount;
    exports.unmountChildren = unmountChildren;
    exports.unmountClass = unmountClass;
    exports.unmountComponent = unmountComponent;
    exports.unmountDeclaration = unmountDeclaration;
    exports.update = update;
    exports.updateAttributes = updateAttributes;
    exports.updateChildren = updateChildren;
    exports.updateClass = updateClass;
    exports.updateComponent = updateComponent;
    exports.updateDeclaration = updateDeclaration;
    exports.updateStyleSheet = updateStyleSheet;
    exports.warn = warn;
    exports.watch = watch;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
