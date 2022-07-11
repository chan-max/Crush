/**
 * 
 *     Crush.js 
 *     1.0.16
 *     chan
 * 
 */

var Crush = (function (exports) {
    'use strict';

    // compiler required : 
    const modelText = {
        created(el, _, vnode) {
            const changeModelValue = vnode.props._changeModelValue;
            el.addListener('input', () => {
                changeModelValue(el.value);
            });
        }
    };

    function setDisplay(el, show) {
        if (show) {
            el.style.display = el._display;
        }
        else {
            el.style.display = 'none';
        }
    }
    const showDirective = {
        beforeMount(el, { value }, { transition }) {
            el._display = el.style.display;
            setDisplay(el, value);
        },
        updated(el, { value, oldValue }, { transition }) {
            if (!value === !oldValue) {
                return;
            }
            else if (!transition) {
                setDisplay(el, value);
            }
            else {
                transition.processShow(el, value);
            }
        }
    };

    const cache = (fn) => {
        const cache = Object.create(null);
        return ((key) => {
            const cached = cache[key];
            return cached === undefined ? (cache[key] = fn(key)) : cached;
        });
    };

    const warn = (...msg) => console.warn(...msg);
    const error = (...msg) => {
        throw new Error(...msg);
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
    const emptyFunction = () => null;
    const createMap = (entries) => new Map(entries);

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
    const shallowCloneArray = (arr) => arr && [...arr];
    function mark(target, key, value = true) {
        Object.defineProperty(target, key, {
            value,
            writable: true,
            configurable: false,
            enumerable: false
        });
    }

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
        return typeof value === 'number' && !isNaN(value);
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
    const isPromise = (value) => {
        return isObject(value) && isFunction(value.then) && isFunction(value.catch);
    };
    const isArray = Array.isArray;

    const camelizeRE = /-(\w)/g;
    const camelize = cache((str) => {
        return str.replace(camelizeRE, (_, c) => (c ? c.toUpperCase() : ''));
    });
    const hyphenateRE = /\B([A-Z])/g;
    const hyphenate = cache((str) => str.replace(hyphenateRE, '-$1').toLowerCase());
    const initialUpperCase = cache((str) => str.charAt(0).toUpperCase() + str.slice(1));
    const initialLowerCase = cache((str) => str.charAt(0).toLowerCase() + str.slice(1));

    const hasOwnProperty = Object.prototype.hasOwnProperty;
    // target may be null undefined
    const hasOwn = (target, key) => target && hasOwnProperty.call(target, key);

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
    const addListener = (el, event, handler, options = null) => el.addEventListener(event, handler, options);
    const removeListener = (el, event, handler, options = null) => el.removeEventListener(event, handler, options);
    function onceListener(el, event, handler, options = null) {
        var onceHandler = () => {
            handler();
            removeListener(el, event, onceHandler, options);
        };
        addListener(el, event, onceHandler, options);
        // 注销事件
        return () => removeListener(el, event, onceHandler, options);
    }

    //! class
    function bindEnterClass(el, name) {
        addClass(el, `${name}-enter`);
        addClass(el, `${name}-enter-from`);
        requestAnimationFrame(() => {
            addClass(el, `${name}-enter-to`);
            removeClass(el, `${name}-enter-from`);
        });
    }
    function removeEnterClass(el, name) {
        removeClass(el, `${name}-enter-to`);
        removeClass(el, `${name}-enter`);
    }
    function bindLeaveClass(el, name) {
        addClass(el, `${name}-leave-from`);
        document.body.offsetHeight;
        addClass(el, `${name}-leave`);
        requestAnimationFrame(() => {
            addClass(el, `${name}-leave-to`);
            removeClass(el, `${name}-leave-from`);
        });
    }
    function removeLeaveClass(el, name) {
        removeClass(el, `${name}-leave-to`);
        removeClass(el, `${name}-leave`);
    }
    let leavingElements = {};
    let enteringElements = {};
    const createTransition = (options) => new TransitionDesc(options);
    // 整个transtion描述不参与节点的真实挂载卸载，显示或隐藏
    class TransitionDesc {
        type; // css / animation
        name;
        duration; // css一般不需要
        appear;
        // hooks
        onBeforeEnter;
        onEnter;
        onAfterEnter;
        onEnterCancelled;
        onBeforeLeave;
        onLeave;
        onAfterLeave;
        onLeaveCancelled;
        constructor(options) {
            this.update(options);
        }
        update(options) {
            options ||= emptyObject;
            const { type, name, duration, 
            // hooks
            onBeforeEnter, onEnter, onAfterEnter, onEnterCancelled, onBeforeLeave, onLeave, onAfterLeave, onLeaveCancelled } = options;
            this.name = name || 'transition';
            this.type = type || 'css';
            this.appear = this.appear || false;
            this.duration = duration;
            this.onBeforeEnter = onBeforeEnter;
            this.onEnter = onEnter;
            this.onAfterEnter = onAfterEnter;
            this.onEnterCancelled = onEnterCancelled;
            this.onBeforeLeave = onBeforeLeave;
            this.onLeave = onLeave;
            this.onAfterLeave = onAfterLeave;
            this.onLeaveCancelled = onLeaveCancelled;
        }
        bindeEnterClass = (el) => bindEnterClass(el, this.name);
        bindeLeaveClass = (el) => bindLeaveClass(el, this.name);
        removeEnterClass = (el) => removeEnterClass(el, this.name);
        removeLeaveClass = (el) => removeLeaveClass(el, this.name);
        beforeEnter() { }
        beforeLeave() { }
        cancelEnter() {
        }
        canceleave(el) {
        }
        enter(el, enterOp) {
            // ! 新建节点插入时，leaving的元素和
            let { patchKey } = el._vnode;
            enteringElements[patchKey] = el;
            enterOp();
            bindEnterClass(el, this.name);
            onceListener(el, 'transitionend', () => {
                removeEnterClass(el, this.name);
                enteringElements[patchKey] = null;
                console.log('afterEnter');
            });
        }
        leave(el, leaveOp) {
            let { patchKey } = el._vnode;
            leavingElements[patchKey] = el;
            bindLeaveClass(el, this.name);
            onceListener(el, 'transitionend', () => {
                console.log('leave');
                removeLeaveClass(el, this.name);
                leaveOp();
                leavingElements[patchKey] = null;
            });
        }
        processMount(newEl, insertFn) {
            insertFn();
        }
        processUnmount(el) {
            removeElement(el);
        }
        // show
        processShow(el, show) {
            if (show) {
                // enter
                if (el._leaving) {
                    this.canceleave(el);
                }
                this.bindeEnterClass(el);
            }
        }
    }

    const transitionComponent = {
        props: {},
        render: ({ $slots }) => $slots.default(),
        beforeMount({ $instance: { scope, renderingVnode }, $props }) {
            const transtion = createTransition($props);
            renderingVnode.forEach((vnode) => {
                vnode.transition = transtion;
            });
        },
        beforeUpdate({ $instance: { renderingVnode }, $props }) {
            const transtion = createTransition($props);
            renderingVnode && renderingVnode.forEach((vnode) => {
                vnode.transition = transtion;
            });
        }
    };
    // 第一次进入任何元素都不会过渡
    const transitionGroupComponent = {
        props: {},
        render: ({ $slots }) => $slots.default(),
        beforeUpdate({ $instance: { scope, vnode, renderingVnode }, $props }) {
            const transtion = createTransition($props);
            const mountList = renderingVnode.filter((patchKey) => !vnode.map((_) => _.patchKey).includes(patchKey));
            const unmountList = vnode.filter((patchKey) => !renderingVnode.map((_) => _.patchKey).includes(patchKey));
            const transitionList = mountList.concat(unmountList);
            transitionList.forEach((_) => {
                _.transition = transtion;
            });
        }
    };
    /*
        --transition.fast=""

    */
    const transitionDirective = {
        beforeCreate(_, { value }, vnode) {
            vnode.transition = createTransition(value);
        },
        beforeUpdate(_, { value }, nVnode, pVnode) {
            const transition = pVnode.transition;
            transition.update(value);
            nVnode.transition = transition; // extend
        }
    };

    const builtInComponents = {
        transition: transitionComponent,
        transitionGroup: transitionGroupComponent
    };
    const builtInDirectives$1 = {
        show: showDirective,
        modelText,
        transition: transitionDirective,
        transitionGroup: transitionGroupComponent
    };

    function createNode(nodeType) {
        return {
            key: null,
            nodeType,
            type: null,
            props: null,
            children: null
        };
    }
    const COMPONENT_TYPE = Symbol('ComponentType');
    function createComponent(type, props, children, key = uid()) {
        let componentFlag = type[COMPONENT_TYPE];
        if (!componentFlag) {
            // stateful component
            if (isObject(type)) {
                componentFlag = 14 /* COMPONENT */;
                resolveOptions(type);
            }
            else if (isFunction(type)) {
                // render component
                componentFlag = 15 /* RENDER_COMPONENT */;
            }
            mark(type, COMPONENT_TYPE, componentFlag);
        }
        return {
            nodeType: componentFlag,
            type,
            props,
            children,
            key
        };
    }
    function createElement(tagName, props, children, key = uid()) {
        var node = createNode(13 /* HTML_ELEMENT */);
        node.type = tagName;
        node.props = props;
        node.children = children;
        node.key = key;
        return node;
    }
    function createSVGElement(tagName, props, children, key = uid()) {
        var node = createNode(9 /* SVG_ELEMENT */);
        node.type = tagName;
        node.props = props;
        node.children = children;
        node.key = key;
        return node;
    }
    const Text = Symbol('Text');
    // the key is for other node
    function createText(text, key = uid()) {
        var node = createNode(12 /* TEXT */);
        node.type = Text;
        node.children = text;
        node.key = key;
        return node;
    }
    const Comment = Symbol('Comment');
    function createComment(text, key = uid()) {
        return {
            type: Comment,
            nodeType: 10 /* HTML_COMMENT */,
            children: text,
            key
        };
    }
    const Fragment = Symbol('Fragment');
    function createFragment(children, key = uid()) {
        const f = createNode(1 /* FRAGMENT */);
        f.type = Fragment;
        f.children = children;
        f.key = key;
        return f;
    }

    var createStyleSheet = (props, children, key = uid()) => {
        var node = createNode(17 /* STYLE */);
        node.props = props;
        node.children = children;
        node.key = key;
        node.type = 'style'; // used for diff
        return node;
    };
    var createStyle = (selector, children, key) => {
        return {
            nodeType: 26 /* STYLE_RULE */,
            selector,
            children,
            key
        };
    };
    var createMedia = (media, children, key) => ({
        nodeType: 22 /* MEDIA_RULE */,
        media,
        children,
        key
    });
    var createKeyframes = (keyframes, children, key = uid()) => {
        var node = createNode(24 /* KEYFRAMES_RULE */);
        node.keyframes = keyframes;
        node.children = children;
        node.key = key;
        return node;
    };
    var createKeyframe = (keyframe, children, key = uid()) => {
        var node = createNode(27 /* KEYFRAME_RULE */);
        node.keyframe = keyframe;
        node.children = children;
        node.key = key;
        return node;
    };
    var createSupports = (supports, children, key) => ({
        nodeType: 23 /* SUPPORTS_RULE */,
        supports,
        children,
        key
    });
    var createDeclaration = (children, key) => {
        return {
            nodeType: 29 /* DECLARATION */,
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
                case 26 /* STYLE_RULE */:
                    flattedRules.push(rule);
                    var _children = rule.children;
                    rule.children = null;
                    if (_children) {
                        doFlat(_children, flattedRules, rule);
                    }
                    break;
                case 29 /* DECLARATION */:
                    if (!rule.parent) {
                        debugger;
                        // 声明不再任何样式规则或媒体规则下时,应该报错
                    }
                    else if (rule.parent.nodeType === 26 /* STYLE_RULE */) {
                        (rule.parent.children ||= []).push(rule);
                    }
                    else if (rule.parent.nodeType === 27 /* KEYFRAME_RULE */) {
                        (rule.parent.children ||= []).push(rule);
                    }
                    else {
                        /*
                            当一条样式声明不时样式规则的子节点
                        */
                        if (rule.parent.nodeType === 22 /* MEDIA_RULE */) {
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
                case 22 /* MEDIA_RULE */:
                    rule.children = flatRules(rule.children, rule);
                    flattedRules.push(rule);
                    break;
                case 23 /* SUPPORTS_RULE */:
                    rule.children = flatRules(rule.children);
                    flattedRules.push(rule);
                    break;
                case 24 /* KEYFRAMES_RULE */:
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
                case 27 /* KEYFRAME_RULE */:
                    /* 需要和styleRule处理方式一样 */
                    flattedRules.push(rule);
                    var _children = rule.children;
                    rule.children = null;
                    if (_children) {
                        doFlat(_children, flattedRules, rule);
                    }
                    break;
                case 1 /* FRAGMENT */:
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
            if (rule.nodeType === 26 /* STYLE_RULE */) {
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
    function processStringRender(source, key) {
        source = String(source);
        return source.startsWith('! ') ?
            createComment(source.slice(2), key) :
            createText(source, key);
    }
    function processRenderResult(node, parentKey) {
        if (!node) {
            return null;
        }
        if (isString(node) || isNumber(node)) {
            node = processStringRender(node, parentKey);
        }
        if (!isArray(node)) {
            node = [node];
        }
        var flattedNode = [];
        node.forEach((child) => {
            if (!child)
                return; // 空节点筛除  
            if (child.nodeType === 1 /* FRAGMENT */) {
                /* 这里给后续传入fragment的key，为了使后续的每个节点都能有唯一的key ,
                    当使用 for循环时，只能传入一个key，但会在循环时为每个结果生成唯一的key
                */
                flattedNode = flattedNode.concat(processRenderResult(child.children, child.key));
            }
            else {
                if (parentKey) {
                    child.patchKey = parentKey + '_' + child.key;
                }
                else {
                    child.patchKey = child.key;
                }
                if (child.nodeType === 13 /* HTML_ELEMENT */ || child.nodeType === 9 /* SVG_ELEMENT */) {
                    // 子节点递归处理
                    child.children = processRenderResult(child.children);
                }
                if (child.nodeType === 17 /* STYLE */) {
                    child.children = flatRules(child.children, null, child.patchKey);
                }
                flattedNode.push(child);
            }
        });
        return flattedNode;
    }

    const insertNull = (arr, index, length = 1) => arr.splice(index, 0, ...new Array(length).fill(null));
    const isReservedProp = (key) => key.startsWith(`_`);
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
    /*
        dom 事件名称无大写，所以name上第一个参数为事件名称，其它为arguments
    */
    // 只有原生事件支持 opitons
    function toNativeEventName(eventName, _arguments) {
        var name = `on${initialUpperCase(eventName)}`;
        if (_arguments && _arguments.length !== 0) {
            name += _arguments.map(initialUpperCase).join(''); // join default with ,
        }
        return name;
    }
    const parseNativeEventName = (name) => {
        var keys = name.split(/(?=[A-Z])/).map((key) => key.toLowerCase());
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
    /*
        @event:arg1:arg2.mod1.mod2
            tranform to...
            onEvent_arg1_arg2$mod1$mod2
    */
    function toEventName(event, _arguments, modifiers) {
        event = `on${initialUpperCase(event)}`;
        _arguments && (event += _arguments.map((_) => `_${_}`).join(''));
        modifiers && (event += modifiers.map(($) => `$${$}`).join(''));
        return event;
    }
    // quickly get the handler key event
    function getEventName(name) {
        return initialLowerCase(name.slice(2).split(/_|\$/)[0]);
    }
    const extrctEventNameRE = /on([a-zA-Z]+)([_a-zA-Z]*)([\$a-zA-Z]*)/;
    function parseEventName(name) {
        const [_, event, _argumentsStr, modifiersStr] = extrctEventNameRE.exec(name);
        return {
            event: initialLowerCase(event),
            _arguments: _argumentsStr && arrayToMap(_argumentsStr.split('_').filter(Boolean)),
            modifiers: modifiersStr && arrayToMap(modifiersStr.split('$').filter(Boolean))
        };
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
    function withEventModifiers(fn, modifiers) {
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
        if (isNumber(Number(keyframe))) {
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
    function getElementComputedStyleValue(el, key) {
        return getStyleValue(window.getComputedStyle(el), key);
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

    const globalInstanceEventListeners = new WeakMap();
    function getInstanceEvents(instance) {
        let listenersMap = globalInstanceEventListeners.get(instance);
        if (!listenersMap) {
            listenersMap = new Map();
            globalInstanceEventListeners.set(instance, listenersMap);
        }
        return listenersMap;
    }
    function getInstancetEventListeners(instance, event) {
        let events = getInstanceEvents(instance);
        let listeners = events.get(event);
        if (!listeners) {
            listeners = new Set();
            events.set(event, listeners);
        }
        return listeners;
    }
    function createInstanceEventEmitter(instance) {
        return (event, ...args) => {
            emitInstancetEvent(instance, event, ...args);
        };
    }
    function emitInstancetEvent(instance, event, ...args) {
        const listeners = getInstancetEventListeners(instance, event);
        listeners.forEach((handler) => {
            handler(...args);
        });
    }
    /* handler 标准化，转成数组格式 */
    function arrayHandler(handler) {
        return (isArray(handler) ? handler : [handler]).filter(isFunction);
    }
    function operateHandler(operatorType, instance, event, rawhandler) {
        const listeners = getInstancetEventListeners(instance, event);
        arrayHandler(rawhandler).forEach((handler) => {
            switch (operatorType) {
                case 0 /* ADD */:
                    listeners.add(handler);
                    break;
                case 1 /* DELETE */:
                    listeners.delete(handler);
                    break;
                case 2 /* ONCE */:
                    const onceHandler = (...args) => {
                        handler(...args);
                        listeners.delete(onceHandler);
                    };
                    listeners.add(onceHandler);
                    break;
            }
        });
    }
    function updateInstanceListeners(instance, event, pHandler, nHandler) {
        // 不影响组件自身注册的事件
        removeInstanceListener(instance, event, pHandler);
        addInstanceListener(instance, event, nHandler);
    }
    function addInstanceListener(instance, event, handler) {
        operateHandler(0 /* ADD */, instance, event, handler);
    }
    function removeInstanceListener(instance, event, handler) {
        operateHandler(1 /* DELETE */, instance, event, handler);
    }
    function onceInstanceListener(instance, event, handler) {
        operateHandler(2 /* ONCE */, instance, event, handler);
    }
    // native events

    function updateClass(el, pClass, nClass) {
        pClass = normalizeClass(pClass);
        nClass = normalizeClass(nClass);
        for (let className of unionkeys(pClass, nClass)) {
            var p = pClass[className];
            var n = nClass[className];
            p ? (n || removeClass(el, className)) : (n && addClass(el, className));
        }
    }
    function mountClass(el, _class) {
        updateClass(el, emptyObject, _class);
    }
    function unmountClass(el) {
        el.className = '';
    }
    function mountAttributes(el, props, instance, isSVG) {
        updateAttributes(el, emptyObject, props, instance, isSVG);
    }
    function updateAttributes(el, pProps, nProps, instance, isSVG = false) {
        pProps ||= emptyObject;
        nProps ||= emptyObject;
        for (let propName of unionkeys(pProps, nProps)) {
            var pValue = pProps[propName];
            var nValue = nProps[propName];
            switch (propName) {
                case 'style':
                    updateDeclaration(el.style, normalizeStyle(pValue), normalizeStyle(nValue));
                    break;
                case 'class':
                case 'className':
                    updateClass(el, pValue, nValue);
                    break;
                case 'ref':
                    let refs = instance.refs ||= {};
                    if (nValue !== pValue) {
                        pValue && (refs[pValue] = null);
                        nValue && (refs[nValue] = el);
                    }
                    break;
                default:
                    if (propName.startsWith('_')) ;
                    else if (isEvent(propName)) {
                        var { event, options } = parseNativeEventName(propName);
                        updateNativeEvents(el, event, pValue, nValue, options);
                    }
                    else if (propName in el) { // dom props
                        (pValue !== nValue) && (el[propName] = nValue);
                    }
                    else {
                        // attribute
                        (pValue !== nValue) && (nValue ? setAttribute(el, propName, nValue) : removeAttribute(el, propName));
                    }
            }
        }
    }
    /*
        原生侦听器支持一维数组格式，[a,b,c]
    */
    function updateNativeEvents(el, event, pHandler, nHandler, options) {
        arrayHandler(pHandler).forEach((ph) => {
            removeListener(el, event, ph, options);
        });
        arrayHandler(nHandler).forEach((nh) => {
            addListener(el, event, nh, options);
        });
    }

    /*
        mountStyleSheet will create a style element
    */
    const mountStyleSheet = (vnode, container, anchor, parent) => {
        const { props, children } = vnode;
        var el = docCreateElement('style');
        mountAttributes(el, props, parent, false);
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
            case 26 /* STYLE_RULE */:
                mountStyleRule(sheet, rule, vnode, index);
                break;
            case 22 /* MEDIA_RULE */:
                mountMediaRule(sheet, rule, vnode, index);
                break;
            case 23 /* SUPPORTS_RULE */:
                mountSupportsRule(sheet, rule, vnode, index);
                break;
            case 24 /* KEYFRAMES_RULE */:
                mountKeyframesRule(sheet, rule, vnode, index);
                break;
            case 27 /* KEYFRAME_RULE */:
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

    function mountRenderComponent(vnode, container, anchor, parent) {
        const { type, props, children } = vnode;
        const renderResult = type.call(null, props, children);
        const next = processRenderResult(renderResult);
        vnode.vnode = next; // 保存当前组件的树
        patch(null, next, container, anchor, parent);
    }
    function updateRenderComponent(p, n, container, anchor, parent) {
        console.log('update render component');
        const { type, props, children } = n;
        const renderResult = type.call(null, props, children);
        const next = processRenderResult(renderResult);
        n.vnode = next; //
        const prev = p.vnode;
        patch(prev, next, container, anchor, parent);
    }
    function unmountRenderComponent(vnode, container, anchor, parent) {
        patch(vnode.vnode, null, container, anchor, parent);
    }

    function mount(vnode, container, anchor = null, parent = null) {
        switch (vnode.nodeType) {
            case 13 /* HTML_ELEMENT */:
                mountElement(vnode, container, anchor, parent);
                break;
            case 9 /* SVG_ELEMENT */:
                mountElement(vnode, container, anchor, parent, true);
            case 12 /* TEXT */:
                mountText(vnode, container, anchor);
                break;
            case 10 /* HTML_COMMENT */:
                insertElement(vnode.el = docCreateComment(vnode.children), container, anchor);
            case 14 /* COMPONENT */:
                mountComponent(vnode, container, anchor, parent);
                break;
            case 15 /* RENDER_COMPONENT */:
                mountRenderComponent(vnode, container, anchor, parent);
                break;
            case 17 /* STYLE */:
                mountStyleSheet(vnode, container, anchor, parent);
                break;
        }
    }
    function mountChildren(children, container, anchor, parent) {
        if (!children)
            return;
        children.forEach((child) => {
            mount(child, container, anchor, parent);
        });
    }
    function mountElement(vnode, container, anchor, parent, isSVG = false) {
        // 1
        processHook("beforeCreate" /* BEFORE_CREATE */, vnode);
        // 2
        const { type, props, children, transition, patchKey } = vnode;
        // create 
        const el = vnode.el = docCreateElement(type, isSVG);
        el._vnode = vnode;
        mountAttributes(el, props, parent, isSVG);
        processHook("created" /* CREATED */, vnode);
        processHook("beforeMount" /* BEFORE_MOUNT */, vnode);
        // 进入动画不影响节点的插入
        if (transition) {
            transition.processMount(el, () => insertElement(el, container, anchor));
        }
        else {
            insertElement(el, container, anchor);
        }
        processHook("mounted" /* MOUNTED */, vnode);
        mountChildren(children, el, anchor, parent);
    }
    function mountText(vnode, container, anchor, parent) {
        var el = docCreateText(vnode.children);
        vnode.el = el;
        insertElement(el, container, anchor);
    }

    const unmountComponent = (component, container, anchor = null) => {
        const { instance } = component;
        const { vnode } = instance;
        processHook("beforeUnmount" /* BEFORE_UNMOUNT */, component);
        patch(vnode, null, container, anchor, parent);
        processHook("unmounted" /* UNMOUNTED */, component);
    };

    function unmount(vnode, container, anchor, parent) {
        switch (vnode.nodeType) {
            case 13 /* HTML_ELEMENT */:
                unmountElement(vnode);
                break;
            case 10 /* HTML_COMMENT */:
                removeElement(vnode.el);
                break;
            case 17 /* STYLE */:
                unmountElement(vnode);
                break;
            case 9 /* SVG_ELEMENT */:
                unmountElement(vnode);
                break;
            case 12 /* TEXT */:
                removeElement(vnode.el);
                break;
            case 14 /* COMPONENT */:
                unmountComponent(vnode, container, anchor);
                break;
            case 15 /* RENDER_COMPONENT */:
                unmountRenderComponent(vnode, container, anchor, parent);
                break;
        }
    }
    function unmountChildren(children) {
        // 卸载过程目前不需要锚点
        children.forEach(unmount);
    }
    function unmountElement(vnode) {
        const { el, transition } = vnode;
        processHook("beforeUnmount" /* BEFORE_UNMOUNT */, vnode);
        if (vnode.children && vnode.nodeType !== 17 /* STYLE */) {
            unmountChildren(vnode.children);
        }
        if (transition) {
            transition.processUnmount(el);
        }
        else {
            removeElement(el);
        }
        processHook("unmounted" /* UNMOUNTED */, vnode);
    }

    const mountComponentProps = (instance, props) => updateComponentProps(instance, null, props);
    function updateComponentProps(instance, pProps, nProps) {
        pProps ||= emptyObject;
        nProps ||= emptyObject;
        const { scope, propsOptions, emitsOptions } = instance;
        // 在props都不存在的情况下也要处理默认值，必须值等情况，所以传入propsoptions进入循环
        for (let prop of unionkeys(pProps, nProps, propsOptions, emitsOptions)) {
            let pValue = pProps[prop];
            let nValue = nProps[prop];
            if (prop.startsWith('_')) ;
            else if (prop === 'ref') {
                // ref component
                let refs = instance.parent.refs ||= {};
                if (nValue !== pValue) {
                    pValue && (refs[pValue] = null);
                    nValue && (refs[nValue] = instance);
                }
            }
            else if (!emitsOptions[getEventName(prop)] && !propsOptions[prop]) {
                // 未定义
                let attrs = instance.attrs ||= {};
                attrs[prop] = nValue;
            }
            else if (isEvent(prop)) {
                // events
                var { event, _arguments, modifiers } = parseEventName(prop);
                updateInstanceListeners(instance, event, pValue, nValue);
            }
            else {
                // props
                const { default: _default, type, validator, required } = propsOptions[prop];
                if (isUndefined(nValue)) {
                    // nValue 不存在在时应该使用默认值
                    if (required) {
                        error(`props ${prop} is required`);
                    }
                    else {
                        nValue = _default;
                    }
                }
                if (type && nValue.constructor !== type) {
                    error(`prop ${nValue} is not the typeOf ${type.name}`);
                }
                if (validator && !validator(nValue)) {
                    error(`prop ${nValue} is not legal for custom validator`);
                }
                // do update props value
                scope[prop] = nValue;
            }
        }
    }

    const updateComponent = (p, n, container, anchor, parent) => {
        // 进入update 则patchkey一定相同
        const { instance, props: pProps } = p;
        n.instance = instance;
        updateComponentProps(instance, pProps, n.props);
        // update slots ... 不需要更新slot
        // 把新节点存到更新方法上，有该节点代表为外部更新，而非自更新
        instance.updatingComponentVnode = n;
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
                    case 26 /* STYLE_RULE */:
                        updateStyleRule(pRule, nRule);
                        break;
                    case 22 /* MEDIA_RULE */:
                        updateMediaRule(pRule, nRule, vnode);
                        break;
                    case 23 /* SUPPORTS_RULE */:
                        // supports can't update 
                        deleteRule(sheet, cursor);
                        mountRule(sheet, nRule, vnode, cursor);
                        break;
                    case 24 /* KEYFRAMES_RULE */:
                        updateKeyframesRule(pRule, nRule);
                        break;
                }
            }
            cursor++;
        }
    }
    function updateStyleRule(pRule, nRule, vnode) {
        var rule = nRule.rule = pRule.rule;
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

    function update(p, n, container, anchor, parent) {
        switch (n.nodeType) {
            case 12 /* TEXT */:
                updateText(p, n);
                break;
            case 13 /* HTML_ELEMENT */:
                updateHTMLElement(p, n, container, anchor, parent);
                break;
            case 17 /* STYLE */:
                updateStyleSheet(p, n);
                break;
            case 14 /* COMPONENT */:
                updateComponent(p, n);
                break;
            case 15 /* RENDER_COMPONENT */:
                updateRenderComponent(p, n, container, anchor, parent);
                break;
        }
    }
    function updateText(p, n) {
        var el = n.el = p.el;
        if (p.children !== n.children) {
            el.textContent = n.children;
        }
    }
    function updateHTMLElement(p, n, container, anchor, parent) {
        const el = n.el = p.el;
        processHook("beforeUpdate" /* BEFORE_UPDATE */, n, p);
        updateAttributes(el, p.props, n.props, parent);
        processHook("updated" /* UPDATED */, n, p);
        // updated hooks should be called here ? or after children update
        updateChildren(p.children, n.children, container, anchor, parent);
    }
    function updateChildren(pChildren, nChildren, container, anchor, parent) {
        var { p, n } = sortChildren(pChildren, nChildren, false);
        var max = Math.max(p.length, n.length);
        for (let i = 0; i < max; i++) {
            patch(p[i], n[i], container, getAnchor(p, i + 1), parent);
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

    const patch = (current, next, container, anchor, parent) => {
        if (!current) {
            if (next) {
                isArray(next) ? mountChildren(next, container, anchor, parent) : mount(next, container, anchor, parent);
            }
        }
        else {
            if (!next) {
                // 卸载当前节点
                isArray(current) ? unmountChildren(current) : unmount(current, container, anchor, parent);
            }
            else {
                if (isArray(current)) {
                    updateChildren(current, isArray(next) ? next : [next], container, anchor, parent);
                }
                else {
                    if (isArray(next)) {
                        updateChildren([current], next, container, anchor, parent);
                    }
                    else {
                        // 两个单节点 ， 但key可能不同 
                        if (current.type === next.type && current.patchKey === next.patchKey) {
                            // 类型相同，直接更新
                            update(current, next, container, anchor, parent);
                        }
                        else {
                            // 类型不同。先卸载，在挂载
                            unmount(current, container, anchor, parent);
                            mount(next, container, anchor, parent);
                        }
                    }
                }
            }
        }
    };

    const ReactiveTypeSymbol = Symbol('ReactiveType');
    // ref 或 reactive
    function isProxy(value) {
        return value && value[ReactiveTypeSymbol];
    }
    // 可被代理的类型 ， 响应式或只读
    function isProxyType(value) {
        switch (typeOf(value)) {
            case exports.ReactiveTypes.ARRAY:
            case exports.ReactiveTypes.OBJECT:
            case exports.ReactiveTypes.MAP:
            case exports.ReactiveTypes.SET:
            case exports.ReactiveTypes.WEAK_MAP:
            case exports.ReactiveTypes.WEAK_SET:
                return true;
            default:
                return false;
        }
    }
    function markRaw(data) {
        if (isProxyType(data)) {
            data[ReactiveTypeSymbol] = true;
        }
        return data;
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
    function toRaw(value) {
        return value && value["raw" /* RAW */];
    }
    function isReactive(value) {
        return value && value["isReactive" /* IS_REACTIVE */];
    }
    function isShallow(value) {
        return value && value["isShallow" /* IS_SHALLOW */];
    }
    function isRef(value) {
        return value && value["isRef" /* IS_REF */];
    }

    const TARGET_MAP = new WeakMap();
    function getDepsMap(target) {
        let depsMap = TARGET_MAP.get(target);
        if (!depsMap) {
            depsMap = new Map();
            TARGET_MAP.set(target, depsMap);
        }
        return depsMap;
    }
    function getDeps(target, key) {
        let depsMap = getDepsMap(target);
        let deps = depsMap.get(key);
        if (!deps) {
            deps = new Set();
            depsMap.set(key, deps);
        }
        return deps;
    }
    function track(target, key) {
        let activeEffect = getActiveEffect();
        if (!activeEffect)
            return;
        let deps = getDeps(target, key);
        deps.add(activeEffect);
        // 用于清除依赖
        activeEffect.deps.push(deps);
    }
    /* 特殊的target key ，当target任意key改变时，此依赖也会触发 */
    const trackTargetSymbol = Symbol('target has changed');
    function trigger(target, key) {
        if (key !== trackTargetSymbol) {
            // 防止递归
            trigger(target, trackTargetSymbol);
        }
        let deps = getDeps(target, key);
        // copy 防止死循环
        [...deps].forEach((dep) => {
            if (isEffect(dep)) {
                if (dep == getActiveEffect()) {
                    return;
                }
                dep.triggerRun();
            }
            else {
                dep();
            }
        });
    }
    const effectStack = [];
    const getActiveEffect = () => effectStack[effectStack.length - 1];
    const setActiveEffect = (effect) => effectStack.push(effect);
    const deleteActiveEffect = () => effectStack.pop();
    function isEffect(value) {
        return value && value["isEffect" /* IS_EFFECT */];
    }
    class ReactiveEffect {
        ["isEffect" /* IS_EFFECT */] = true;
        // 记录副作用依赖了那些变量
        deps = [];
        effectFn;
        scheduler;
        active = false;
        constructor(fn, scheduler) {
            this.effectFn = fn.bind(null);
            this.scheduler = scheduler;
        }
        run() {
            this.active = true;
            setActiveEffect(this);
            this.cleanDeps();
            const result = this.effectFn();
            deleteActiveEffect();
            return result;
        }
        triggerRun() {
            if (this.scheduler) {
                return this.scheduler(this.run.bind(this));
            }
            else {
                return this.run();
            }
        }
        cleanDeps() {
            this.deps.forEach((deps) => {
                deps.delete(this);
            });
            this.deps = [];
        }
    }
    function createReactiveEffect(fn, scheduler) {
        return new ReactiveEffect(fn, scheduler);
    }
    const effect = (fn, options = emptyObject) => {
        var effect = createReactiveEffect(fn, options.scheduler);
        if (!options.lazy) {
            effect.run();
        }
        return effect;
    };

    // global state
    let _isReadonly = false;
    let _isShallow = false;
    let _target;
    let _key;
    const getLastVisitTarget = () => _target;
    const getLastVisitKey = () => _key;
    let _lastSetTarget;
    let _lastSetKey;
    let _lastSetOldValue;
    let _lastSetNewValue;
    const getLastSetTarget = () => _lastSetTarget; // 获取上一个修改的目标
    const getLastSetKey = () => _lastSetKey; // 获取上一个修改的key
    const getLastSetOldValue = () => _lastSetOldValue; // 获取上一个修改前的旧值
    const getLastSetNewValue = () => _lastSetNewValue; // 获取上一个修改后的新值
    const collectionHandlers = {
        get size() {
            //  set , map  size 收集后 ， 只有目标的size变化后才会触发依赖
            debugger;
            return _target.size;
        },
        // set weakset
        add(value) {
            if (_isReadonly) {
                return warn(_target, 'is readonly , cant add');
            }
            var result = _target.add(value);
            debugger;
            // 返回set对象本身
            return result;
        },
        // map set
        clear() {
            if (_isReadonly) {
                return warn(_target, 'is readonly cant clear');
            }
            _target.clear();
            debugger;
        },
        // map weakmap set weakset
        delete(key) {
            if (_isReadonly) {
                return warn(_target, 'is readonly cant delete');
            }
            const result = _target.delete(key);
            if (result) { // 返回为 true 为删除成功
                trigger(_target, key);
            }
            return result;
        },
        // map set
        entries() {
            debugger;
            return _target.entries();
        },
        // map set
        forEach(fn) {
            debugger;
            return _target.forEach(fn);
        },
        // set map weakset weakmap
        has(key) {
            track(_target, key);
            return _target.has(key);
        },
        // map set
        keys() {
            debugger;
            return _target.keys();
        },
        // map set
        values() {
            debugger;
            return _target.values();
        },
        // map weakmap
        set(key, value) {
            if (_isReadonly) {
                return warn(_target, 'is readonly , cant set');
            }
            var result = _target.set(key, value);
            trigger(_target, key);
            return result;
        },
        // map weakmap
        get(key) {
            if (!_isReadonly) {
                track(_target, key);
            }
            var value = _target.get(key);
            return _isShallow ? value : reactive(value);
        }
    };
    function arrayHandlerWithTrack(...args) {
        if (!_isReadonly) { // 非只读才会收集
            debugger;
        }
        let result = _target[_key](...args);
        return result;
    }
    function arrayHandlerWithTrigger(...args) {
        if (_isReadonly) {
            return warn(`${_target}is readonly cant ${_key}`);
        }
        // 用数组修改前的key作为触发依赖
        let oldKeys = Object.keys(_target);
        let result = _target[_key](...args);
        [...oldKeys, 'length'].forEach((key) => trigger(_target, key));
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
    const specialKeyHandler = {
        [Symbol.iterator]: (value) => {
            // should track ?
            debugger;
            return value.bind(_target);
        }
    };
    // 可用于收集依赖的key
    const isProxyKey = (target, key) => !(key in target) || hasOwn(target, key);
    function createGetter(isReadonly, isShallow, isCollection) {
        return (target, key, receiver) => {
            // cache global state
            _isReadonly = isReadonly;
            _isShallow = isShallow;
            _target = target;
            _key = key;
            // reserved keys
            switch (key) {
                case "raw" /* RAW */:
                    return target;
                case "isReactive" /* IS_REACTIVE */:
                    return !isReadonly;
                case "isShallow" /* IS_SHALLOW */:
                    return isShallow;
                case "isReadonly" /* IS_READONLY */:
                    return isReadonly;
                case ReactiveTypeSymbol:
                    return true;
            }
            if (isCollection) {
                // collection methods reset
                if (hasOwn(collectionHandlers, key) && key in target) {
                    return collectionHandlers[key];
                }
            }
            else if (isProxyKey(target, key)) {
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
    const onSetCallbacks = new Set();
    // 注册一个回调函数，当响应式的值改变后触发回掉 => 参数 ： target，key ， newValue ， oldValue
    function onSet(cb) {
        onSetCallbacks.add(cb);
        return () => onSetCallbacks.delete(cb);
    }
    function createSetter(isReadonly = false, isShallow = false) {
        return (target, key, newValue, receiver) => {
            // 返回 false 时会报错
            if (isReadonly) {
                warn(`${target} is readonly`);
                return true;
            }
            if (isProxyKey(target, key)) {
                // 不允许设置非自身属性
                let oldValue = Reflect.get(target, key, receiver);
                _lastSetTarget = target;
                _lastSetKey = key;
                /* 当旧值是一个对象，但变成了基本类型后，则视为一次解绑 */
                _lastSetOldValue = oldValue;
                _lastSetNewValue = newValue;
                onSetCallbacks.forEach((cb) => cb(target, key, newValue, oldValue));
                Reflect.set(target, key, newValue, receiver);
                trigger(target, key);
            }
            return true;
        };
    }
    function has(target, key) {
        /*
            has 包括非自身的key
            ? in target
        */
        if (hasOwn(target, key)) {
            // has 的收集 ， 只有在key删除时才会触发 
            //! bug 使用 with 访问值时会先进入has 在进入get
            track(target, key);
        }
        return Reflect.has(target, key);
    }
    function ownKeys(target) {
        /*
            for ? in target
        */
        console.log('track ownKeys');
        return Reflect.ownKeys(target);
    }
    function deleteProperty(target, key) {
        // 为 true 表示删除成功
        const isOwn = hasOwn(target, key);
        const result = Reflect.deleteProperty(target, key);
        if (result && isOwn) {
            trigger(target, key);
        }
        return result;
    }
    function readonlyDeleteProperty(target, key) {
        warn(`${key} in `, target, ` can't delete`);
        return true;
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

    const createReactiveObject = (value) => new Proxy(value, reactiveHandler);
    const createReadonlyObject = (value) => new Proxy(value, readonlyHandler);
    const createShallowReactiveObject = (value) => new Proxy(value, shallowReactiveHandler);
    const createShallowReadonlyObject = (value) => new Proxy(value, shallowReadonlyHandler);
    const createReactiveCollection = (value) => new Proxy(value, reactiveCollectionHandler);
    const createReadonlyCollection = (value) => new Proxy(value, readonlyCollectionHandler);
    const createShallowReactiveCollection = (value) => new Proxy(value, shallowReactiveCollectionHandler);
    const createShallowReadonlyCollection = (value) => new Proxy(value, shallowReadonlyCollectionHandler);
    function createProxy(value, isReadonly, isShallow) {
        //! 如果 已经代理过，返回原始值
        if (isProxy(value)) {
            return value;
        }
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
    function shallowReactive(value) {
        return createProxy(value, false, true);
    }
    function readonly(value) {
        return createProxy(value, true, false);
    }
    function shallowReadonly(value) {
        return createProxy(value, true, true);
    }

    const ref = (value, options) => new Ref(value, options);
    const createRefValueSetter = (ref) => (newValue) => ref.value = newValue;
    class Ref {
        [ReactiveTypeSymbol] = true;
        ["isRef" /* IS_REF */] = true;
        oldValue; // 保存旧值
        _value;
        sensitive;
        constructor(value, options = emptyObject) {
            this.sensitive = options.sensitive;
            this._value = value;
        }
        get value() {
            // track
            trackRef(this);
            return this._value;
        }
        set value(newValue) {
            // 当 sensitive ，为true时 ， 当值试图从一个值变为另一个相同的值时，即使基本类型或引用类型全等，也会视为一次改变，触发依赖
            if (this._value === newValue && !this.sensitive) {
                return;
            }
            this.oldValue = this._value;
            this._value = newValue;
            // trigger
            triggerRef(this);
        }
    }
    const getRefDeps = (ref) => {
        var deps = TARGET_MAP.get(ref);
        if (!deps) {
            deps = new Set();
            TARGET_MAP.set(ref, deps);
        }
        return deps;
    };
    function trackRef(ref) {
        var activeEffect = getActiveEffect();
        if (!activeEffect) {
            return;
        }
        var deps = getRefDeps(ref);
        deps.add(activeEffect);
    }
    function triggerRef(ref) {
        var deps = getRefDeps(ref);
        deps.forEach((dep) => {
            if (isEffect(dep)) {
                dep.triggerRun();
            }
            else {
                dep();
            }
        });
    }
    // 清除所有与当前ref相关的依赖
    const cleaarRefDeps = (ref) => {
        getRefDeps(ref).clear();
    };

    const computed = (getter) => new ComputedRef(getter);
    class ComputedRef {
        [ReactiveTypeSymbol] = true;
        ["isComputed" /* IS_COMPUTED */] = true;
        ["isRef" /* IS_REF */] = true;
        cacheValue;
        oldValue;
        shouldCompute = true;
        computedEffect;
        constructor(getter) {
            this.computedEffect = createReactiveEffect(getter, () => {
                // 依赖的值变化后，触发调度器 , 一个computed依赖的副作用就是它所依赖的值的副作用
                if (!this.shouldCompute) { // 缓存值
                    this.shouldCompute = true;
                    triggerRef(this);
                }
            });
        }
        get computedValue() {
            this.shouldCompute = false;
            this.oldValue = this.cacheValue;
            return this.cacheValue = this.computedEffect.run();
        }
        get value() {
            trackRef(this);
            return this.shouldCompute ? this.computedValue : this.cacheValue;
        }
    }

    /*
        通问题
        当改变被侦测的数据时，会去执行数据的依赖，但如果依赖中不止有watch注册的回调，还有其他的依赖，并且依赖触发后，依赖中又更改了其他响应式数据的值，这时通过
        获取最近值来传递 watch 的参数不可靠
    */
    //! 回调中能拿到的数据有 改变的key ，改变的新值 ， 改变前的值
    function shallowWatchReactive(data, callback) {
        if (!isReactive(data)) {
            return;
        }
        // 问题？ 新设置的key无法触发依赖，因为没收集
        const rawData = toRaw(data);
        var watchCallbackIsCalling = false, changeKey, changeNewValue, changeOldValue;
        let cb = () => {
            watchCallbackIsCalling = true;
            callback.call(null, changeKey, changeNewValue, changeOldValue);
            watchCallbackIsCalling = false;
        };
        let unSet = onSet((target, key, newValue, oldValue) => {
            if (target === rawData) {
                if (watchCallbackIsCalling) {
                    // callback 中重新设置值会触发死递归
                    error('cant set reactive data value in the watch callback');
                }
                else {
                    // 设置的值是watchdata中的值，并且不是在回调函数中
                    changeKey = key;
                    changeNewValue = newValue;
                    changeOldValue = oldValue;
                }
            }
        });
        const deps = getDeps(rawData, trackTargetSymbol);
        deps.add(cb);
        // unwatch
        return () => {
            unSet();
            deps.delete(cb);
        };
    }
    function watchReactive(reactiveData, callback) {
        if (!isReactive(reactiveData)) {
            return;
        }
        // 问题需要记录子数据脱离绑定的情况
        // 保存当前 watch 的data中存在的所有 target 
        // ! 当侦测一个reactive data时，回调中不应该再设置该属性的值否则会死循环
        const targets = new Set();
        collectTarget(reactiveData);
        function collectTarget(data) {
            if (!isReactive(data)) {
                return;
            }
            targets.add(toRaw(data));
            Object.values(data).forEach(collectTarget);
        }
        // watch的回调函数是否正在调用
        var watchCallbackIsCalling = false, changeTarget, changeKey, changeNewValue, changeOldValue;
        let cb = () => {
            watchCallbackIsCalling = true;
            callback.call(null, changeTarget, changeKey, changeNewValue, changeOldValue);
            watchCallbackIsCalling = false;
        };
        targets.forEach((target) => {
            let deps = getDeps(target, trackTargetSymbol);
            deps.add(cb);
        });
        const unSet = onSet((target, key, newValue, oldValue) => {
            if (targets.has(target)) {
                if (watchCallbackIsCalling) {
                    // callback 中重新设置值会触发死递归
                    error('cant set reactive data value in the watch callback');
                }
                else {
                    // 设置的值是watchdata中的值，并且不是在回调函数中
                    changeTarget = target;
                    changeKey = key;
                    changeNewValue = newValue;
                    changeOldValue = oldValue;
                }
            }
            if (!targets.has(oldValue)) { // 当前更改的值与侦测目标无任何关系
                return;
            }
            // 解绑
            let oldValueDeps = getDeps(oldValue, trackTargetSymbol);
            oldValueDeps.delete(cb);
            targets.delete(oldValue);
            // 增加新绑定值的依赖
            if (targets.has(newValue)) {
                // 此时是将观察对象中的值重新赋值给该对象的身上，不需要添加依赖
                return;
            }
            if (isProxyType(newValue)) {
                let newValueDeps = getDeps(newValue, trackTargetSymbol);
                newValueDeps.add(cb);
                targets.add(newValue);
            }
        });
        // unwatch
        return () => {
            unSet();
            targets.forEach((target) => {
                let deps = getDeps(target, trackTargetSymbol);
                deps.delete(cb);
            });
        };
    }
    // 指定侦测的目标和key值
    function watchTargetKey(target, key, callback) {
        if (!isReactive(target)) {
            return;
        }
        const deps = getDeps(target, key);
        var watchCallbackIsCalling = false, changeNewValue, changeOldValue;
        let cb = () => {
            watchCallbackIsCalling = true;
            callback.call(null, changeNewValue, changeOldValue);
            watchCallbackIsCalling = false;
        };
        const unSet = onSet((_target, _key, newValue, oldValue) => {
            if (_target === target && _key === key) { // 侦听目标的对应key触发了
                if (watchCallbackIsCalling) {
                    // callback 中重新设置值会触发死递归
                    error('cant set reactive data value in the watch callback');
                }
                else {
                    // 设置的值是watchdata中的值，并且不是在回调函数中
                    changeNewValue = newValue;
                    changeOldValue = oldValue;
                }
            }
        });
        deps.add(cb);
        // unwatch
        return () => {
            unSet();
            deps.delete(cb);
        };
    }

    function watchRef(ref, callback) {
        const deps = getRefDeps(ref);
        const watchEffect = () => callback.call(null, ref.value, ref.oldValue);
        deps.add(watchEffect);
        // unwatch
        return () => deps.delete(watchEffect);
    }

    var nextTick = (fn, args = undefined) => {
        var p = Promise.resolve(args);
        p.then(fn.bind(null));
    };
    var queueJobs = new Set();
    function queueJob(job) {
        queueJobs.add(job);
        nextTick(executeQueueJobs);
    }
    function executeQueueJobs() {
        queueJobs.forEach((job) => {
            job();
            queueJobs.delete(job);
        });
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
    function getCurrentRenderScope() {
        return getCurrentInstance().renderScope;
    }
    function setScopeData(scope, data) {
        if (!isObject(data)) {
            return;
        }
        for (let key in data) {
            // data 存在时应该警告
            scope[key] = data[key];
        }
    }
    function mountComponent(vnode, container, anchor, parent) {
        const { type, props, children } = vnode;
        const instance = createComponentInstance(type, parent);
        const { scope, renderScope } = instance;
        callHook("beforeCreate" /* BEFORE_CREATE */, instance, { binding: scope }, scope);
        vnode.instance = instance;
        instance.componentVnode = vnode;
        setCurrentInstance(instance);
        // 初次创建前应该把 slot props 方法等挂载到作用域上
        // 先挂载props ，这样 create hook中才能访问
        mountComponentProps(instance, props);
        instance.slots = children;
        // 处理mixins中的create钩子 ，rootCreate后处理 ，优先级更高 , 在处理props后处理，保证钩子中能访问到props等数据
        const createResults = callHook("create" /* CREATE */, instance, { binding: scope }, scope);
        // 注入 mixins 状态
        createResults?.forEach((data) => setScopeData(scope, data));
        // 组件根初始化方法
        /*
            render 优先级
            create 返回的渲染函数  > render > template , 暂时不支持无状态组件
        */
        let render;
        if (instance.render) {
            render = instance.render.bind(renderScope);
        }
        else if (instance.createRender) {
            render = instance.createRender(renderMethods);
        }
        else {
            render = emptyFunction;
        }
        instance.render = render;
        setCurrentInstance(null);
        processHook("created" /* CREATED */, vnode);
        // component update
        // component update fn
        function update() {
            const { isMounted, vnode: pVnode, beforePatch, componentVnode, updatingComponentVnode, render } = instance;
            // 每次 更新生成新树
            setCurrentInstance(instance);
            let nVnode = render(scope);
            setCurrentInstance(null);
            // 处理树
            let pComponentVnode, nComponentVnode;
            if (updatingComponentVnode) { // 非自更新，两个节点对比更新
                nComponentVnode = updatingComponentVnode;
                pComponentVnode = componentVnode;
                // 把新节点存到实例上
                instance.componentVnode = nComponentVnode;
            }
            else {
                nComponentVnode = componentVnode;
            }
            // 清理vnode 
            instance.updatingComponentVnode = null;
            nVnode = processRenderResult(nVnode);
            instance.renderingVnode = nVnode;
            processHook(isMounted ? "beforeUpdate" /* BEFORE_UPDATE */ : "beforeMount" /* BEFORE_MOUNT */, nComponentVnode, pComponentVnode);
            if (beforePatch) {
                beforePatch(pVnode, nVnode);
            }
            patch(pVnode, nVnode, container, anchor, instance);
            instance.vnode = nVnode;
            instance.isMounted = true;
            processHook(isMounted ? "updated" /* UPDATED */ : "mounted" /* MOUNTED */, nComponentVnode, pComponentVnode);
        }
        //  call at every update
        instance.update = update;
        const rednerEffect = createReactiveEffect(update, queueJob);
        // 手动渲染
        rednerEffect.run();
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

    function customDisplay() {
    }
    function display(data) {
        if (isObject(data) || isArray(data)) {
            return JSON.stringify(data);
        }
        return data;
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

    /*
        examples
        x ... scope.x
        { x : x } => { x : scope.x }
    */
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
    var textEndsWithTag = /([\s\S]*?)<(\/?)[\w-]+/;
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
        NodesMap[NodesMap["slot"] = 35] = "slot";
        NodesMap[NodesMap["outlet"] = 36] = "outlet";
        NodesMap[NodesMap["..."] = 30] = "...";
        NodesMap[NodesMap["@"] = 21] = "@";
        NodesMap[NodesMap["--"] = 32] = "--";
        NodesMap[NodesMap["media"] = 22] = "media";
        NodesMap[NodesMap["keyframes"] = 24] = "keyframes";
        NodesMap[NodesMap["supports"] = 23] = "supports";
        NodesMap[NodesMap["style"] = 17] = "style";
        NodesMap[NodesMap["class"] = 18] = "class";
        NodesMap[NodesMap["template"] = 2] = "template";
        NodesMap[NodesMap["element"] = 11] = "element";
        NodesMap[NodesMap["component"] = 16] = "component";
        NodesMap[NodesMap["model"] = 37] = "model";
    })(exports.NodesMap || (exports.NodesMap = {}));
    function keyOf(nodeType) {
        return exports.NodesMap[nodeType];
    }

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

    const extIteratorExp = /(?:[\{\[\(]?)([\w,]+)(?:[\}\]\)]?)\s*(?:in|of)\s*(.+)/;
    function parseIterator(expression) {
        const [_, items, iterable] = extIteratorExp.exec(expression);
        return {
            iterable,
            items: items.split(',')
        };
    }

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
            else if (scanner.startsWith(keyOf(21 /* AT */))) {
                /*
                    media conditions
                */
                var [key, content] = scanner.exec(AtRuleRE);
                var type = exports.NodesMap[key];
                current = {
                    type
                };
                if (type === 22 /* MEDIA_RULE */) {
                    current.media = content;
                }
                else if (type === 24 /* KEYFRAMES_RULE */) {
                    current.keyframes = content;
                }
                else if (type === 23 /* SUPPORTS_RULE */) {
                    current.supports = content;
                }
            }
            else if (scanner.expect('/*')) ;
            else if (scanner.startsWith(keyOf(30 /* MIXIN */))) {
                var [mixin] = scanner.exec(mixinRE);
                var m = {
                    type: 30 /* MIXIN */,
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
                    case 6 /* FOR */:
                        d.iterator = parseIterator(content);
                        break;
                    case 3 /* IF */:
                        d.condition = content;
                        d.isBranchStart = true;
                        break;
                    case 4 /* ELSE_IF */:
                        d.condition = content;
                        d.isBranch = true;
                        break;
                    case 5 /* ELSE */:
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
                    type: 26 /* STYLE_RULE */,
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
                    type: 29 /* DECLARATION */
                });
                continue;
            }
            else {
                /* error */
                debugger;
            }
            /* process the relation , with cascading struct */
            if (declarationGroup) {
                var asb = { type: 28 /* DECLARATION_GROUP */ };
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
                case 26 /* STYLE_RULE */:
                    const { selector, parent } = rule;
                    if (isKeyframe) {
                        rule.type = 27 /* KEYFRAME_RULE */;
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
                case 3 /* IF */:
                case 4 /* ELSE_IF */:
                case 5 /* ELSE */:
                case 6 /* FOR */:
                case 22 /* MEDIA_RULE */:
                case 23 /* SUPPORTS_RULE */:
                    rule.selectors = rule.parent?.selectors;
                    break;
                case 24 /* KEYFRAMES_RULE */:
                    isKeyframe = true;
                    break;
            }
            if (rule.children) {
                processRules(rule.children, isKeyframe);
            }
        });
    };

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
    const builtInTags = {
        ''(ast) {
            ast.type = 12 /* TEXT */;
            ast.children = parseText(ast.children);
            ast.ignoreChildren = true;
        },
        '!'(ast) {
            ast.type = 10 /* HTML_COMMENT */;
            ast.ignoreChildren = true;
        },
        if(ast) {
            ast.type = 3 /* IF */;
            ast.condition = ast.attributeMap['condition'].value;
            ast.isBranchStart = true;
        },
        elseIf(ast) {
            ast.type = 4 /* ELSE_IF */;
            ast.condition = ast.attributeMap['condition'].value;
            ast.isBranch = true;
        },
        else(ast) {
            ast.type = 5 /* ELSE */;
            ast.isBranch = true;
        },
        for(ast) {
            ast.type = 6 /* FOR */;
            ast.iterator = parseIterator(ast.attributeMap['iterator'].value);
        },
        template(ast) {
            ast.type = 2 /* TEMPLATE */;
        },
        // ! 新策略 slot 标签用于使用插槽 ， slot指令用于定义插槽
        slot(ast) {
            ast.type = 35 /* SLOT */;
            // 插槽名称支持动态， 作用域不支持动态
            // ! slot need : slotName , isDynamicSlot 
            ast.type = 35 /* SLOT */;
            const attr = ast.attributeMap;
            if (attr?.name) {
                attr.name.type = 39 /* SKIP */;
                ast.slotName = attr.name.value;
                ast.isDynamicSlot = attr.name.isDynamicValue;
            }
            else {
                ast.slotName = 'default';
            }
        },
        component(ast) {
            ast.type = 16 /* DYNAMIC_COMPONENT */;
            const is = ast.attributeMap.is;
            const { isDynamicValue, value } = is;
            ast.is = value;
            ast.isDynamicIs = isDynamicValue;
            is.type = 39 /* SKIP */;
        },
        element(ast) {
            ast.type = 11 /* DYNAMIC_ELEMENT */;
            const is = ast.attributeMap.is;
            const { isDynamicValue, value } = is;
            ast.is = value;
            ast.isDynamicIs = isDynamicValue;
            is.type = 39 /* SKIP */;
        },
        style(ast) {
            ast.type = 17 /* STYLE */;
            var template = ast.children?.[0].children;
            if (template) {
                var styleAst = parseCSS(template);
                processRules(styleAst);
                ast.children = styleAst;
            }
            ast.ignoreChildren = true;
        }
    };
    // 新策略指令作为props一部分
    const builtInDirectives = {
        if(attr, ast) {
            attr.type = 3 /* IF */;
            const directives = ast.directives;
            if (!directives.length) { // 为元素的第一个指令
                ast.condition = attr.value;
                ast.isBranchStart = true;
            }
            else {
                directives.push(attr);
            }
        },
        elseIf(attr, ast) {
            attr.type = 4 /* ELSE_IF */;
            if (!ast.directives.length) {
                ast.isBranch = true;
                ast.condition = attr.value;
            }
        },
        else(attr, ast) {
            attr.type = 5 /* ELSE */;
            ast.isBranch = true;
        },
        for(attr, ast) {
            attr.type = 6 /* FOR */;
            attr.iterator = parseIterator(attr.value);
            ast.directives.push(attr);
        },
        text(attr, ast) {
            attr.type = 7 /* ATTRIBUTE */;
            attr.property = 'innerText';
            attr.isDynamicValue = true;
            ast.children = null; // 直接忽略
        },
        html(attr, ast) {
            attr.type = 7 /* ATTRIBUTE */;
            attr.property = 'innerHTML';
            attr.isDynamicValue = true;
            ast.children = null; // 直接忽略
        },
        slot(attr, ast) {
            // ! slot 指令用于定义插槽 ， 可用于单个元素和 template （fragment）, 需要定义 slotName 
            /*
                注意当插槽指令作用于插槽标签时，代表当前定义插槽为上一个插槽传递的内容
            */
            attr.type = 39 /* SKIP */;
            // 定义插槽无动态插槽 , 第一个参数为slot的名称
            ast.defineSlotName = attr?._arguments?.[0];
            ast.slotScope = attr.value;
        },
        model(attr, ast) {
            // 是否需要支持动态的 input type 类型 , 如果需要支持动态 ，就需要在指令中判断类型 , 暂不支持
            attr.type = 34 /* CUSTOM_DIRECTIVE */;
            const modelValue = attr.value;
            // change model value
            ast.attributes.push({
                type: 7 /* ATTRIBUTE */,
                property: '_changeModelValue',
                value: toArrowFunction(`${modelValue} = _`, '_'),
                isDynamicValue: true,
            });
            switch (ast?.attributeMap?.type?.value || 'text') {
                case 'text':
                    attr.property = 'modelText';
                    break;
                case 'color':
                    attr.property = 'modelColor';
                    break;
            }
            ast.customDirectives.push(attr);
        }
    };
    const builtInAttributes = {
        style(attr, ast) {
            attr.type = 17 /* STYLE */;
            // attr.value = attr.isDynamicValue ? attr.value : parseInlineStyle(attr.value)
        },
        class(attr, ast) {
            attr.type = 18 /* CLASS */;
            // attr.value = attr.isDynamicValue ? attr.value : parseInlineClass(attr.value)
        }
    };
    const builtInEvents = {
        hook(attr, ast) {
            attr.type = 39 /* SKIP */;
            const hooks = attr._arguments;
            hooks.forEach((hook) => {
                ast.attributes.push({
                    property: '_' + hook,
                    value: attr.value,
                    isDynamicProperty: false,
                    isDynamicValue: true
                });
            });
        }
    };
    function processAttribute(ast) {
        var attributes = ast.attributes;
        if (!attributes)
            return;
        for (let i = 0; i < attributes.length; i++) {
            var attribute = attributes[i];
            var { flag, isDynamicProperty } = attribute;
            if (flag === '@') {
                // event
                attribute.type = 25 /* EVENT */;
                attribute.isHandler = isHandler(attribute.value);
                if (!isDynamicProperty && builtInEvents[attribute.property]) {
                    // 保留事件
                    builtInEvents[attribute.property](attribute, ast);
                }
            }
            else if (flag === '--') {
                const dirHandler = builtInDirectives[attribute.property];
                const isCustomDirective = isDynamicProperty || !dirHandler;
                if (isCustomDirective) {
                    // 自定义指令不会作为props的一部分
                    attribute.type = 34 /* CUSTOM_DIRECTIVE */;
                    (ast.customDirectives ||= []).push(attribute);
                }
                else {
                    ast.directives ||= [];
                    ast.customDirectives ||= [];
                    dirHandler(attribute, ast);
                }
            }
            else if (flag === '#') {
                // id shorthand
                attribute.type = 7 /* ATTRIBUTE */;
                attribute.value = attribute.property;
                attribute.property = 'id';
                attribute.isDynamicValue = attribute.isDynamicProperty;
                attribute.isDynamicProperty = false;
            }
            else if (flag === '.') {
                // class shourthand
                attribute.type = 18 /* CLASS */;
                attribute.value = attribute.property;
                attribute.property = 'class';
                attribute.isDynamicValue = attribute.isDynamicProperty;
                attribute.isDynamicProperty = false;
            }
            else {
                // normal property
                const attrHandler = builtInAttributes[attribute.property];
                if (!attrHandler || attribute.isDynamicProperty) {
                    attribute.type = 7 /* ATTRIBUTE */;
                }
                else {
                    attrHandler(attribute, ast);
                }
            }
        }
    }
    function processAst(ast) {
        if (isArray(ast)) {
            ast.forEach(processAst);
            return;
        }
        const tag = ast.tag;
        const tagName = camelize(tag);
        ast.tagName = tagName;
        processAttribute(ast);
        if (builtInTags[tagName]) {
            builtInTags[tagName](ast);
        }
        else if (isHTMLTag(tagName)) {
            ast.type = 13 /* HTML_ELEMENT */;
        }
        else if (isSVGTag(tagName)) {
            ast.type = 9 /* SVG_ELEMENT */;
        }
        else {
            ast.type = 14 /* COMPONENT */;
        }
        if (!ast.ignoreChildren && ast.children) {
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
        withEventModifiers: '',
        toNativeEventName: '',
        normalizeClass: '',
        normalizeStyle: '',
        renderSlot: '',
        injectDirective: '',
        injectDirectives: '',
        injectReservedProps: '',
        createMap: '',
        getCurrentRenderScope: ''
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
                case 3 /* IF */:
                    target = genIf(target, dir.condition);
                    break;
                case 6 /* FOR */:
                    target = genForWithFragment(target, dir.iterator, context);
                    break;
            }
            return genDirectives(target, dirs, context);
        }
    };
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
    function genCustomDirectives(code, directives, context) {
        var dirs = directives.map((directive) => {
            var { property, value, isDynamicProperty, _arguments, modifiers } = directive;
            var directive = context.callRenderFn(renderMethodsNameMap.getDirective, isDynamicProperty ? property : toSingleQuotes(property));
            if (!isDynamicProperty) {
                directive = context.hoistExpression(directive);
            }
            return [
                directive,
                value,
                _arguments && _arguments.map(toSingleQuotes),
                modifiers && modifiers.map(toSingleQuotes)
            ];
        });
        return context.callRenderFn(renderMethodsNameMap.injectDirectives, code, stringify(dirs));
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
            var { defineSlotName, slotScope } = child;
            if (defineSlotName) {
                slots[defineSlotName] = toArrowFunction(genNode(child, context), slotScope);
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
            case 10 /* HTML_COMMENT */:
                return context.callRenderFn(renderMethodsNameMap.createComment, toBackQuotes(node.children), uid());
            case 3 /* IF */:
            case 4 /* ELSE_IF */:
            case 5 /* ELSE */:
                return genNodes(node.children, context);
            case 6 /* FOR */:
                // use the fragment , cause the iterator will set the u key in each node , 
                return genForWithFragment(genNodes(node.children, context), node.iterator, context);
            case 2 /* TEMPLATE */:
                var code = genNodes(node.children, context);
                if (node.dirs) {
                    code = genDirectives(code, node.dirs, context);
                }
                return code;
            case 35 /* SLOT */:
                const { slotName, isDynamicSlot, children } = node;
                return context.callRenderFn(renderMethodsNameMap.renderSlot, isDynamicSlot ? slotName : toBackQuotes(slotName), genProps(node, context), children ? toArrowFunction(genNodes(children, context)) : NULL, uid());
            case 36 /* OUTLET */:
                return genNodes(node.children, context);
            case 11 /* DYNAMIC_ELEMENT */:
                var { is, isDynamicIs } = node;
                var code = context.callRenderFn(renderMethodsNameMap.createElement, isDynamicIs ? is : toSingleQuotes(is), genProps(node, context), // 正常生成props
                genChildrenString(node.children, context), uStringId());
                code = genDirs(code, node, context);
                return code;
            case 13 /* HTML_ELEMENT */:
                var code = context.callRenderFn(renderMethodsNameMap.createElement, toBackQuotes(node.tagName), genProps(node, context), genChildrenString(node.children, context), uStringId());
                code = genDirs(code, node, context);
                return code;
            case 9 /* SVG_ELEMENT */:
                var code = context.callRenderFn(renderMethodsNameMap.createSVGElement, toBackQuotes(node.tagName), genProps(node, context), genChildrenString(node.children, context), uStringId());
                code = genDirs(code, node, context);
                return code;
            case 16 /* DYNAMIC_COMPONENT */:
                var { is, isDynamicIs } = node;
                var component = context.callRenderFn(renderMethodsNameMap.getComponent, isDynamicIs ? is : toSingleQuotes(is));
                // 动态组件不会提升
                var props = genProps(node, context);
                var slots = genSlotContent(node, context);
                code = context.callRenderFn(renderMethodsNameMap.createComponent, component, props, slots, uStringId());
                code = genDirs(code, node, context);
                return code;
            case 14 /* COMPONENT */:
                var code = context.callRenderFn(renderMethodsNameMap.getComponent, toBackQuotes(node.tagName));
                var uv = context.hoistExpression(code);
                var props = genProps(node, context);
                var slots = genSlotContent(node, context);
                code = context.callRenderFn(renderMethodsNameMap.createComponent, uv, props, slots, uStringId());
                code = genDirs(code, node, context);
                return code;
            case 12 /* TEXT */:
                return genText(node.children, context);
            case 17 /* STYLE */:
                var props = genProps(node, context);
                var code = context.callRenderFn(renderMethodsNameMap.createStyleSheet, props, stringify(genChildren(node.children, context)), uStringId());
                code = genDirs(code, node, context);
                return code;
            case 26 /* STYLE_RULE */:
                return context.callRenderFn(renderMethodsNameMap.createStyle, genSelector(node.selectors, context), stringify(genChildren(node.children, context)), uStringId());
            case 22 /* MEDIA_RULE */:
                const rules = stringify(genChildren(node.children, context));
                return context.callRenderFn(renderMethodsNameMap.createMedia, toBackQuotes(node.media), rules, uStringId());
            case 24 /* KEYFRAMES_RULE */:
                return context.callRenderFn(renderMethodsNameMap.createKeyframes, toBackQuotes(node.keyframes), stringify(genChildren(node.children, context)), uStringId());
            case 27 /* KEYFRAME_RULE */:
                return context.callRenderFn(renderMethodsNameMap.createKeyframe, toBackQuotes(node.selector.selectorText), stringify(genChildren(node.children, context)), uStringId());
            case 23 /* SUPPORTS_RULE */:
                return context.callRenderFn(renderMethodsNameMap.createSupports, toBackQuotes(node.supports), stringify(genChildren(node.children, context)), uStringId());
            case 28 /* DECLARATION_GROUP */:
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
            if (declaration.type === 30 /* MIXIN */) {
                res.push(declaration.mixin);
                lastIsDeclaration = false;
            }
            else if (declaration.type === 29 /* DECLARATION */) {
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
        const { type, attributes } = node;
        const isComponent = type === 14 /* COMPONENT */;
        if (!attributes) {
            return NULL;
        }
        var props = {};
        attributes.forEach((attr) => {
            switch (attr.type) {
                case 25 /* EVENT */:
                    var { property, isDynamicProperty, value, isHandler, /* if true , just use it , or wrap an arrow function */ _arguments, modifiers } = attr;
                    value ||= property; // 简写形似
                    const handlerKey = isDynamicProperty ?
                        (isComponent ?
                            dynamicMapKey(context.callRenderFn(renderMethodsNameMap.toEventName, property, stringify(_arguments.map(toBackQuotes)), stringify(modifiers.map(toBackQuotes)))) :
                            dynamicMapKey(context.callRenderFn(renderMethodsNameMap.toNativeEventName, property, stringify(_arguments.map(toBackQuotes))))) :
                        (isComponent ?
                            toEventName(property, _arguments, modifiers) :
                            toNativeEventName(property, _arguments));
                    var callback = isHandler ? value : toArrowFunction(value);
                    if (modifiers && !isComponent) {
                        callback = context.callRenderFn(renderMethodsNameMap.withEventModifiers, callback, stringify(modifiers.map(toBackQuotes)));
                    }
                    props[handlerKey] = callback;
                    break;
                case 18 /* CLASS */:
                    var _class = props.class ||= [];
                    _class.push(attr.isDynamicValue ? attr.value : toBackQuotes(attr.value));
                    break;
                case 17 /* STYLE */:
                    var style = props.style ||= [];
                    style.push(attr.isDynamicValue ? attr.value : toBackQuotes(attr.value));
                    break;
                case 7 /* ATTRIBUTE */:
                    // normal attributes
                    var { property, value, isDynamicProperty, isDynamicValue, } = attr;
                    value ||= property; // 简写形式
                    props[isDynamicProperty ? dynamicMapKey(property) : property] = isDynamicValue ? value : toBackQuotes(value);
                    break;
            }
        });
        // merge class , there could be more than one class , 不应该在render函数中使用normalize
        if (props.class) {
            props.class = stringify(props.class);
        }
        if (props.style) {
            props.style = stringify(props.style);
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
        var SCOPE = context.hoistExpression(context.callRenderFn(renderMethodsNameMap.getCurrentRenderScope));
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
        else {
            return emptyObject;
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

    function renderSlot(name, scope, fallback, key) {
        const instance = getCurrentInstance();
        let slot = instance?.slots?.[name] || fallback;
        if (!slot) {
            return null;
        }
        else {
            slot = slot(scope);
        }
        // 这里返回的一定是单一节点（fragment），不会是数组形式
        slot.key = key; // 唯一插槽节点的key
        return slot;
    }

    var renderMethods = {
        getCurrentRenderScope,
        createComment,
        createSVGElement,
        injectDirectives,
        important,
        getCurrentScope,
        createElement,
        createText,
        renderList,
        createFragment,
        display,
        getDirective,
        getComponent,
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
        renderSlot,
        createMap
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
    // color gradient
    function conicGradient() {
    }
    function linearGradient() {
    }
    function radialGradient() {
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
    /*
        comment : ! 66666
    */
    function h(type, props, children, key = uid()) {
        if (isObject(type)) {
            // state component
            if (children && !isObject(children)) {
                children = {
                    default: children
                };
            }
            return createComponent(type, props, children, key);
        }
        else if (isHTMLTag(type)) {
            return createElement(type, props, children, key);
        }
        else if (isSVGTag(type)) {
            return createSVGElement(type, props, children, key);
        }
    }

    // 指定一个动画keyframes，在执行后自动移除，不影响元素本身属性 
    function doCSSAnimation(el, options, endCb, cancelCb) {
        const { name, duration, timingFunction, delay, playState, fillMode, iterationCount, direction } = options;
        const animationDeclaration = {
            animationName: name,
            animationDuration: isNumber(Number(duration)) ? duration + 'ms' : duration,
            animationTimingFunction: timingFunction,
            animationDelay: isNumber(Number(delay)) ? delay + 'ms' : delay,
            animationPlayState: playState,
            animationFillMode: fillMode,
            animationIterationCount: iterationCount,
            animationDirection: direction
        };
        let _name = getElementComputedStyleValue(el, 'animationName');
        if (_name && _name !== 'none') {
            // ! 注意执行时不应该存在元素本身或从继承来的animation属性
            return;
        }
        // 动画执行结束后再还原属性
        let copy = getElementStyle(el, animationDeclaration);
        setElementStyleDeclaration(el, animationDeclaration);
        let handler = () => {
            // 重新设置之前的属性
            setElementStyleDeclaration(el, copy);
            if (endCb) {
                endCb(el);
            }
        };
        onceListener(el, 'animationend', handler);
        let cancelled = false;
        // stop animation , 只有动画成功执行才会返回取消方法
        return () => {
            if (cancelled) {
                return;
            }
            setElementStyleDeclaration(el, copy);
            removeListener(el, 'animationend', handler); // 手动移除侦听器
            if (cancelCb) {
                cancelCb(el);
            }
            cancelled = true;
        };
    }

    const slideInDown = [keyframe('from', {
            transform: translate3d(0, '-100%', 0),
            visibility: 'visible'
        }),
        keyframe('to', {
            transform: translate3d(0, 0, 0)
        })];
    const slideInUp = [keyframe('from', {
            transform: translate3d(0, '100%', 0),
            visibility: 'visible'
        }),
        keyframe('to', {
            transform: translate3d(0, 0, 0)
        })];
    const slideInLeft = [keyframe('from', {
            transform: translate3d('-100%', 0, 0),
            visibility: 'visible'
        }),
        keyframe('to', {
            transform: translate3d(0, 0, 0)
        })];
    const slideInRight = [keyframe('from', {
            transform: translate3d('100%', 0, 0),
            visibility: 'visible'
        }),
        keyframe('to', {
            transform: translate3d(0, 0, 0)
        })];
    const slideOutDown = [keyframe('from', {
            transform: translate3d(0, 0, 0)
        }),
        keyframe('to', {
            transform: translate3d(0, '100%', 0),
            visibility: 'hidden'
        })];
    const slideOutUp = [keyframe('from', {
            transform: translate3d(0, 0, 0)
        }),
        keyframe('to', {
            transform: translate3d(0, '-100%', 0),
            visibility: 'hidden'
        })];
    const slideOutLeft = [keyframe('from', {
            transform: translate3d(0, 0, 0)
        }),
        keyframe('to', {
            transform: translate3d('-100%', 0, 0),
            visibility: 'hidden'
        })];
    const slideOutRight = [keyframe('from', {
            transform: translate3d(0, 0, 0)
        }),
        keyframe('to', {
            transform: translate3d('100%', 0, 0),
            visibility: 'hidden'
        })];

    const zoomIn = [keyframe('from', {
            transform: scale3d(0.3, 0.3, 0.3),
            opacity: 0
        }), keyframe(50, {
            opacity: 1
        })];
    const zoomInDown = [keyframe('from', {
            opacity: 0,
            transform: [scale3d(0.1, 0.1, 0.1), translate3d(0, '-1000px', 0)],
            animationTimingFunction: cubicBezier(0.55, 0.055, 0.675, 0.19)
        }), keyframe(60, {
            opacity: 1,
            transform: [scale3d(0.475, 0.475, 0.475), translate3d(0, '60px', 0)],
            animationTimingFunction: cubicBezier(0.175, 0.885, 0.32, 1)
        })];
    const zoomInUp = [keyframe('from', {
            opacity: 0,
            transform: [scale3d(0.1, 0.1, 0.1), translate3d(0, '1000px', 0)],
            animationTimingFunction: cubicBezier(0.55, 0.055, 0.675, 0.19)
        }), keyframe(60, {
            opacity: 1,
            transform: [scale3d(0.475, 0.475, 0.475), translate3d(0, '-60px', 0)],
            animationTimingFunction: cubicBezier(0.175, 0.885, 0.32, 1)
        })];
    const zoomInLeft = [keyframe('from', {
            opacity: 0,
            transform: [scale3d(0.1, 0.1, 0.1), translate3d('-1000px', 0, 0)],
            animationTimingFunction: cubicBezier(0.55, 0.055, 0.675, 0.19)
        }), keyframe(60, {
            opacity: 1,
            transform: [scale3d(0.475, 0.475, 0.475), translate3d('10px', 0, 0)],
            animationTimingFunction: cubicBezier(0.175, 0.885, 0.32, 1)
        })];
    const zoomInRight = [keyframe('from', {
            opacity: 0,
            transform: [scale3d(0.1, 0.1, 0.1), translate3d('1000px', 0, 0)],
            animationTimingFunction: cubicBezier(0.55, 0.055, 0.675, 0.19)
        }), keyframe(60, {
            opacity: 1,
            transform: [scale3d(0.475, 0.475, 0.475), translate3d('-10px', 0, 0)],
            animationTimingFunction: cubicBezier(0.175, 0.885, 0.32, 1)
        })];
    const zoomOut = [keyframe('from', {
            opacity: 1
        }), keyframe(40, {
            opacity: 0,
            transform: scale3d(0.3, 0.3, 0.3)
        }), keyframe('to', {
            opacity: 0
        })];
    const zoomOutDown = [keyframe(40, {
            opacity: 1,
            transform: [scale3d(0.475, 0.475, 0.475), translate3d(0, '-60px', 0)],
            animationTimingFunction: cubicBezier(0.55, 0.055, 0.675, 0.19)
        }), keyframe('to', {
            opacity: 0,
            transform: [scale3d(0.1, 0.1, 0.1), translate3d(0, '2000px', 0)],
            animationTimingFunction: cubicBezier(0.175, 0.885, 0.32, 1)
        })];
    const zoomOutUp = [keyframe(40, {
            opacity: 1,
            transform: [scale3d(0.475, 0.475, 0.475), translate3d(0, '60px', 0)],
            animationTimingFunction: cubicBezier(0.55, 0.055, 0.675, 0.19)
        }), keyframe('to', {
            opacity: 0,
            transform: [scale3d(0.1, 0.1, 0.1), translate3d(0, '-2000px', 0)],
            animationTimingFunction: cubicBezier(0.175, 0.885, 0.32, 1)
        })];
    const zoomOutLeft = [keyframe(40, {
            opacity: 1,
            transform: [scale3d(0.475, 0.475, 0.475), translate3d('42px', 0, 0)],
            animationTimingFunction: cubicBezier(0.55, 0.055, 0.675, 0.19)
        }), keyframe('to', {
            opacity: 0,
            transform: [scale3d(0.1, 0.1, 0.1), translate3d('-2000px', 0, 0)],
            animationTimingFunction: cubicBezier(0.175, 0.885, 0.32, 1)
        })];
    const zoomOutRight = [keyframe(40, {
            opacity: 1,
            transform: [scale3d(0.475, 0.475, 0.475), translate3d('-42px', 0, 0)],
            animationTimingFunction: cubicBezier(0.55, 0.055, 0.675, 0.19)
        }), keyframe('to', {
            opacity: 0,
            transform: [scale3d(0.1, 0.1, 0.1), translate3d('2000px', 0, 0)],
            animationTimingFunction: cubicBezier(0.175, 0.885, 0.32, 1)
        })];

    const hinge = [
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
    ];
    const jackInTheBox = [
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
    ];
    const rollIn = [
        keyframe(0, {
            opacity: 0,
            transform: [translate3d('-100%', 0, 0), rotate3d(0, 0, 1, -120)]
        }),
        keyframe(100, {
            opacity: 1,
            transform: translate3d(0, 0, 0)
        })
    ];
    const rollOut = [
        keyframe(0, {
            opacity: 1,
        }),
        keyframe(100, {
            opacity: 0,
            transform: [translate3d('100%', 0, 0), rotate3d(0, 0, 1, 120)]
        })
    ];

    const animationFrames = {
        // slide
        slideInDown, slideInLeft, slideInRight, slideInUp, slideOutDown, slideOutLeft, slideOutRight, slideOutUp,
        // zoom
        zoomIn, zoomInDown, zoomInLeft, zoomInRight, zoomInUp, zoomOut, zoomOutDown, zoomOutLeft, zoomOutRight, zoomOutUp,
        // specials
        hinge, jackInTheBox, rollIn, rollOut
    };
    const transitionKeyframes = {
        roll: ['rollIn', 'rollOut']
    };
    // 这里可以控制 keyframes 的名称 ， 并没有直接生成完整的keyframes
    const animations = Object.entries(animationFrames).map(([name, frames]) => keyframes(name, frames));
    const installAnimation = () => mount(createStyleSheet(null, animations), document.head);

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
    class App {
        isMounted = false;
        inlineTemplate;
        container;
        constructor(appOptions) {
            let { container } = appOptions;
            this.container = isString(container) ? document.querySelector(container) : container;
            this.inlineTemplate = this.container.innerHTML;
            this.container.innerHTML = '';
            // 安装动画
            this.use(installAnimation);
            currentApp = this;
        }
        // globalProperty
        components = builtInComponents;
        component(name, component) {
            if (this.directives[name]) {
                return warn('component is already exist');
            }
            this.components[name] = component;
        }
        directives = builtInDirectives$1;
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
            if (this.plugins.has(plugin))
                return;
            let install = isFunction(plugin) ? plugin : plugin.install;
            install.call(plugin, this, ...options);
        }
        mount(component) {
            if (!component.template && !component.render) {
                component.template = this.inlineTemplate;
            }
            mount(createComponent(component, null, null), this.container);
            this.isMounted = true;
        }
    }

    const createApp = (rootOptions) => new App(rootOptions);

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
        // hooks is always be array
        const hooks = target[type];
        if (!hooks)
            return;
        var { binding, scheduler } = options || emptyObject;
        const hooksResults = hooks.map((hook) => {
            return scheduler ?
                scheduler(hook, binding, ...args) :
                hook.apply(binding, args);
        });
        // 返回钩子的调用结果
        return hooksResults;
    }
    const createHook = (type) => (hook) => injectHook(type, getCurrentInstance(), hook);
    const onCreated = createHook("created" /* CREATED */);
    const onBeforeMount = createHook("beforeMount" /* BEFORE_MOUNT */);
    const onMounted = createHook("mounted" /* MOUNTED */);
    const onBeforeUpdate = createHook("beforeUpdate" /* BEFORE_UPDATE */);
    const onUpdated = createHook("updated" /* UPDATED */);
    const onBeforeUnmount = createHook("beforeUnmount" /* BEFORE_UNMOUNT */);
    const onUnmounted = createHook("unmounted" /* UNMOUNTED */);

    /*
        当传入不合理的props时
    */
    function normalizePropsOptions(options) {
        if (isArray(options)) {
            options = arrayToMap(options, emptyObject);
        }
        else {
            for (let key in options) {
                if (!isObject(options[key])) {
                    options[key] = {
                        type: options[key]
                    };
                }
            }
        }
        return options;
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
        ComponentOptions["BEFORE_PATCH"] = "beforePatch";
        ComponentOptions["TEMPLATE"] = "template";
        ComponentOptions["RENDER"] = "render";
        ComponentOptions["PROPS"] = "props";
        ComponentOptions["EMITS"] = "emits";
        ComponentOptions["MIXINS"] = "mixins";
        ComponentOptions["COMPOENNTS"] = "components";
        ComponentOptions["DIRECTIVES"] = "directives";
    })(exports.ComponentOptions || (exports.ComponentOptions = {}));
    function resolveOptions(options) {
        for (let key in options) {
            const value = options[key];
            switch (key) {
                case exports.ComponentOptions.PROPS:
                    options.propsOptions = normalizePropsOptions(value);
                    break;
                case exports.ComponentOptions.EMITS:
                    options.emitsOptions = normalizePropsOptions(value);
                    break;
                case exports.ComponentOptions.TEMPLATE:
                    options.createRender = compile(value);
                    break;
                case exports.ComponentOptions.RENDER:
                    // todo
                    break;
                case exports.ComponentOptions.CREATE:
                case exports.ComponentOptions.BEFORE_CREATE:
                case exports.ComponentOptions.CREATED:
                case exports.ComponentOptions.BEFORE_MOUNT:
                case exports.ComponentOptions.MOUNTED:
                case exports.ComponentOptions.BEFORE_UPDATE:
                case exports.ComponentOptions.UPDATED:
                case exports.ComponentOptions.BEFORE_UNMOUNT:
                case exports.ComponentOptions.UNMOUNTED:
                    // 转换为数组形式
                    if (value && !isArray(value)) {
                        options[key] = [value];
                    }
                    break;
                case exports.ComponentOptions.COMPOENNTS:
                    break;
                case exports.ComponentOptions.DIRECTIVES:
                    break;
                //! remove to create instance
                // case ComponentOptions.MIXINS:
                //     var mixins = value
                //     injectMixins(options, mixins as any[])
                //     break
                default:
                    /*custom options*/
                    const customOptions = options.customOptions ||= {};
                    customOptions[key] = value;
                    break;
            }
        }
    }

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
        if (!mixins)
            return;
        mixins.forEach((mixin) => {
            injectMixin(target, mixin);
        });
        return target;
    }

    var cssMethods = {
        rgba,
        rgb,
        hsl,
        hsla,
        $var,
        attr,
        calc,
        cubicBezier,
        max,
        min,
        translateX,
        translateY,
        scale,
        rotate3d,
        translate3d,
        rotate,
        perspective,
        scale3d,
        skew,
        skewX,
        skewY,
        scaleY,
        rotateY,
        conicGradient,
        linearGradient,
        radialGradient
    };

    const protoMethods = {
        ...cssMethods
    };
    const scopeProperties = {
        $uid: (instance) => instance.uid,
        $instance: (instance) => instance,
        $refs: (instance) => {
            let { isMounted, refs } = instance;
            if (!isMounted) {
                warn('component is not mounted , cant use refs');
                return null;
            }
            return refs;
        },
        $el: (instance) => {
            let { vnode, isMounted } = instance;
            if (!isMounted || !vnode) {
                return null;
            }
            let el = vnode.map((_vnode) => _vnode.el);
            return el.length === 1 ? el[0] : el;
        },
        $root: (instance) => instance.root,
        $attrs: (instance) => instance.attrs,
        $slots: (instance) => instance.slots,
        $props: (instance) => instance.props,
        $parent: (instance) => instance.parent,
        $watch: (instance) => instance.watch,
        $nextTick: (instance) => nextTick.bind(instance.scope),
        $self: (instance) => instance.scope,
        $forceUpdate: (instance) => instance.update,
        // evnets
        $emit: (instance) => instance.emit,
        $on: (instance) => (event, handler) => addInstanceListener(instance, event, handler),
        $off: (instance) => (event, handler) => removeInstanceListener(instance, event, handler),
        $once: (instance) => (event, handler) => onceInstanceListener(instance, event, handler),
        $events: (instance) => getInstanceEvents(instance),
        $listeners: (instance) => (event) => getInstancetEventListeners(instance, event)
    };
    const defineScopeProperty = (key, getter) => scopeProperties[key] = getter;
    // inject scope property
    function createScope(instance) {
        const scope = reactive(Object.create(protoMethods));
        return new Proxy(scope, {
            get(target, key, receiver) {
                if (hasOwn(scopeProperties, key)) {
                    return scopeProperties[key](instance);
                }
                return Reflect.get(target, key, receiver);
            },
            set(target, key, newValue, receiver) {
                if (hasOwn(scopeProperties, key)) {
                    return true;
                }
                else {
                    return Reflect.set(target, key, newValue, receiver);
                }
            }
        });
    }
    // process ref
    function createRenderScope(instanceScope) {
        return new Proxy(instanceScope, {
            get(target, key, receiver) {
                if (key === Symbol.unscopables) {
                    return;
                }
                // todo magic variables
                var result = Reflect.get(target, key, receiver);
                return isRef(result) ? result.value : result;
            }
        });
    }

    const createComponentInstance = (options, parent) => new ComponentInstance(options, parent);
    // 用class 的话this指向有问题
    class ComponentInstance {
        update;
        isMounted;
        uid = uid();
        scope;
        renderScope;
        render;
        vnode; // 当前所处的vnode
        componentVnode; //组件虚拟节点
        updatingComponentVnode;
        renderingVnode; // 即将挂载到页面的vnode
        slots;
        props;
        attrs;
        refs;
        customOptions;
        propsOptions;
        emitsOptions;
        createRender;
        components;
        directives;
        rootCreate;
        // hooks will always be an array
        create;
        beforeCreate;
        created;
        beforeMount;
        mounted;
        beforeUnmount;
        unmounted;
        beforeUpdate;
        updated;
        events;
        app;
        parent;
        root;
        emit;
        beforePatch;
        constructor(options, parent) {
            const { render, createRender, create, beforeCreate, created, beforeMount, mounted, beforeUnmount, unmounted, beforeUpdate, updated, beforePatch, mixins, components, directives, customOptions, propsOptions, emitsOptions, } = options;
            this.parent = parent;
            this.root = parent ? parent.root : this;
            this.beforeCreate = shallowCloneArray(beforeCreate);
            this.create = shallowCloneArray(create);
            this.created = shallowCloneArray(created);
            this.beforeMount = shallowCloneArray(beforeMount);
            this.mounted = shallowCloneArray(mounted);
            this.beforeUpdate = shallowCloneArray(beforeUpdate);
            this.updated = shallowCloneArray(updated);
            this.beforeUnmount = shallowCloneArray(beforeUnmount);
            this.unmounted = shallowCloneArray(unmounted);
            this.customOptions = customOptions;
            this.beforePatch = beforePatch;
            this.propsOptions = propsOptions || emptyObject;
            this.emitsOptions = emitsOptions || emptyObject;
            this.components = components;
            this.directives = directives;
            this.render = render;
            this.createRender = createRender;
            this.emit = createInstanceEventEmitter(this);
            let scope = createScope(this);
            this.scope = scope;
            this.renderScope = createRenderScope(scope);
            let app = getCurrentApp();
            this.app = app;
            injectMixins(this, mixins);
            injectMixins(this, app.mixins);
        }
    }

    /*
        pervious 节点存在一定是更新 ， 但可能存在key不相同，此时需要进入节点的卸载和新节点的挂载
    */
    function normalizeDirective(directive) {
        return isFunction(directive) ? {
            mounted: directive,
            updated: directive
        } : directive;
    }
    function injectDirective(target, [directive, ...bindings]) {
        var dirs = target.dirs ||= new Map();
        dirs.set(directive, bindings);
    }
    function injectDirectives(target, directives) {
        directives.forEach((directive) => {
            injectDirective(target, directive);
        });
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
    function processHook(type, next, previous = undefined) {
        // 在这不需要判断 两个节点的patchkey是否相同
        const isComponent = next.nodeType === 14 /* COMPONENT */;
        if (isComponent) {
            var instance = next.instance;
            // 组件需要处理实例钩子
            var scope = instance.scope;
            callHook(type, instance, { binding: scope }, scope);
        }
        // 指令钩子
        var dirs = next.dirs;
        if (dirs) {
            for (let [dir, [value, _arguments, modifiers]] of dirs) {
                var _dir = normalizeDirective(dir);
                var hook = _dir[type];
                if (hook) {
                    var bindings = {
                        directive: dir,
                        value,
                        _arguments: _arguments ? setOwnKey(_arguments) : emptyObject,
                        modifiers: modifiers ? setOwnKey(modifiers) : emptyObject,
                    };
                    if (previous) {
                        // 如果更新的话两个节点的指令应该完全相同
                        bindings.oldValue = previous.dirs.get(dir)[0];
                    }
                    // 
                    hook(isComponent ? next.instance.scope : next.el, bindings, next, previous);
                }
            }
        }
        // 节点钩子
        const vnodeHook = next?.props?.[`_${type}`];
        if (vnodeHook) {
            vnodeHook(isComponent ? next.instance.scope : next.el);
        }
    }

    exports.$var = $var;
    exports.App = App;
    exports.Comment = Comment;
    exports.ComponentInstance = ComponentInstance;
    exports.ComputedRef = ComputedRef;
    exports.IMPORTANT = IMPORTANT;
    exports.IMPORTANT_KEY = IMPORTANT_KEY;
    exports.IMPORTANT_SYMBOL = IMPORTANT_SYMBOL;
    exports.NULL = NULL;
    exports.ReactiveEffect = ReactiveEffect;
    exports.ReactiveTypeSymbol = ReactiveTypeSymbol;
    exports.Ref = Ref;
    exports.TARGET_MAP = TARGET_MAP;
    exports.Text = Text;
    exports.addClass = addClass;
    exports.addInstanceListener = addInstanceListener;
    exports.addListener = addListener;
    exports.appendMedium = appendMedium;
    exports.arrayHandler = arrayHandler;
    exports.arrayToMap = arrayToMap;
    exports.attr = attr;
    exports.builtInComponents = builtInComponents;
    exports.builtInDirectives = builtInDirectives$1;
    exports.cache = cache;
    exports.calc = calc;
    exports.callFn = callFn;
    exports.callHook = callHook;
    exports.camelize = camelize;
    exports.cleaarRefDeps = cleaarRefDeps;
    exports.compile = compile;
    exports.computed = computed;
    exports.conicGradient = conicGradient;
    exports.createApp = createApp;
    exports.createComment = createComment;
    exports.createComponent = createComponent;
    exports.createComponentInstance = createComponentInstance;
    exports.createDeclaration = createDeclaration;
    exports.createElement = createElement;
    exports.createFragment = createFragment;
    exports.createFunction = createFunction;
    exports.createInstanceEventEmitter = createInstanceEventEmitter;
    exports.createKeyframe = createKeyframe;
    exports.createKeyframes = createKeyframes;
    exports.createMap = createMap;
    exports.createMapEntries = createMapEntries;
    exports.createMedia = createMedia;
    exports.createNode = createNode;
    exports.createReactiveCollection = createReactiveCollection;
    exports.createReactiveEffect = createReactiveEffect;
    exports.createReactiveObject = createReactiveObject;
    exports.createReadonlyCollection = createReadonlyCollection;
    exports.createReadonlyObject = createReadonlyObject;
    exports.createRefValueSetter = createRefValueSetter;
    exports.createRenderScope = createRenderScope;
    exports.createSVGElement = createSVGElement;
    exports.createScope = createScope;
    exports.createSetter = createSetter;
    exports.createShallowReactiveCollection = createShallowReactiveCollection;
    exports.createShallowReactiveObject = createShallowReactiveObject;
    exports.createShallowReadonlyCollection = createShallowReadonlyCollection;
    exports.createShallowReadonlyObject = createShallowReadonlyObject;
    exports.createStyle = createStyle;
    exports.createStyleSheet = createStyleSheet;
    exports.createSupports = createSupports;
    exports.createText = createText;
    exports.cubicBezier = cubicBezier;
    exports.customDisplay = customDisplay;
    exports.declare = declare;
    exports.defineScopeProperty = defineScopeProperty;
    exports.deleteActiveEffect = deleteActiveEffect;
    exports.deleteKeyframe = deleteKeyframe;
    exports.deleteMedium = deleteMedium;
    exports.deleteRule = deleteRule;
    exports.destructur = destructur;
    exports.display = display;
    exports.doFlat = doFlat;
    exports.doCSSAnimation = doCSSAnimation;
    exports.docCreateComment = docCreateComment;
    exports.docCreateElement = docCreateElement;
    exports.docCreateText = docCreateText;
    exports.dynamicMapKey = dynamicMapKey;
    exports.effect = effect;
    exports.emptyArray = emptyArray;
    exports.emptyFunction = emptyFunction;
    exports.emptyObject = emptyObject;
    exports.error = error;
    exports.exec = exec;
    exports.execCaptureGroups = execCaptureGroups;
    exports.extend = extend;
    exports.flatRules = flatRules;
    exports.getActiveEffect = getActiveEffect;
    exports.getComponent = getComponent;
    exports.getCurrentApp = getCurrentApp;
    exports.getCurrentInstance = getCurrentInstance;
    exports.getCurrentRenderScope = getCurrentRenderScope;
    exports.getCurrentScope = getCurrentScope;
    exports.getDeps = getDeps;
    exports.getDepsMap = getDepsMap;
    exports.getDirective = getDirective;
    exports.getElementComputedStyle = getElementComputedStyle;
    exports.getElementComputedStyleValue = getElementComputedStyleValue;
    exports.getElementStyle = getElementStyle;
    exports.getElementStyleValue = getElementStyleValue;
    exports.getEmptyObject = getEmptyObject;
    exports.getEventName = getEventName;
    exports.getInstanceEvents = getInstanceEvents;
    exports.getInstancetEventListeners = getInstancetEventListeners;
    exports.getLastSetKey = getLastSetKey;
    exports.getLastSetNewValue = getLastSetNewValue;
    exports.getLastSetOldValue = getLastSetOldValue;
    exports.getLastSetTarget = getLastSetTarget;
    exports.getLastVisitKey = getLastVisitKey;
    exports.getLastVisitTarget = getLastVisitTarget;
    exports.getRefDeps = getRefDeps;
    exports.getReservedProp = getReservedProp;
    exports.getStyle = getStyle;
    exports.getStyleValue = getStyleValue;
    exports.h = h;
    exports.hasOwn = hasOwn;
    exports.hsl = hsl;
    exports.hsla = hsla;
    exports.hyphenate = hyphenate;
    exports.important = important;
    exports.initialLowerCase = initialLowerCase;
    exports.initialUpperCase = initialUpperCase;
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
    exports.isEffect = isEffect;
    exports.isEvent = isEvent;
    exports.isFunction = isFunction;
    exports.isHTMLTag = isHTMLTag;
    exports.isNumber = isNumber;
    exports.isNumberString = isNumberString;
    exports.isObject = isObject;
    exports.isPromise = isPromise;
    exports.isProxy = isProxy;
    exports.isProxyType = isProxyType;
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
    exports.linearGradient = linearGradient;
    exports.makeMap = makeMap;
    exports.mark = mark;
    exports.markRaw = markRaw;
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
    exports.normalizeClass = normalizeClass;
    exports.normalizeKeyText = normalizeKeyText;
    exports.normalizeStyle = normalizeStyle;
    exports.objectStringify = objectStringify;
    exports.onBeforeMount = onBeforeMount;
    exports.onBeforeUnmount = onBeforeUnmount;
    exports.onBeforeUpdate = onBeforeUpdate;
    exports.onCreated = onCreated;
    exports.onMounted = onMounted;
    exports.onSet = onSet;
    exports.onSetCallbacks = onSetCallbacks;
    exports.onUnmounted = onUnmounted;
    exports.onUpdated = onUpdated;
    exports.onceInstanceListener = onceInstanceListener;
    exports.onceListener = onceListener;
    exports.parseEventName = parseEventName;
    exports.parseInlineClass = parseInlineClass;
    exports.parseInlineStyle = parseInlineStyle;
    exports.parseNativeEventName = parseNativeEventName;
    exports.parseStyleValue = parseStyleValue;
    exports.patch = patch;
    exports.perspective = perspective;
    exports.processHook = processHook;
    exports.processRenderResult = processRenderResult;
    exports.queueJob = queueJob;
    exports.radialGradient = radialGradient;
    exports.reactive = reactive;
    exports.reactiveCollectionHandler = reactiveCollectionHandler;
    exports.reactiveHandler = reactiveHandler;
    exports.readonly = readonly;
    exports.readonlyCollectionHandler = readonlyCollectionHandler;
    exports.readonlyHandler = readonlyHandler;
    exports.ref = ref;
    exports.removeAttribute = removeAttribute;
    exports.removeClass = removeClass;
    exports.removeElement = removeElement;
    exports.removeFromArray = removeFromArray;
    exports.removeInstanceListener = removeInstanceListener;
    exports.removeListener = removeListener;
    exports.renderList = renderList;
    exports.renderSlot = renderSlot;
    exports.resolveOptions = resolveOptions;
    exports.rgb = rgb;
    exports.rgba = rgba;
    exports.rotate = rotate;
    exports.rotate3d = rotate3d;
    exports.rotateY = rotateY;
    exports.scale = scale;
    exports.scale3d = scale3d;
    exports.scaleY = scaleY;
    exports.setActiveEffect = setActiveEffect;
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
    exports.shallowCloneArray = shallowCloneArray;
    exports.shallowReactive = shallowReactive;
    exports.shallowReactiveCollectionHandler = shallowReactiveCollectionHandler;
    exports.shallowReactiveHandler = shallowReactiveHandler;
    exports.shallowReadonly = shallowReadonly;
    exports.shallowReadonlyCollectionHandler = shallowReadonlyCollectionHandler;
    exports.shallowReadonlyHandler = shallowReadonlyHandler;
    exports.shallowWatchReactive = shallowWatchReactive;
    exports.skew = skew;
    exports.skewX = skewX;
    exports.skewY = skewY;
    exports.sortChildren = sortChildren;
    exports.splitSelector = splitSelector;
    exports.stringToMap = stringToMap;
    exports.stringify = stringify;
    exports.ternaryChains = ternaryChains;
    exports.ternaryExp = ternaryExp;
    exports.toArray = toArray;
    exports.toArrowFunction = toArrowFunction;
    exports.toBackQuotes = toBackQuotes;
    exports.toEventName = toEventName;
    exports.toNativeEventName = toNativeEventName;
    exports.toRaw = toRaw;
    exports.toReservedProp = toReservedProp;
    exports.toSingleQuotes = toSingleQuotes;
    exports.toTernaryExp = toTernaryExp;
    exports.track = track;
    exports.trackRef = trackRef;
    exports.transitionKeyframes = transitionKeyframes;
    exports.translate3d = translate3d;
    exports.translateX = translateX;
    exports.translateY = translateY;
    exports.trigger = trigger;
    exports.triggerRef = triggerRef;
    exports.typeOf = typeOf;
    exports.uStringId = uStringId;
    exports.uVar = uVar;
    exports.uid = uid;
    exports.unionkeys = unionkeys;
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
    exports.updateInstanceListeners = updateInstanceListeners;
    exports.updateStyleSheet = updateStyleSheet;
    exports.warn = warn;
    exports.trackTargetSymbol = trackTargetSymbol;
    exports.watchReactive = watchReactive;
    exports.watchRef = watchRef;
    exports.watchTargetKey = watchTargetKey;
    exports.withEventModifiers = withEventModifiers;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

})({});
