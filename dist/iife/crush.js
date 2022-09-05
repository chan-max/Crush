// crush.js 1.1.9 created by chan 
var Crush = (function (exports) {
    'use strict';

    const cache = (fn) => {
        const cache = Object.create(null);
        return ((key) => {
            const cached = cache[key];
            return cached === undefined ? (cache[key] = fn(key)) : cached;
        });
    };

    const warn = (...msg) => {
        console.warn(...msg);
    };
    const error = (...msg) => {
        console.error(...msg);
    };
    const log = (...msg) => {
        console.log(...msg);
    };
    const throwError = (...msg) => {
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
    const extend = Object.assign;

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
    const shallowCloneObject = (obj) => obj && { ...obj };
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
        // do not toLowerCase
        return objectToString.call(value).slice(8, -1);
    }
    const isPromise = (value) => {
        return value && isFunction(value.then) && isFunction(value.catch);
    };
    const isDate = (value) => value instanceof Date;
    const isArray = Array.isArray;
    // 将一个值转换成数字，失败的话，返回本身
    function toNumber(value) {
        let numberValue = Number(value);
        return isNumber(numberValue) ? numberValue : value;
    }
    function isEmptyObject(obj) {
        return Object.keys(obj).length === 0;
    }

    const camelizeRE = /-(\w)/g;
    const camelize = cache((str) => {
        return str && str.replace(camelizeRE, (_, c) => (c ? c.toUpperCase() : ''));
    });
    const hyphenateRE = /\B([A-Z])/g;
    const hyphenate = cache((str) => str.replace(hyphenateRE, '-$1').toLowerCase());
    const initialUpperCase = cache((str) => str.charAt(0).toUpperCase() + str.slice(1));
    const initialLowerCase = cache((str) => str.charAt(0).toLowerCase() + str.slice(1));

    const hasOwnProperty = Object.prototype.hasOwnProperty;
    // target may be null undefined
    const hasOwn = (target, key) => target && hasOwnProperty.call(target, key);

    function debounce(fn, wait) {
        let timeoutId = null;
        return () => {
            if (timeoutId !== null) {
                // 存在任务
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(() => {
                fn();
                timeoutId = null;
            }, wait);
        };
    }
    function throttle(fn, wait) {
        // 确保第一次永远执行
        let lastTime = -wait;
        return () => {
            console.log('th');
            if (Date.now() - lastTime >= wait) {
                fn();
                lastTime = Date.now();
            }
        };
    }
    // 如果在模板中使用防抖节流， 每次更新都会重新生成防抖截节流函数
    const debounceCache = new WeakMap();
    function cacheDebounce(fn, wait) {
        let cached = debounceCache.get(fn);
        if (cached) {
            return cached;
        }
        else {
            let debounceFn = debounce(fn, wait);
            debounceCache.set(fn, debounceFn);
            return debounceFn;
        }
    }
    const throttleCache = new WeakMap();
    function cacheThrottle(fn, wait) {
        let cached = throttleCache.get(fn);
        if (cached) {
            return cached;
        }
        else {
            let throttleFn = throttle(fn, wait);
            throttleCache.set(fn, throttleFn);
            return throttleFn;
        }
    }

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
    // 重新挂载一个元素
    function remountElement(el) {
        let parent = el.parentElement;
        let anchor = el.nextElementSibling;
        removeElement(el);
        insertElement(el, parent, anchor);
    }
    const setAttribute = (el, attribute, value = '') => el.setAttribute(attribute, value);
    const removeAttribute = (el, attribute) => el.removeAttribute(attribute);
    const addListener = (target, event, handler, options = null) => target.addEventListener(event, handler, options);
    const removeListener = (target, event, handler, options = null) => target.removeEventListener(event, handler, options);
    function onceListener(target, event, handler, options = null) {
        var onceHandler = () => {
            handler();
            removeListener(target, event, onceHandler, options);
        };
        addListener(target, event, onceHandler, options);
        // 注销事件
        return () => removeListener(target, event, onceHandler, options);
    }

    // normalize props 会在创建vnode时执行，确保得到的节点props已经处理完毕，不会在
    function normalizeProps(props) {
        if (!props) {
            return;
        }
        if (props.bind) { // use bind
            extend(props, props.bind);
            delete props.bind;
        }
        // 不在渲染时在进行处理，为了可以直接通过vnode获取到相应的class
        if (props.class) {
            props.class = normalizeClass(props.class);
        }
        if (props.style) {
            props.style = normalizeStyle(props.style);
        }
        return props;
    }

    var createStyleSheet = (props, children, scoped = false, key = uid()) => {
        return {
            nodeType: 17 /* STYLE */,
            type: 'style',
            children,
            scoped,
            props: normalizeProps(props),
            key,
        };
    };
    var createStyle = (selector, children, key = uid) => {
        return {
            nodeType: 26 /* STYLE_RULE */,
            selector,
            children,
            key
        };
    };
    var createMedia = (media, children, key = uid()) => ({
        nodeType: 22 /* MEDIA_RULE */,
        media,
        children,
        key
    });
    function createKeyframes(keyframes, children, key = uid()) {
        return {
            nodeType: 24 /* KEYFRAMES_RULE */,
            keyframes,
            children,
            key
        };
    }
    function createKeyframe(keyframe, children, key = uid()) {
        return {
            nodeType: 27 /* KEYFRAME_RULE */,
            key,
            keyframe,
            children,
        };
    }
    var createSupports = (supports, children, key = uid()) => ({
        nodeType: 23 /* SUPPORTS_RULE */,
        supports,
        children,
        key
    });
    var createDeclaration = (children, key = uid()) => {
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
                    rule.children = null; // children 会用存储declaration
                    if (_children) {
                        doFlat(_children, flattedRules, rule, patchKey);
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
        return source.startsWith('! ') ? createComment(source.slice(2), key) : createText(source, key);
    }
    function processVnodePrerender(node, parentKey) {
        if (!isArray(node)) {
            node = [node];
        }
        var flattedNodes = [];
        node.forEach((child) => {
            if (child === undefined || child === null)
                return; // 空节点筛除  
            if (isString(child) || isNumber(child)) {
                // 只会出现手写render的情况
                child = processStringRender(child, parentKey);
            }
            if (isArray(child)) {
                // 只会出现手写render的情况 [[v1,v2,v3]]
                flattedNodes = flattedNodes.concat(processVnodePrerender(child, parentKey));
            }
            if (child.patchKey) {
                flattedNodes.push(child);
                return;
            }
            if (child.nodeType === 1 /* FRAGMENT */) {
                /* 这里给后续传入fragment的key，为了使后续的每个节点都能有唯一的key ,
                    当使用 for循环时，只能传入一个key，但会在循环时为每个结果生成唯一的key
                */
                flattedNodes = flattedNodes.concat(processVnodePrerender(child.children, child.key));
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
                    child.children = processVnodePrerender(child.children);
                }
                if (child.nodeType === 17 /* STYLE */) {
                    child.children = flatRules(child.children, null, child.patchKey);
                }
                flattedNodes.push(child);
            }
        });
        return flattedNodes;
    }

    const insertNull = (arr, index, length = 1) => arr.splice(index, 0, ...new Array(length).fill(null));
    function unionkeys(...maps) {
        var keyMap = {};
        for (let i in maps || emptyObject) {
            for (let key in maps[i]) {
                keyMap[key] = true;
            }
        }
        return Object.keys(keyMap);
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
    function toEventName(event, _arguments, modifiers, filters) {
        /*
            argument $
            modifier _
            filter $_
        */
        event = `on${initialUpperCase(camelize(event))}`;
        _arguments && (event += _arguments.map(($) => `$${$}`).join(''));
        modifiers && (event += modifiers.map((_) => `_${_}`).join(''));
        filters && (event += filters.map(($_) => `$_${$_}`).join(''));
        return event;
    }
    // quickly get the handler key event
    function getEventName(name) {
        return initialLowerCase(name.slice(2).split(/_|\$/)[0]);
    }
    const extrctEventNameRE = /on([a-zA-Z]+)([\$a-zA-Z]*)([_a-zA-Z]*)([\$_a-zA-Z]*)/;
    function parseEventName(name) {
        const [_, event, _argumentsStr, modifiersStr, filterStr] = extrctEventNameRE.exec(name);
        return {
            event: initialLowerCase(event),
            _arguments: (_argumentsStr && _argumentsStr.split('$').filter(Boolean)) || null,
            modifiers: (modifiersStr && modifiersStr.split('_').filter(Boolean)) || null,
            filters: (filterStr && filterStr.split('$_').filter(Boolean)) || null,
        };
    }
    const eventModifiers = {
        stop: (e) => e.stopPropagation(),
        prevent: (e) => e.preventDefault(),
        self: (e) => e.target !== e.currentTarget,
        ctrl: (e) => !e.ctrlKey,
        shift: (e) => !e.shiftKey,
        alt: (e) => !e.altKey,
        meta: (e) => !e.metaKey,
        // 需要把事件转换成 onMouseup
        left: (e) => 'button' in e && e.button !== 0,
        middle: (e) => 'button' in e && e.button !== 1,
        right: (e) => 'button' in e && e.button !== 2,
    };
    // 使用 withEventModifiers 才会初始化
    let reverseKeyCodes = null;
    function createReverseKeyCodes() {
        let keyCodes = getCurrentApp().keyCodes;
        let reverseKeyCodes = {};
        for (let key in keyCodes) {
            let value = keyCodes[key];
            if (isString(value)) {
                let reverseValue = reverseKeyCodes[value] ||= [];
                reverseValue.push(key);
            }
            else if (isArray(value)) {
                value.forEach((val) => {
                    let reverseValue = reverseKeyCodes[val] ||= [];
                    reverseValue.push(key);
                });
            }
        }
        return reverseKeyCodes;
    }
    function withEventModifiers(fn, modifiers) {
        if (!isFunction(fn)) {
            return null;
        }
        reverseKeyCodes ||= createReverseKeyCodes();
        // key 按键守卫
        let guardKeyCodes = modifiers && modifiers.reduce((res, modifier) => {
            if (reverseKeyCodes[modifier]) {
                res = res.concat(reverseKeyCodes[modifier]);
            }
            return res;
        }, []);
        // 增加按键守卫
        let withKeyGuardFn = guardKeyCodes.length ? (event, ...args) => {
            if (guardKeyCodes.includes(event.code)) {
                fn(event, ...args);
            }
        } : fn;
        let withGuardsFn = (event, ...args) => {
            for (let i = 0; i < modifiers.length; i++) {
                const guard = eventModifiers[modifiers[i]];
                if (guard && guard(event, modifiers)) {
                    // 
                    return;
                }
            }
            return withKeyGuardFn(event, ...args);
        };
        // 保存原函数
        withGuardsFn._raw = fn;
        return withGuardsFn;
    }
    const keyCodes = {
        // 普通写法
        Escape: 'escape',
        // 两个keycode使用同一个修饰符时代表，这两个键均可以触发
        Numpad0: '0',
        Digit0: '0',
        // 当一个keycode有多个修饰符时，代表多个修饰符指向kecode
        Delete: ['delete', 'del'],
        Digit1: '1',
        Digit2: null,
        Digit3: null,
        Digit4: null,
        Digit5: null,
        Digit6: null,
        Digit7: null,
        Digit8: null,
        Digit9: null,
        Minus: null,
        Equal: null,
        Backspace: null,
        Tab: null,
        KeyQ: null,
        KeyW: null,
        KeyE: null,
        KeyR: null,
        KeyT: null,
        KeyY: null,
        KeyU: null,
        KeyI: null,
        KeyO: null,
        KeyP: null,
        BracketLeft: null,
        BracketRight: null,
        Enter: null,
        ControlLeft: null,
        KeyA: null,
        KeyS: 's',
        KeyD: null,
        KeyF: null,
        KeyG: null,
        KeyH: null,
        KeyJ: null,
        KeyK: null,
        KeyL: null,
        Semicolon: null,
        Quote: null,
        Backquote: null,
        ShiftLeft: null,
        Backslash: null,
        KeyZ: null,
        KeyX: null,
        KeyC: null,
        KeyV: null,
        KeyB: null,
        KeyN: null,
        KeyM: null,
        Comma: null,
        Period: null,
        Slash: null,
        ShiftRight: null,
        NumpadMultiply: null,
        AltLeft: null,
        Space: null,
        CapsLock: null,
        F1: null,
        F2: null,
        F3: null,
        F4: null,
        F5: null,
        F6: null,
        F7: null,
        F8: null,
        F9: null,
        F10: null,
        Pause: null,
        ScrollLock: null,
        Numpad7: null,
        Numpad8: null,
        Numpad9: null,
        NumpadSubtract: null,
        Numpad4: null,
        Numpad5: null,
        Numpad6: null,
        NumpadAdd: null,
        Numpad1: null,
        Numpad2: null,
        Numpad3: null,
        NumpadDecimal: null,
        PrintScreen: null,
        IntlBackslash: null,
        F11: null,
        F12: null,
        NumpadEqual: null,
        F13: null,
        F14: null,
        F15: null,
        F16: null,
        F17: null,
        F18: null,
        F19: null,
        F20: null,
        F21: null,
        F22: null,
        F23: null, F24: null,
        KanaMode: null,
        Lang2: null,
        Lang1: null,
        IntlRo: null,
        Convert: null,
        NonConvert: null,
        IntlYen: null,
        NumpadComma: null,
        Undo: null,
        Paste: null,
        MediaTrackPrevious: null,
        Cut: null,
        Copy: null,
        MediaTrackNext: null,
        NumpadEnter: null,
        ControlRight: null,
        LaunchMail: null,
        AudioVolumeMute: null,
        VolumeMute: null,
        LaunchApp2: null,
        MediaPlayPause: null,
        MediaStop: null,
        Eject: null,
        AudioVolumeDown: null,
        VolumeDown: null,
        AudioVolumeUp: null,
        VolumeUp: null,
        BrowserHome: null,
        NumpadDivide: null,
        AltRight: null,
        Help: null,
        NumLock: null,
        Home: null,
        ArrowUp: null,
        PageUp: null,
        ArrowLeft: null,
        ArrowRight: null,
        End: null,
        ArrowDown: null,
        PageDown: null,
        Insert: null,
        MetaLeft: null,
        OSLeft: null,
        MetaRight: null,
        OSRight: null,
        ContextMenu: null,
        Power: null,
        BrowserSearch: null,
        BrowserFavorites: null,
        BrowserRefresh: null,
        BrowserStop: null,
        BrowserForward: null,
        BrowserBack: null,
        LaunchApp1: null,
        LaunchMediaPlayer: null,
        MediaSelect: null
    };

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

    // 目前只支持两层
    function joinArrayStyleValue(value, firstLevelSeparator = { value: ' ' }) {
        return value.map((item) => {
            if (isArray(item)) {
                firstLevelSeparator.value = ',';
                return item.join(' ');
            }
            else {
                return item;
            }
        }).join(firstLevelSeparator.value);
    }
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
            value = joinArrayStyleValue(value);
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
        let events = globalInstanceEventListeners.get(instance);
        if (!events) {
            events = {};
            globalInstanceEventListeners.set(instance, events);
        }
        return events;
    }
    function getInstanceEvent(instance, event, _arguments, modifiers, filters) {
        let events = getInstanceEvents(instance);
        let _event = events[event];
        if (!_event) {
            _event = {
                listeners: new Set(),
                _arguments, modifiers, filters
            };
            events[event] = _event;
        }
        return _event;
    }
    function getInstancetEventListeners(instance, event) {
        let _event = getInstanceEvent(instance, event);
        return _event.listeners;
    }
    function createInstanceEventEmitter(instance) {
        return (event, ...args) => emitInstancetEvent(instance, event, ...args);
    }
    function emitInstancetEvent(instance, event, ...args) {
        const listeners = getInstancetEventListeners(instance, event);
        listeners.forEach((handler) => {
            handler(...args);
        });
    }
    /* handler 标准化，转成数组格式 */
    function normalizeHandler(handler) {
        return (isArray(handler) ? handler : [handler]).filter(isFunction);
    }
    function updateInstanceListeners(instance, event, pHandler, nHandler, _arguments, modifiers, filters) {
        if (pHandler === nHandler) {
            return;
        }
        // 不影响组件自身注册的事件
        let _event = getInstanceEvent(instance, event, _arguments, modifiers, filters);
        let listeners = _event.listeners;
        pHandler = normalizeHandler(pHandler);
        nHandler = normalizeHandler(nHandler);
        pHandler.forEach((handler) => {
            if (!nHandler.includes(handler)) {
                listeners.delete(handler);
            }
        });
        nHandler.forEach((handler) => {
            if (!pHandler.includes(handler)) {
                listeners.add(handler);
            }
        });
    }
    function addInstanceListener(instance, event, rawHandler) {
        const listeners = getInstancetEventListeners(instance, event);
        normalizeHandler(rawHandler).forEach((handler) => {
            listeners.add(handler);
        });
    }
    function removeInstanceListener(instance, event, rawHandler) {
        const listeners = getInstancetEventListeners(instance, event);
        normalizeHandler(rawHandler).forEach((handler) => {
            listeners.delete(handler);
        });
    }
    function onceInstanceListener(instance, event, rawHandler) {
        const listeners = getInstancetEventListeners(instance, event);
        normalizeHandler(rawHandler).forEach((handler) => {
            const onceHandler = (...args) => {
                handler(...args);
                listeners.delete(onceHandler);
            };
            listeners.add(onceHandler);
        });
    }
    // native events

    const beoforeClassMountHooks = new Set();
    function onBeforeClassMount(hook) {
        beoforeClassMountHooks.add(hook);
        return () => {
            beoforeClassMountHooks.delete(hook);
        };
    }
    function updateClass(el, pClass, nClass) {
        pClass = normalizeClass(pClass);
        nClass = normalizeClass(nClass);
        for (let className of unionkeys(pClass, nClass)) {
            var p = pClass[className];
            var n = nClass[className];
            if (!p === !n) {
                continue;
            }
            if (p) {
                removeClass(el, className);
            }
            if (n) {
                for (let beoforeClassMountHook of beoforeClassMountHooks) {
                    beoforeClassMountHook(className, el);
                }
                addClass(el, className);
            }
        }
    }
    function mountClass(el, _class) {
        updateClass(el, emptyObject, _class);
    }
    function unmountClass(el) {
        el.className = '';
    }
    function mountAttributes(el, props, instance = null, isSVG) {
        updateElementAttributes(el, null, props, instance, isSVG);
    }
    function updateElementAttributes(el, pProps, nProps, instance = null, isSVG = false, dynamicProps = null) {
        // 如果传了dynamicProps更新即可，没传的话就需要全部更新
        if (!pProps && !nProps) {
            return;
        }
        pProps ||= emptyObject;
        nProps ||= emptyObject;
        for (let propName of (dynamicProps || unionkeys(pProps, nProps))) {
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
                    if (!instance) {
                        continue;
                    }
                    let refs = instance.refs ||= {};
                    if (nValue !== pValue) {
                        pValue && (refs[pValue] = null);
                        nValue && (refs[nValue] = el);
                    }
                    break;
                case 'bind':
                    updateElementAttributes(el, pValue, nValue, instance, isSVG);
                    break;
                default:
                    if (propName.startsWith('_')) {
                        // 保留属性
                        continue;
                    }
                    else if (isEvent(propName)) {
                        if (pValue === nValue) {
                            continue;
                        }
                        const { event, _arguments, modifiers, filters } = parseEventName(propName);
                        if (isElementLifecycleHook(event)) {
                            // 生命周期钩子跳过
                            continue;
                        }
                        // builtIn events
                        switch (event) {
                            case 'emit':
                                debugger;
                                break;
                        }
                        // window 修饰符
                        el = modifiers && modifiers.includes('window') ? window : el;
                        let options = {
                            once: modifiers && modifiers.includes('once'),
                            capture: modifiers && modifiers.includes('capture'),
                            passive: modifiers && modifiers.includes('passive')
                        };
                        let pHandler = normalizeHandler(pValue);
                        let nHandler = normalizeHandler(nValue);
                        // 保留原始事件和
                        let handlerMap = el._rawHandlerToModifiedHandler ||= new Map();
                        pHandler.forEach((handler) => {
                            if (!nHandler.includes(handler)) {
                                // remove
                                removeListener(el, event, el._rawHandlerToModifiedHandler.get(handler), options);
                            }
                        });
                        nHandler.forEach((handler) => {
                            if (!pHandler.includes(handler)) {
                                // add
                                let modifiedHandler = modifiers ? withEventModifiers(handler, modifiers) : handler;
                                handlerMap.set(handler, modifiedHandler);
                                addListener(el, event, modifiedHandler, options);
                            }
                        });
                    }
                    else if (propName in el && !isSVG) { // dom props
                        (pValue !== nValue) && (el[propName] = nValue);
                    }
                    else {
                        // attribute
                        propName = hyphenate(propName); // 连字符属性
                        (pValue !== nValue) && (nValue ? setAttribute(el, propName, nValue) : removeAttribute(el, propName));
                    }
            }
        }
    }

    /*
        mountStyleSheet will create a style element
    */
    const mountStyleSheet = (vnode, container, anchor, parent) => {
        const { props, children, scoped } = vnode;
        processHook("beforeCreate" /* BEFORE_CREATE */, vnode);
        var el = docCreateElement('style');
        mountAttributes(el, props, parent, false);
        processHook("created" /* CREATED */, vnode);
        vnode.el = el;
        processHook("beforeMount" /* BEFORE_MOUNT */, vnode);
        insertElement(el, container, anchor);
        var sheet = el.sheet;
        mountSheet(sheet, children, scoped ? (parent.scopedId || `scoped-${parent.uid}`) : '');
        processHook("mounted" /* MOUNTED */, vnode);
        return sheet;
    };
    function mountSheet(sheet, rules, scopedId) {
        rules.forEach((rule) => {
            mountRule(sheet, rule, scopedId);
        });
    }
    function mountRule(sheet, rule, scopedId) {
        switch (rule.nodeType) {
            case 26 /* STYLE_RULE */:
                mountStyleRule(sheet, rule, sheet.cssRules.length, scopedId);
                break;
            case 22 /* MEDIA_RULE */:
                mountMediaRule(sheet, rule, sheet.cssRules.length, scopedId);
                break;
            case 23 /* SUPPORTS_RULE */:
                mountSupportsRule(sheet, rule, sheet.cssRules.length, scopedId);
                break;
            case 24 /* KEYFRAMES_RULE */:
                mountKeyframesRule(sheet, rule, sheet.cssRules.length);
                break;
            case 27 /* KEYFRAME_RULE */:
                mountKeyframeRule(sheet, rule);
                break;
        }
    }
    function mountStyleRule(sheet, rule, insertIndex = sheet.cssRules.length, scopedId = '' // 默认没有作用域id
    ) {
        let { selector, children: declaration } = rule;
        if (!declaration)
            return;
        if (scopedId) {
            selector = setSelectorAttribute(selector, scopedId);
        }
        const index = insertStyle(sheet, selector, insertIndex);
        const insertedRule = sheet.cssRules[index];
        rule.rule = insertedRule; // set rule
        const insertedRuleStyle = insertedRule.style;
        mountDeclaration(insertedRuleStyle, declaration);
    }
    function mountMediaRule(sheet, rule, insertIndex = sheet.cssRules.length, scopedId) {
        var media = rule.media;
        var rules = rule.children;
        if (isArray(media)) {
            media = media.join(',');
        }
        var index = insertMedia(sheet, media, insertIndex);
        var newSheet = sheet.cssRules[index];
        rule.rule = newSheet;
        mountSheet(newSheet, rules, scopedId);
    }
    function mountSupportsRule(sheet, rule, insertIndex = sheet.cssRules.length, scopedId) {
        var supports = rule.supports;
        var rules = rule.children;
        var index = insertSupports(sheet, supports, insertIndex);
        var newSheet = sheet.cssRules[index];
        mountSheet(newSheet, rules, scopedId);
    }
    function mountKeyframesRule(sheet, rule, insertIndex = sheet.cssRules.length) {
        var keyframes = rule.keyframes;
        var rules = rule.children;
        var index = insertKeyframes(sheet, keyframes, insertIndex);
        rule.rule = sheet.cssRules[insertIndex];
        var newSheet = sheet.cssRules[index];
        mountSheet(newSheet, rules);
    }
    function mountKeyframeRule(sheet, rule) {
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
        vnode.instance = parent;
        // 函数式组件没有实例，但也可以拥有状态 , 组件有状态时，会进行自更新 ， 自更新时props和slots内容还是之前传过来的
        processHook("beforeCreate" /* BEFORE_CREATE */, vnode);
        const renderResult = type.call(null, props, children, vnode);
        const next = processVnodePrerender(renderResult);
        processHook("created" /* CREATED */, vnode);
        processHook("beforeMount" /* BEFORE_MOUNT */, vnode);
        patch(vnode.vnode, next, container, anchor, parent);
        processHook("mounted" /* MOUNTED */, vnode);
        vnode.vnode = next; // 保存当前组件的树
    }
    function updateRenderComponent(pVnode, nVnode, container, anchor, parent) {
        const { type, props, children } = nVnode;
        nVnode.instance = parent;
        const renderResult = type.call(null, props, children, nVnode, pVnode); // 传入新旧节点
        const prev = pVnode.vnode;
        const next = processVnodePrerender(renderResult);
        processHook("beforeUpdate" /* BEFORE_UPDATE */, nVnode, pVnode);
        patch(prev, next, container, anchor, parent);
        processHook("updated" /* UPDATED */, nVnode, pVnode);
        nVnode.vnode = next; //
    }
    function unmountRenderComponent(vnode, container, anchor, parent) {
        processHook("beforeUnmount" /* BEFORE_UNMOUNT */, vnode);
        patch(vnode.vnode, null, container, anchor, parent); // 直接卸载节点即可
        processHook("unmounted" /* UNMOUNTED */, vnode);
    }

    function mount(vnode, container, anchor = null, parent = null) {
        switch (vnode.nodeType) {
            case 13 /* HTML_ELEMENT */:
                return mountElement(vnode, container, anchor, parent);
            case 9 /* SVG_ELEMENT */:
                return mountElement(vnode, container, anchor, parent, true);
            case 12 /* TEXT */:
                return mountText(vnode, container, anchor, parent);
            case 10 /* HTML_COMMENT */:
                return insertElement(vnode.el = docCreateComment(vnode.children), container, anchor);
            case 14 /* COMPONENT */:
                return mountComponent(vnode, container, anchor, parent);
            case 15 /* RENDER_COMPONENT */:
                return mountRenderComponent(vnode, container, anchor, parent);
            case 17 /* STYLE */:
                return mountStyleSheet(vnode, container, anchor, parent);
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
        vnode.instance = parent;
        // 1
        processHook("beforeCreate" /* BEFORE_CREATE */, vnode);
        // 2
        const { type, props, children, transition } = vnode;
        // create 
        const el = vnode.el = docCreateElement(type, isSVG);
        el._vnode = vnode;
        // set scoped id
        if (parent?.useScopedStyleSheet || parent?.scopedId) {
            setAttribute(el, parent.scopedId || `scoped-${parent.uid}`);
        }
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
        // mounted 后需不需要拿到子节点元素
        processHook("mounted" /* MOUNTED */, vnode);
        mountChildren(children, el, anchor, parent);
        processHook("childrenMounted" /* CHILDREN_MOUNTED */, vnode);
        return el;
    }
    function mountText(vnode, container, anchor, parent) {
        var el = docCreateText(vnode.children);
        vnode.el = el;
        vnode.instance = parent;
        insertElement(el, container, anchor);
        return el;
    }

    const unmountComponent = (component, container, anchor = null) => {
        const { instance, props } = component;
        const { vnode } = instance;
        processHook("beforeUnmount" /* BEFORE_UNMOUNT */, component);
        // 卸载组件ref
        if (props.ref) {
            instance.parent.refs[props.ref] = null;
        }
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
        const { el, props, transition, instance } = vnode;
        processHook("beforeUnmount" /* BEFORE_UNMOUNT */, vnode);
        if (vnode.children && vnode.nodeType !== 17 /* STYLE */) {
            unmountChildren(vnode.children);
        }
        //为了移除事件侦听器 , 其他属性直接忽略
        updateElementAttributes(el, props, null, instance, false, props && Object.keys(props).filter(isEvent));
        // 移除 ref
        if (props?.ref) {
            instance.refs[props.ref] = null;
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
            switch (prop) {
                case 'ref':
                    // ref component
                    let refs = instance.parent.refs ||= {};
                    if (nValue !== pValue) {
                        pValue && (refs[pValue] = null);
                        nValue && (refs[nValue] = instance);
                    }
                    break;
                case 'class':
                    break;
                case 'style':
                    break;
                default:
                    if (prop.startsWith('_')) {
                        if (prop.startsWith('_modelValue')) {
                            if (pValue !== nValue) {
                                // modelValue绑定的值变了，更新到作用域
                                let modelKey = prop.split('_is_')[1];
                                scope[modelKey] = nValue;
                            }
                        }
                    }
                    else if (isEvent(prop)) {
                        var { event, _arguments, modifiers, filters } = parseEventName(prop);
                        if (emitsOptions[event]) {
                            updateInstanceListeners(instance, event, pValue, nValue, _arguments, modifiers, filters);
                        }
                        else if (isComponentLifecycleHook(event)) {
                            continue;
                        }
                        else {
                            // attrs
                            let attrs = instance.attrs ||= {};
                            attrs[prop] = nValue;
                        }
                    }
                    else if (!propsOptions[prop]) {
                        // attrs
                        let attrs = instance.attrs ||= {};
                        attrs[prop] = nValue;
                    }
                    else {
                        // props
                        const { default: _default, type, validator, required, rename } = propsOptions[prop];
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
                        scope[rename || prop] = nValue;
                        (instance.props ||= {})[prop] = nValue;
                    }
            }
        }
    }

    const updateComponent = (p, n, container, anchor, parent) => {
        n.instance = p.instance;
        updateComponentProps(n.instance, p.props, n.props);
        // 把新节点存到更新方法上，有该节点代表为外部更新，而非自更新
        n.instance.updatingComponentVnode = n;
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
    function sortChildren(p, n) {
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
            if (sameNode && sameNode.node.type === node.type) {
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
    function sortRules(p, n) {
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
            if (sameNode) {
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
        updateSheet(p.children, n.children, sheet);
    };
    function updateSheet(pRules, nRules, sheet, vnode) {
        /*
            与更新dom元素不同，规则中只要patchKey相同就一定会复用,
            更新过程依赖patchkey
            patchkey 作为第一优先级
            其次为nodetype,
            !还是假设key相同的节点顺序一定不会变，
        */
        var { p, n } = sortRules(pRules, nRules);
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
                mountRule(sheet, nRule, cursor);
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
                mountRule(sheet, nRule, cursor);
            }
            else {
                // update
                switch (nRule.nodeType) {
                    case 26 /* STYLE_RULE */:
                        updateStyleRule(pRule, nRule);
                        break;
                    case 22 /* MEDIA_RULE */:
                        updateMediaRule(pRule, nRule);
                        break;
                    case 23 /* SUPPORTS_RULE */:
                        // supports can't update 
                        deleteRule(sheet, cursor);
                        mountRule(sheet, nRule, cursor);
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
        updateSheet(pRules, nRules, rule);
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
                updateElement(p, n, container, anchor, parent);
                break;
            case 9 /* SVG_ELEMENT */:
                updateElement(p, n, container, anchor, parent, true);
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
        if (!n.isDynamic) {
            return;
        }
        if (p.children !== n.children) {
            el.textContent = n.children;
        }
    }
    function updateElement(p, n, container, anchor, parent, isSVG = false) {
        const el = n.el = p.el;
        processHook("beforeUpdate" /* BEFORE_UPDATE */, n, p);
        updateElementAttributes(el, p.props, n.props, parent, isSVG, n.dynamicProps);
        processHook("updated" /* UPDATED */, n, p);
        // updated hooks should be called here ? or after children update
        if (n.shouldUpdateChildren) {
            updateChildren(p.children, n.children, container, anchor, parent);
        }
    }
    function updateChildren(pChildren, nChildren, container, anchor, parent) {
        var { p, n } = sortChildren(pChildren, nChildren);
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
            let nextSibiling = vnodes[i];
            if (!nextSibiling) {
                // 这里可能出现为空是因为排序时增加的空节点
                continue;
            }
            return getLeftEdgeElement(nextSibiling);
        }
    }
    function getLeftEdgeElement(vnode) {
        if (!vnode) {
            return null;
        }
        switch (vnode.nodeType) {
            case 14 /* COMPONENT */:
                return getLeftEdgeElement(vnode.instance.vnode[0]);
            case 15 /* RENDER_COMPONENT */:
                return getLeftEdgeElement(vnode.vnode[0]);
            case 13 /* HTML_ELEMENT */:
            case 9 /* SVG_ELEMENT */:
            case 17 /* STYLE */:
            case 12 /* TEXT */:
            case 10 /* HTML_COMMENT */:
                return vnode.el;
        }
        return null;
    }
    function getEdgeElements(vnode) {
        if (isArray(vnode)) {
            return vnode.map(getEdgeElements).reduce((res, val) => {
                if (!val) {
                    return res;
                }
                else if (isArray(val)) {
                    res = res.concat(val);
                }
                else {
                    res.push(val);
                }
                return res;
            }, []);
        }
        else if (!vnode) {
            return null;
        }
        else {
            switch (vnode.nodeType) {
                case 14 /* COMPONENT */:
                    return getEdgeElements(vnode.instance.vnode);
                case 15 /* RENDER_COMPONENT */:
                    return getEdgeElements(vnode.vnode);
                case 13 /* HTML_ELEMENT */:
                case 9 /* SVG_ELEMENT */:
                case 17 /* STYLE */:
                case 12 /* TEXT */:
                case 10 /* HTML_COMMENT */:
                    return vnode.el;
            }
            return null;
        }
    }

    const patch = (prev, next, container, anchor, parent) => {
        if (!prev) {
            if (next) {
                isArray(next) ? mountChildren(next, container, anchor, parent) : mount(next, container, anchor, parent);
            }
            else {
                return;
            }
        }
        else {
            if (!next) {
                // 卸载当前节点
                isArray(prev) ? unmountChildren(prev) : unmount(prev, container, anchor, parent);
            }
            else {
                if (isArray(prev)) {
                    updateChildren(prev, isArray(next) ? next : [next], container, anchor, parent);
                }
                else {
                    if (isArray(next)) {
                        updateChildren([prev], next, container, anchor, parent);
                    }
                    else {
                        let { type: prevType, patchKey: prevPatchKey } = prev;
                        let { type: nextType, patchKey: nextPatchKey, nodeType } = next;
                        // 文本节点和注释节点直接更新即可
                        if (prevType === nextType && (prevPatchKey === nextPatchKey || nodeType === 12 /* TEXT */ || nodeType === 10 /* HTML_COMMENT */)) {
                            // type相同，nodeType一定相同
                            update(prev, next, container, anchor, parent);
                        }
                        else {
                            unmount(prev, container, anchor, parent);
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
    // 标记一个数据使其不会成为响应式数据
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
        return value && (value["raw" /* RAW */] || value);
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
        // ref 和 set类型 没有depsMap ，只有 deps
        if (!isUndefined(key)) { // 没传 key
            let depsMap = getDepsMap(target);
            let deps = depsMap.get(key);
            if (!deps) {
                deps = new Set();
                depsMap.set(key, deps);
            }
            return deps;
        }
        else {
            let deps = TARGET_MAP.get(target);
            if (!deps) {
                deps = new Set();
                TARGET_MAP.set(target, deps);
            }
            return deps;
        }
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
    const targetObserverSymbol = Symbol('target has changed');
    function trackTargetObserver(target) {
        track(target, targetObserverSymbol);
    }
    function triggerTargetObserver(target) {
        trigger(target, targetObserverSymbol);
    }
    function trigger(target, key) {
        // trigger 中会触发target中的依赖
        if (isUndefined(key)) {
            let deps = getDeps(target);
            // 无depsmap
            runDeps(deps);
        }
        else {
            // 任一key内容改变都会触发这一依赖
            if (key !== targetObserverSymbol) { // 防止递归死循环
                triggerTargetObserver(target);
            }
            triggerTargetKey(target, key);
        }
    }
    function triggerAllDepsMap(target) {
        let depsMap = getDepsMap(target);
        for (let [key, deps] of depsMap) {
            runDeps(deps);
        }
    }
    function triggerTargetKey(target, key) {
        let deps = getDeps(target, key);
        // copy 防止死循环
        runDeps(deps);
    }
    function runDeps(deps) {
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
    //! effect
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
            //todo bug 任一元素变化后 都会触发该依赖
            trackTargetObserver(_target);
            return _target.size;
        },
        // set weakset
        add(value) {
            if (_isReadonly) {
                return;
            }
            var result = _target.add(value);
            trigger(_target, value);
            // 返回set对象本身
            return result;
        },
        // map set
        clear() {
            if (_isReadonly) {
                return;
            }
            // 触发所有依赖
            _target.clear();
            triggerAllDepsMap(_target);
        },
        // map weakmap set weakset
        delete(key) {
            if (_isReadonly) {
                return;
            }
            const result = _target.delete(key);
            if (result) { // 返回为 true 为删除成功
                trigger(_target, key);
            }
            return result;
        },
        // map set
        entries() {
            trackTargetObserver(_target);
            return _target.entries();
        },
        // map set
        forEach(fn) {
            trackTargetObserver(_target);
            return _target.forEach(fn);
        },
        // set map weakset weakmap
        has(key) {
            track(_target, key);
            return _target.has(key);
        },
        // map set
        keys() {
            trackTargetObserver(_target);
            return _target.keys();
        },
        // map set
        values() {
            trackTargetObserver(_target);
            return _target.values();
        },
        // map weakmap
        set(key, value) {
            if (_isReadonly) {
                return;
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
    function normalizeHandlerWithTrack(...args) {
        let result = _target[_key](...args);
        return result;
    }
    function normalizeHandlerWithTrigger(...args) {
        if (_isReadonly) {
            // 只读不能修改
            return;
        }
        // 用数组修改前的key作为触发依赖
        let oldKeys = Object.keys(_target);
        let result = _target[_key](...args);
        [...oldKeys, 'length'].forEach((key) => trigger(_target, key));
        return result;
    }
    const normalizeHandlers = {
        // should track
        includes: normalizeHandlerWithTrack,
        indexOf: normalizeHandlerWithTrack,
        lastIndexOf: normalizeHandlerWithTrack,
        // should trigger
        push: normalizeHandlerWithTrigger,
        pop: normalizeHandlerWithTrigger,
        shift: normalizeHandlerWithTrigger,
        unshift: normalizeHandlerWithTrigger,
        splice: normalizeHandlerWithTrigger
    };
    const specialKeyHandler = {
        [Symbol.iterator]: (value) => {
            // should track ?
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
                    // 所欲响应式数据都会有此标记
                    return true;
            }
            if (isCollection) {
                // collection methods reset
                if (hasOwn(collectionHandlers, key) && key in target) {
                    return collectionHandlers[key];
                }
            }
            else if (isProxyKey(target, key)) {
                //  可收集属性， 是自身属性时才会收集 , readonly 不会收集
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
            else if (isArray(target) && hasOwn(normalizeHandlers, key)) {
                // 数组重写方法
                return normalizeHandlers[key];
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
        // Object.assign will call this
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

    const ref = (value = null, options) => new Ref(value, options);
    const createRefValueSetter = (ref) => (newValue) => ref.value = newValue;
    let defaultRefOptions = {
        sensitive: false,
        shallow: false,
        onSet: null,
        onGet: null
    };
    class Ref {
        [ReactiveTypeSymbol] = true; // 标记为响应式数据
        ["isRef" /* IS_REF */] = true; // 标记为ref
        // 注册set和get的回调函数
        onSet;
        onGet;
        oldValue; // 保存旧值
        _value; // 保存当前值
        sensitive; // 该属性为true时 , 当值设置为当前值时也会触发响应
        shallow; // 深层数据是否为响应式
        constructor(value, options = defaultRefOptions) {
            this.sensitive = options.sensitive;
            this.shallow = options.shallow;
            this.onSet = options.onSet;
            this._value = value;
        }
        get value() {
            // track
            if (this.onGet) {
                this.onGet();
            }
            track(this);
            let value = this._value;
            return (!this.shallow && isProxyType(value)) ? reactive(value) : value;
        }
        set value(newValue) {
            // 当 sensitive ，为true时 ， 当值试图从一个值变为另一个相同的值时，即使基本类型或引用类型全等，也会视为一次改变，触发依赖
            if (this._value === newValue && !this.sensitive) {
                return;
            }
            this.oldValue = this._value;
            this._value = newValue;
            if (this.onSet) {
                this.onSet();
            }
            // trigger
            trigger(this);
        }
    }
    // 清除所有与当前ref相关的依赖
    const cleaarRefDeps = (ref) => {
        getDeps(ref).clear();
    };

    const computed = (getter) => new ComputedRef(getter);
    const isComputed = (value) => value && value["isComputed" /* IS_COMPUTED */];
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
                    trigger(this);
                }
            });
        }
        get computedValue() {
            this.shouldCompute = false;
            this.oldValue = this.cacheValue;
            return this.cacheValue = this.computedEffect.run();
        }
        get value() {
            track(this);
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
        const deps = getDeps(rawData, targetObserverSymbol);
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
        // 当侦测一个reactive data时，回调中不应该再设置该属性的值否则会死循环
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
            let deps = getDeps(target, targetObserverSymbol);
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
            let oldValueDeps = getDeps(oldValue, targetObserverSymbol);
            oldValueDeps.delete(cb);
            targets.delete(oldValue);
            // 增加新绑定值的依赖
            if (targets.has(newValue)) {
                // 此时是将观察对象中的值重新赋值给该对象的身上，不需要添加依赖
                return;
            }
            if (isProxyType(newValue)) {
                let newValueDeps = getDeps(newValue, targetObserverSymbol);
                newValueDeps.add(cb);
                targets.add(newValue);
            }
        });
        // unwatch
        return () => {
            unSet();
            targets.forEach((target) => {
                let deps = getDeps(target, targetObserverSymbol);
                deps.delete(cb);
            });
        };
    }
    // 指定侦测的目标和key值
    function watchTargetKey(reactiveTarget, key, callback) {
        if (!isReactive(reactiveTarget)) {
            return;
        }
        let target = toRaw(reactiveTarget);
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
        const deps = getDeps(ref);
        const watchEffect = () => callback.call(null, ref.value, ref.oldValue);
        deps.add(watchEffect);
        // unwatch
        if (isComputed(ref)) {
            ref.value;
        }
        return () => deps.delete(watchEffect);
    }

    class ReactiveBoolean extends Ref {
        constructor(value) {
            super(value);
        }
        toggle() {
            return this.value = !this.value;
        }
        toTrue() {
            return this.value = true;
        }
        toFalse() {
            return this.value = false;
        }
    }
    function useBoolean(value = true) {
        return new ReactiveBoolean(value);
    }

    const hexColorRE = /^#([0-9a-fA-F]{6})$/;
    const shortHexColorRE = /^#([0-9a-fA-F]{3})$/;
    function isHexColor(color) {
        return hexColorRE.test(color.trim());
    }
    function isShortHexColor(color) {
        return shortHexColorRE.test(color);
    }
    const rgbColorRE = /^rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)$/;
    const hslColorRE = /hsl\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})%\s*,\s*([0-9]{1,3})%\s*\)/;
    function isHslColor(color) {
        return hslColorRE.test(color);
    }
    function parseHsl(color) {
        let [_, hue, saturation, lightness] = hslColorRE.exec(color);
        return {
            hue, saturation, lightness
        };
    }
    function parseRgb(color) {
        let [_, red, green, blue] = rgbColorRE.exec(color);
        return {
            red,
            green,
            blue
        };
    }
    function shortHexToHex(color) {
        return `#${color[1].repeat(2) + color[2].repeat(2) + color[3].repeat(2)}`;
    }
    function isRgbColor(color) {
        return rgbColorRE.test(color);
    }
    function parseHex(hexColor) {
        hexColor = hexColor.trim();
        let isShort = hexColor.length === 4;
        return {
            red: toDec(isShort ? hexColor[1] : hexColor.slice(1, 3)),
            green: toDec(isShort ? hexColor[2] : hexColor.slice(3, 5)),
            blue: toDec(isShort ? hexColor[3] : hexColor.slice(5, 7)),
        };
    }
    function normalizeToHexColor(color) {
        if (colors[color]) {
            return colors[color];
        }
        else if (isHexColor(color)) {
            return color;
        }
        else if (isShortHexColor(color)) {
            return shortHexToHex(color);
        }
        else if (isRgbColor(color)) {
            return rgbToHex(color);
        }
        else if (isHslColor(color)) {
            return hslToHex(color);
        }
        else {
            // 默认
            return '#000000';
        }
    }
    function rgbToHex(color) {
        let rgb = parseRgb(color);
        return baseRgbToHex(rgb);
    }
    function baseRgbToHex({ red, green, blue }) {
        return '#' + toHex(red) + toHex(green) + toHex(blue);
    }
    function hslToHex(color) {
        let hsl = parseHsl(color);
        let rgb = parseHslToRgb(hsl);
        return baseRgbToHex(rgb);
    }
    function hexToRgb(color) {
        let { red, green, blue } = parseHex(color);
        return `rgb(${red},${green},${blue})`;
    }
    function hexToHsl(color) {
        let rgb = parseHex(color);
        let { hue, saturation, lightness } = parseRgbToHsl(rgb);
        return `hsl(${hue},${saturation}%,${lightness}%)`;
    }
    const toHex = (num) => {
        let hex = Number(num).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };
    const toDec = (num) => parseInt(String(num), 16);
    function parseHslToRgb(hslColor) {
        let { hue, saturation, lightness } = hslColor;
        hue = hue / 360;
        saturation = saturation / 100;
        lightness = lightness / 100;
        var red, green, blue;
        if (saturation == 0) {
            red = green = blue = lightness;
        }
        else {
            function t(p, q, t) {
                if (t < 0)
                    t += 1;
                if (t > 1)
                    t -= 1;
                if (t < 1 / 6)
                    return p + (q - p) * 6 * t;
                if (t < 1 / 2)
                    return q;
                if (t < 2 / 3)
                    return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            }
            var q = lightness < 0.5 ? lightness * (1 + saturation) : lightness + saturation - lightness * saturation;
            var p = 2 * lightness - q;
            red = t(p, q, hue + 1 / 3);
            green = t(p, q, hue);
            blue = t(p, q, hue - 1 / 3);
        }
        return {
            red: Math.round(red * 255),
            green: Math.round(green * 255),
            blue: Math.round(blue * 255)
        };
    }
    function parseRgbToHsl(rgbColor) {
        let { red, green, blue } = rgbColor;
        red = red / 255;
        green = green / 255;
        blue = blue / 255;
        let max = Math.max(red, green, blue);
        let min = Math.min(red, green, blue);
        let hue, saturation, lightness = 0.5 * (max + min);
        if (max === min) {
            hue = 0;
        }
        if (max === red) {
            if (green >= blue) {
                hue = 60 * ((green - blue) / (max - min)) + 0;
            }
            else {
                hue = 60 * ((green - blue) / (max - min)) + 360;
            }
        }
        if (max === green) {
            hue = 60 * ((blue - red) / (max - min)) + 120;
        }
        if (max === blue) {
            hue = 60 * ((red - green) / (max - min)) + 240;
        }
        if (lightness === 0 || max === min) {
            saturation = 0;
        }
        else if (lightness > 0 && lightness <= 0.5) {
            saturation = (max - min) / (2 * lightness);
        }
        else {
            saturation = (max - min) / (2 - 2 * lightness);
        }
        return {
            hue: Math.floor(hue),
            saturation: Math.round(saturation * 100),
            lightness: Math.round(lightness * 100),
        };
    }
    function parseColor(color) {
        let rgb, hsl;
        if (colors[color]) {
            rgb = parseHex(colors[color]);
            hsl = parseRgbToHsl(rgb);
        }
        else if (isHexColor(color)) {
            rgb = parseHex(color);
            hsl = parseRgbToHsl(rgb);
        }
        else if (isShortHexColor(color)) {
            rgb = parseHex(color);
            hsl = parseRgbToHsl(rgb);
        }
        else if (isRgbColor(color)) {
            rgb = parseRgb(color);
            hsl = parseRgbToHsl(rgb);
        }
        else if (isHslColor(color)) {
            hsl = parseHsl(color);
            rgb = parseHslToRgb(hsl);
        }
        else {
            return null;
        }
        let { red, blue, green } = rgb;
        let { hue, saturation, lightness } = hsl;
        return {
            red,
            blue,
            green,
            hue,
            saturation,
            lightness
        };
    }
    // always return hex
    function lighten(color, value = 10) {
        let { hue, saturation, lightness } = parseColor(color);
        lightness += value;
        let rgb = parseHslToRgb({ hue, saturation, lightness });
        return baseRgbToHex(rgb);
    }
    function darken(color, value = 10) {
        let { hue, saturation, lightness } = parseColor(color);
        lightness -= value;
        let rgb = parseHslToRgb({ hue, saturation, lightness });
        return baseRgbToHex(rgb);
    }
    function saturate(color, value = 10) {
        let { hue, saturation, lightness } = parseColor(color);
        saturation += value;
        let rgb = parseHslToRgb({ hue, saturation, lightness });
        return baseRgbToHex(rgb);
    }
    function desaturate(color, value = 10) {
        let { hue, saturation, lightness } = parseColor(color);
        saturation -= value;
        let rgb = parseHslToRgb({ hue, saturation, lightness });
        return baseRgbToHex(rgb);
    }
    function opacity(color, opacity) {
        // always return rgba
        let { red, green, blue } = parseColor(color);
        return `rgba(${red},${green},${blue},${opacity})`;
    }
    // name to hex
    const colors = {
        'aliceblue': '#f0f8ff',
        'antiquewhite': '#faebd7',
        'aqua': '#00ffff',
        'aquamarine': '#7fffd4',
        'azure': '#f0ffff',
        'beige': '#f5f5dc',
        'bisque': '#ffe4c4',
        'black': '#000000',
        'blanchedalmond': '#ffebcd',
        'blue': '#0000ff',
        'blueviolet': '#8a2be2',
        'brown': '#a52a2a',
        'burlywood': '#deb887',
        'cadetblue': '#5f9ea0',
        'chartreuse': '#7fff00',
        'chocolate': '#d2691e',
        'coral': '#ff7f50',
        'cornflowerblue': '#6495ed',
        'cornsilk': '#fff8dc',
        'crimson': '#dc143c',
        'cyan': '#00ffff',
        'darkblue': '#00008b',
        'darkcyan': '#008b8b',
        'darkgoldenrod': '#b8860b',
        'darkgray': '#a9a9a9',
        'darkgrey': '#a9a9a9',
        'darkgreen': '#006400',
        'darkkhaki': '#bdb76b',
        'darkmagenta': '#8b008b',
        'darkolivegreen': '#556b2f',
        'darkorange': '#ff8c00',
        'darkorchid': '#9932cc',
        'darkred': '#8b0000',
        'darksalmon': '#e9967a',
        'darkseagreen': '#8fbc8f',
        'darkslateblue': '#483d8b',
        'darkslategray': '#2f4f4f',
        'darkslategrey': '#2f4f4f',
        'darkturquoise': '#00ced1',
        'darkviolet': '#9400d3',
        'deeppink': '#ff1493',
        'deepskyblue': '#00bfff',
        'dimgray': '#696969',
        'dimgrey': '#696969',
        'dodgerblue': '#1e90ff',
        'firebrick': '#b22222',
        'floralwhite': '#fffaf0',
        'forestgreen': '#228b22',
        'fuchsia': '#ff00ff',
        'gainsboro': '#dcdcdc',
        'ghostwhite': '#f8f8ff',
        'gold': '#ffd700',
        'goldenrod': '#daa520',
        'gray': '#808080',
        'grey': '#808080',
        'green': '#008000',
        'greenyellow': '#adff2f',
        'honeydew': '#f0fff0',
        'hotpink': '#ff69b4',
        'indianred': '#cd5c5c',
        'indigo': '#4b0082',
        'ivory': '#fffff0',
        'khaki': '#f0e68c',
        'lavender': '#e6e6fa',
        'lavenderblush': '#fff0f5',
        'lawngreen': '#7cfc00',
        'lemonchiffon': '#fffacd',
        'lightblue': '#add8e6',
        'lightcoral': '#f08080',
        'lightcyan': '#e0ffff',
        'lightgoldenrodyellow': '#fafad2',
        'lightgray': '#d3d3d3',
        'lightgrey': '#d3d3d3',
        'lightgreen': '#90ee90',
        'lightpink': '#ffb6c1',
        'lightsalmon': '#ffa07a',
        'lightseagreen': '#20b2aa',
        'lightskyblue': '#87cefa',
        'lightslategray': '#778899',
        'lightslategrey': '#778899',
        'lightsteelblue': '#b0c4de',
        'lightyellow': '#ffffe0',
        'lime': '#00ff00',
        'limegreen': '#32cd32',
        'linen': '#faf0e6',
        'magenta': '#ff00ff',
        'maroon': '#800000',
        'mediumaquamarine': '#66cdaa',
        'mediumblue': '#0000cd',
        'mediumorchid': '#ba55d3',
        'mediumpurple': '#9370d8',
        'mediumseagreen': '#3cb371',
        'mediumslateblue': '#7b68ee',
        'mediumspringgreen': '#00fa9a',
        'mediumturquoise': '#48d1cc',
        'mediumvioletred': '#c71585',
        'midnightblue': '#191970',
        'mintcream': '#f5fffa',
        'mistyrose': '#ffe4e1',
        'moccasin': '#ffe4b5',
        'navajowhite': '#ffdead',
        'navy': '#000080',
        'oldlace': '#fdf5e6',
        'olive': '#808000',
        'olivedrab': '#6b8e23',
        'orange': '#ffa500',
        'orangered': '#ff4500',
        'orchid': '#da70d6',
        'palegoldenrod': '#eee8aa',
        'palegreen': '#98fb98',
        'paleturquoise': '#afeeee',
        'palevioletred': '#d87093',
        'papayawhip': '#ffefd5',
        'peachpuff': '#ffdab9',
        'peru': '#cd853f',
        'pink': '#ffc0cb',
        'plum': '#dda0dd',
        'powderblue': '#b0e0e6',
        'purple': '#800080',
        'rebeccapurple': '#663399',
        'red': '#ff0000',
        'rosybrown': '#bc8f8f',
        'royalblue': '#4169e1',
        'saddlebrown': '#8b4513',
        'salmon': '#fa8072',
        'sandybrown': '#f4a460',
        'seagreen': '#2e8b57',
        'seashell': '#fff5ee',
        'sienna': '#a0522d',
        'silver': '#c0c0c0',
        'skyblue': '#87ceeb',
        'slateblue': '#6a5acd',
        'slategray': '#708090',
        'slategrey': '#708090',
        'snow': '#fffafa',
        'springgreen': '#00ff7f',
        'steelblue': '#4682b4',
        'tan': '#d2b48c',
        'teal': '#008080',
        'thistle': '#d8bfd8',
        'tomato': '#ff6347',
        'turquoise': '#40e0d0',
        'violet': '#ee82ee',
        'wheat': '#f5deb3',
        'white': '#ffffff',
        'whitesmoke': '#f5f5f5',
        'yellow': '#ffff00',
        'yellowgreen': '#9acd32'
    };

    function useDate(...dateArgs) {
        return new DateRef(new Date(...dateArgs));
    }
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    class DateRef extends Ref {
        constructor(date) {
            super(date, { sensitive: true });
        }
        clone() {
            return useDate(this._value); // _value 不会收集依赖
        }
        get(key) {
            return Reflect.get(this, key).call(this);
        }
        year(setYear) {
            if (isUndefined(setYear)) {
                // getter
                return this.value.getFullYear();
            }
            else {
                // 不应该收集依赖
                this._value.setFullYear(Number(setYear));
                // use sensitive force trigger
                this.value = this.value;
                return this;
            }
        }
        month(setMonth) {
            if (isUndefined(setMonth)) {
                // getter
                return this.value.getMonth() + 1;
            }
            else {
                // 不应该收集依赖
                this._value.setMonth(Number(setMonth) - 1);
                // use sensitive force trigger
                this.value = this.value;
                return this;
            }
        }
        // monthday
        date(setDate) {
            if (isUndefined(setDate)) {
                // getter
                return this.value.getDate();
            }
            else {
                // 不应该收集依赖
                this._value.setDate(Number(setDate));
                // use sensitive force trigger
                this.value = this.value;
                return this;
            }
        }
        // weekday
        day(setDay) {
            if (isUndefined(setDay)) {
                // getter
                return this.value.getDay();
            }
            else {
                debugger;
            }
        }
        hour(setHour) {
            if (isUndefined(setHour)) {
                // getter
                return this.value.getHours();
            }
            else {
                // 不应该收集依赖
                this._value.setHours(Number(setHour));
                // use sensitive force trigger
                this.value = this.value;
                return this;
            }
        }
        minute(setMinutes) {
            if (isUndefined(setMinutes)) {
                // getter
                return this.value.getMinutes();
            }
            else {
                // 不应该收集依赖
                this._value.setMinutes(Number(setMinutes));
                // use sensitive force trigger
                this.value = this.value;
                return this;
            }
        }
        second(setSecond) {
            if (isUndefined(setSecond)) {
                // getter
                return this.value.getSeconds();
            }
            else {
                // 不应该收集依赖
                this._value.setSeconds(Number(setSecond));
                // use sensitive force trigger
                this.value = this.value;
                return this;
            }
        }
        milliSecond(setMilliseconds) {
            if (isUndefined(setMilliseconds)) {
                // getter
                return this.value.getMilliseconds();
            }
            else {
                // 不应该收集依赖
                this._value.setMilliseconds(Number(setMilliseconds));
                // use sensitive force trigger
                this.value = this.value;
                return this;
            }
        }
        format(template = 'YYYY-MM-DD', customKeywords = emptyObject) {
            let w = customKeywords.weekdays || weekdays;
            let m = customKeywords.months || months;
            return template.replace(dateFormatRE, (capture) => {
                switch (capture) {
                    case "YYYY" /* YEAR */:
                        return this.year();
                    case "YY" /* YEAR_2D */:
                        return String(this.year()).slice(2);
                    case "M" /* MONTH */:
                        return this.month();
                    case "MM" /* MONTH_2D */:
                        return padZero(this.month());
                    case "MMM" /* MONTH_SHORT_NAME */:
                        return m[this.month() - 1].slice(0, 3);
                    case "MMMM" /* MONTH_FULL_NAME */:
                        return m[this.month() - 1];
                    case "D" /* DATE */:
                        return this.date();
                    case "DD" /* DATE_2D */:
                        return padZero(this.date());
                    case "h" /* HOUR_12 */:
                        // 等于 12 应该是 12 点还是 0 点
                        var hour = this.hour();
                        return hour > 12 ? hour - 12 : hour;
                    case "hh" /* HOUR_12_2D */:
                        var hour = this.hour();
                        return padZero(hour > 12 ? hour - 12 : hour);
                    case "H" /* HOUR_24 */:
                        return this.hour();
                    case "HH" /* HOUR_24_2D */:
                        return padZero(this.hour());
                    case "m" /* MINUTE */:
                        return this.minute();
                    case "mm" /* MINUTE_2D */:
                        return padZero(this.minute());
                    case "s" /* SECOND */:
                        return this.second();
                    case "ss" /* SECOND_2D */:
                        return padZero(this.second());
                    case "SSS" /* MILLISECOND */:
                        return this.milliSecond();
                    case "SS" /* MILLISECOND_10 */:
                        return String(this.milliSecond()).slice(0, 2);
                    case "S" /* MILLISECOND_100 */:
                        return String(this.milliSecond()).slice(0, 1);
                    case "W" /* WEEKDAY */:
                        return this.day();
                    case "WWW" /* WEEKDAY_FULL_NAME */:
                        return w[this.day()];
                    case "WW" /* WEEKDAY_SHORT_NAME */:
                        return w[this.day()].slice(0, 3);
                    default:
                        return '?';
                }
            });
        }
    }
    const dateFormatRE = /Y{1,4}|M{1,4}|D{1,2}|H{1,2}|h{1,2}|m{1,2}|s{1,2}|S{1,3}|A|a|W{1,3}/g;
    function padZero(source, expectLength = 2) {
        // 期待长度一定要大于目标长度
        return '0'.repeat(expectLength - String(source).length) + source;
    }

    class ReactiveNumber extends Ref {
        constructor(value) {
            super(value);
        }
        plus(value = 1) {
            return this.value += value;
        }
        minus(value = 1) {
            return this.value -= value;
        }
        multiply(value = 1) {
            return this.value *= value;
        }
        devide(value = 1) {
            return this.value /= value;
        }
    }
    function useNumber(value) {
        return new ReactiveNumber(value);
    }

    class ReactiveString extends Ref {
        constructor(value) {
            super(value);
        }
        concat(...values) {
            return this.value.concat(...values);
        }
        padEnd(targetLength, padString) {
            return this.value = this.value.padEnd(targetLength, padString);
        }
    }
    function useString(value = 'hello world') {
        return new ReactiveString(value);
    }

    function usePromise(promise) {
        promise = isPromise(promise) ? promise : new Promise(promise);
        return new PromiseRef(promise);
    }
    class PromiseRef extends Ref {
        resolved = false;
        rejected = false;
        constructor(promise) {
            super(null);
            promise.then((result) => {
                this.value = result;
                this.resolved = true;
            }).catch((err) => {
                this.value = null; //
                this.rejected = true;
            });
        }
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
    // 清除当前组件引用
    function clearCurrentInstance() {
        exports.currentInstance = null;
    }
    function getCurrentScope() {
        return getCurrentInstance().scope;
    }
    function getCurrentRenderScope() {
        return getCurrentInstance().renderScope;
    }
    function setScopeData(scope, data) {
        if (!data) {
            return;
        }
        if (isObject(data)) {
            for (let key in data) {
                // data 存在时应该警告
                let value = data[key];
                // 挂载到实例的promise会自动请求
                if (isPromise(value)) {
                    value.then((result) => {
                        scope[key] = result;
                    });
                }
                else {
                    scope[key] = value;
                }
            }
        }
        else if (isPromise(data)) {
            // async create
            data.then((result) => {
                setScopeData(scope, result);
            });
        }
    }
    function mountComponent(vnode, container, anchor, parent) {
        const instance = createComponentInstance(vnode.type, parent);
        vnode.instance = instance;
        instance.componentVnode = vnode;
        const { scope, renderScope } = instance;
        processHook("beforeCreate" /* BEFORE_CREATE */, vnode);
        // create
        setCurrentInstance(instance);
        // 初次创建前应该把 slot props 方法等挂载到作用域上
        // 先挂载props ，这样 create hook中才能访问
        mountComponentProps(instance, vnode.props);
        instance.slots = vnode.children;
        instance.props = reactive(vnode.props);
        // 处理mixins中的create钩子 ，rootCreate后处理 ，优先级更高 , 在处理props后处理，保证钩子中能访问到props等数据
        const createResults = callHook("create" /* CREATE */, instance, { binding: scope }, scope);
        // 注入 mixins 状态
        createResults?.forEach((data) => setScopeData(scope, data));
        // 组件根初始化方法
        /*
            render 优先级
            create 返回的渲染函数  > render > template , 暂时不支持无状态组件
        */
        let render = instance.render ? instance.render.bind(renderScope) : instance.createRender ? instance.createRender(renderMethods) : emptyFunction;
        instance.render = render;
        setCurrentInstance(null);
        processHook("created" /* CREATED */, vnode);
        // component update
        // component update fn
        function update() {
            const { isMounted, vnode: pVnode, componentVnode, updatingComponentVnode, render } = instance;
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
            nVnode = processVnodePrerender(nVnode);
            instance.renderingVnode = nVnode;
            processHook(isMounted ? "beforeUpdate" /* BEFORE_UPDATE */ : "beforeMount" /* BEFORE_MOUNT */, nComponentVnode, pComponentVnode);
            callHook("beforePatch" /* BEFORE_PATCH */, instance, null, nVnode, pVnode);
            patch(pVnode, nVnode, container, anchor, instance);
            instance.vnode = nVnode;
            instance.isMounted = true;
            instance.renderingVnode = null;
            processHook(isMounted ? "updated" /* UPDATED */ : "mounted" /* MOUNTED */, nComponentVnode, pComponentVnode);
        }
        instance.update = update;
        const rednerEffect = createReactiveEffect(update, queueJob);
        // 手动渲染
        instance.renderEffect = rednerEffect;
        rednerEffect.run();
        return instance;
    }

    const COMPONENT_TYPE = Symbol('ComponentType');
    function createComponent(type, props, children, key = uid(), dynamicProps = null) {
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
        // 记录组件被使用多少次
        if (type.count === undefined) {
            type.count = 0;
        }
        else {
            type.count++;
        }
        return {
            uid: uid(),
            nodeType: componentFlag,
            type,
            props: normalizeProps(props),
            children,
            key,
            dynamicProps
        };
    }
    function createElement(type, props, children, key = uid(), dynamicProps = null, shouldUpdateChildren = true) {
        return {
            nodeType: 13 /* HTML_ELEMENT */,
            type,
            props: normalizeProps(props),
            children,
            key,
            shouldUpdateChildren,
            dynamicProps
        };
    }
    function createSVGElement(type, props, children, key = uid(), dynamicProps = null, shouldUpdateChildren = true) {
        return {
            nodeType: 9 /* SVG_ELEMENT */,
            type,
            props: normalizeProps(props),
            children,
            key,
            shouldUpdateChildren,
            dynamicProps,
        };
    }
    const Text = Symbol('Text');
    // the key is for other node
    function createText(children, key = uid(), isDynamic = false) {
        return {
            nodeType: 12 /* TEXT */,
            children,
            key,
            isDynamic,
            type: Text
        };
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
    function createFragment(children, key = uid()) {
        return {
            nodeType: 1 /* FRAGMENT */,
            children,
            key
        };
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

    let textModifiers = {
        lowerCase: (str) => str.toLowerCase(),
        upperCase: (str) => str.toUpperCase(),
    };
    function defineTextModifier(name, handler) {
        textModifiers[name] = handler;
    }
    function display(data, modifier) {
        if (data === undefined || data === null) {
            return '';
        }
        if (isObject(data) || isArray(data)) {
            data = JSON.stringify(data);
        }
        else {
            data = String(data);
        }
        if (modifier && textModifiers[modifier]) {
            data = textModifiers[modifier](data);
        }
        return data;
    }

    function getComponent(name) {
        let currentInstance = getCurrentInstance();
        name = String(name);
        if (name === 'self') { // 内部提供的self标签，用于递归自身
            return currentInstance.options;
        }
        let components = currentInstance.components;
        let globalComponents = getCurrentApp().components;
        // 支持组件首字母大写
        var component = components?.[name] || components?.[initialUpperCase(name)] || globalComponents?.[name] || globalComponents?.[initialUpperCase(name)];
        if (!component) {
            error(`cant find component ${name}`);
        }
        return component;
    }
    function getDirective(name) {
        let instancedirectives = getCurrentInstance().directives;
        let appdirectives = getCurrentApp().directives;
        // 支持组件首字母大写
        name = String(name);
        var directive = instancedirectives?.[name] || instancedirectives?.[initialUpperCase(name)] || appdirectives?.[name] || appdirectives?.[initialUpperCase(name)];
        if (!directive) {
            error(`can't find directive ${name}`);
        }
        return directive;
    }

    function findStringFromArray(str, arr) {
        let find = false;
        for (let item of arr) {
            if (isArray(item)) {
                return findStringFromArray(str, item);
            }
            else if (isString(item)) {
                if (str === item) {
                    find = true;
                    break;
                }
            }
        }
        return find;
    }
    let jsKeyWords = [
        'true',
        'false'
    ];
    class Expression {
        // 记录表达式中用到的变量
        variables = [];
        expression;
        scope = '_'; // 默认值
        constructor(expression) {
            this.expression = expression;
        }
        scopeStack = [];
        pushScope(scope) {
            this.scopeStack.push(scope);
        }
        popScope() {
            this.scopeStack.pop();
        }
        isVariable(variable) {
            return !findStringFromArray(variable, this.scopeStack) && !jsKeyWords.includes(variable);
        }
        setScope(variable, scope = this.scope) {
            if (this.isVariable(variable)) {
                this.variables.push(variable);
                return scope + '.' + variable;
            }
            else {
                return variable;
            }
        }
        scopedExpression(scoped = '_') {
            this.scope = scoped;
            return expressionWithScope(this.expression, this);
        }
    }
    function createExpression(expression) {
        return new Expression(expression);
    }
    let isJsVarStart = (str) => /^[\$_a-zA-Z]/.test(str);
    const jsVarRE = /[\$_A-Za-z][A-Za-z0-9]*/;
    function expressionWithScope(expression, expressionContext) {
        let processingExpression = expression || '';
        let withScopedExpression = '';
        let lastIsVar = false; // 记录上一个处理的是不是变量
        while (processingExpression = processingExpression.trim()) {
            let firstLetter = processingExpression[0];
            switch (firstLetter) {
                case '"':
                case "'":
                    // string
                    let stringEnd = processingExpression.indexOf(firstLetter, 1);
                    let stringContent = processingExpression.slice(0, stringEnd + 1);
                    withScopedExpression += stringContent;
                    processingExpression = processingExpression.slice(stringEnd + 1);
                    lastIsVar = false;
                    break;
                case '`':
                    let templateStringEnd = findTemplateStringEnd(processingExpression);
                    let templateString = processingExpression.slice(0, templateStringEnd + 1);
                    let withScopedTemplateString = templateStringWithScope(templateString, expressionContext);
                    withScopedExpression += withScopedTemplateString;
                    processingExpression = processingExpression.slice(templateStringEnd + 1);
                    lastIsVar = false;
                    break;
                case '{':
                    // object
                    let objectEnd = findNextCodeBlockClosingPosition(processingExpression);
                    let object = processingExpression.slice(0, objectEnd + 1);
                    let withScopedObject = objectExpressionWithScope(object, expressionContext);
                    withScopedExpression += withScopedObject;
                    processingExpression = processingExpression.slice(objectEnd + 1);
                    lastIsVar = false;
                    break;
                case '[':
                    if (lastIsVar) {
                        // dynamic object key
                        let dynamicObjectKeyEnd = findNextCodeBlockClosingPosition(processingExpression);
                        let dynamicObjectKey = processingExpression.slice(1, dynamicObjectKeyEnd);
                        let withScopedDynamicObjectKey = expressionWithScope(dynamicObjectKey, expressionContext);
                        withScopedExpression += `[${withScopedDynamicObjectKey}]`;
                        processingExpression = processingExpression.slice(dynamicObjectKeyEnd + 1);
                        lastIsVar = true;
                    }
                    else {
                        // array
                        let arrayEnd = findNextCodeBlockClosingPosition(processingExpression);
                        let array = processingExpression.slice(0, arrayEnd + 1);
                        let withScopedArray = arrayExpressionWithScope(array, expressionContext);
                        withScopedExpression += withScopedArray;
                        processingExpression = processingExpression.slice(arrayEnd + 1);
                        lastIsVar = false;
                    }
                    break;
                case '(':
                    let blockEnd = findNextCodeBlockClosingPosition(processingExpression);
                    let blockContent = processingExpression.slice(1, blockEnd);
                    let restContent = processingExpression.slice(blockEnd + 1);
                    if (lastIsVar) {
                        // 函数调用  , 参数也应该设置作用域
                        withScopedExpression += `(${listExpressionWithScope(blockContent, expressionContext)})`;
                        processingExpression = processingExpression.slice(blockEnd + 1);
                        lastIsVar = true;
                    }
                    else if (restContent.trim().startsWith('=>')) {
                        // 箭头函数
                        let args = extractFunctionArgs(blockContent); // 箭头函数的形参
                        let fnContent = restContent.trim().slice(2).trim();
                        expressionContext.pushScope(args);
                        let withScopedFnContent = expressionWithScope(fnContent, expressionContext);
                        expressionContext.popScope();
                        withScopedExpression += `(${args.join(',')})=>${withScopedFnContent}`;
                        processingExpression = '';
                    }
                    else {
                        // 当做普通结构体处理
                        withScopedExpression += `(${expressionWithScope(blockContent, expressionContext)})`;
                        processingExpression = processingExpression.slice(blockEnd + 1);
                    }
                    break;
                case '.':
                    let isObjectKey = isJsVarStart(processingExpression.slice(1));
                    if (lastIsVar && isObjectKey) {
                        let jsVar = jsVarRE.exec(processingExpression)[0];
                        // 忽略该字符串
                        withScopedExpression += `.${jsVar}`;
                        processingExpression = processingExpression.slice(jsVar.length + 1);
                        lastIsVar = true;
                    }
                    else {
                        withScopedExpression += '.';
                        processingExpression = processingExpression.slice(1);
                        lastIsVar = false;
                    }
                    break;
                default:
                    if (isJsVarStart(processingExpression)) {
                        // 合理的变量名开头
                        let jsVar = jsVarRE.exec(processingExpression)[0];
                        let restContent = processingExpression.slice(jsVar.length);
                        if (restContent.trim().startsWith('=>')) {
                            // array function
                            // 没有括号的情况只能有一个参数
                            let arg = jsVar;
                            let fnContent = restContent.trim().slice(2).trim();
                            expressionContext.pushScope(arg);
                            let withScopedFnContent = expressionWithScope(fnContent, expressionContext);
                            expressionContext.popScope();
                            withScopedExpression += `${jsVar}=>${withScopedFnContent}`;
                            processingExpression = ''; // 直接介素
                            lastIsVar = false;
                        }
                        else {
                            // 普通的 js变量
                            withScopedExpression += expressionContext.setScope(jsVar);
                            processingExpression = processingExpression.slice(jsVar.length);
                            lastIsVar = true;
                        }
                    }
                    else {
                        // 其他特殊符号
                        withScopedExpression += processingExpression.slice(0, 1);
                        processingExpression = processingExpression.slice(1);
                    }
                    break;
            }
        }
        return withScopedExpression;
    }
    function extractFunctionArgs(argsExpression) {
        if (!argsExpression || !argsExpression.trim()) {
            return [];
        }
        let commaList = findFirstLevelComma(argsExpression);
        let items = devideString(argsExpression, commaList);
        let args = [];
        items.forEach((item) => {
            item = item.trim();
            if (item.startsWith('{')) {
                item.slice(1, -1).split(',').forEach((_item) => {
                    let deArgs = _item.split(':'); // rename args
                    if (deArgs.length === 1) {
                        args.push(deArgs[0]);
                    }
                    else {
                        args.push(deArgs[1]);
                    }
                });
            }
            else {
                args.push(item);
            }
        });
        return args;
    }
    function objectExpressionWithScope(objectExpression, expressionContext) {
        objectExpression = objectExpression.trim();
        let objectContent = objectExpression.slice(1, objectExpression.length - 1);
        let positions = findFirstLevelComma(objectContent);
        // 去除首尾空格
        let objectTokens = devideString(objectContent, positions).map((token) => token.trim()).filter(Boolean);
        let withScopedKeyValue = [];
        objectTokens.forEach((keyValue) => {
            if (keyValue.startsWith('[')) {
                // dynamic object key , dynamicKey 一定没有简写
                let dynamicKeyEndPosition = findNextCodeBlockClosingPosition(keyValue);
                let dynamicKey = keyValue.slice(1, dynamicKeyEndPosition); // 去掉中括号 
                let withScopedDynamicKey = '[' + expressionWithScope(dynamicKey, expressionContext) + ']';
                let value = keyValue.slice(dynamicKeyEndPosition + 1).trim().slice(1); // 去掉最开始冒号
                let withScopedValue = expressionWithScope(value, expressionContext);
                withScopedKeyValue.push(`${withScopedDynamicKey}:${withScopedValue}`);
            }
            else {
                let keyValueDeviderPosition = keyValue.indexOf(':');
                if (keyValueDeviderPosition === -1) {
                    // 对象key简写
                    withScopedKeyValue.push(`${keyValue}:${expressionContext.setScope(keyValue, expressionContext)}`);
                }
                else {
                    let key = keyValue.slice(0, keyValueDeviderPosition);
                    let value = keyValue.slice(keyValueDeviderPosition + 1);
                    withScopedKeyValue.push(`${key}:${expressionWithScope(value, expressionContext)}`);
                }
            }
        });
        return `{${withScopedKeyValue.join(',')}}`;
    }
    function findTemplateStringEnd(templateString) {
        // 必须以反引号开头
        let cursor = 1;
        while (true) {
            // 当字符串没闭合时，会寻找
            let nextBackQuotePosition = templateString.indexOf('`', cursor);
            let templateStartPosition = templateString.indexOf('${', cursor);
            if (templateStartPosition === -1 || templateStartPosition > nextBackQuotePosition) {
                return nextBackQuotePosition;
            }
            else {
                // 存在template
                let templateEnd = findNextCodeBlockClosingPosition(templateString, templateStartPosition + 1); // 会用 ${ 的 { 去寻找
                // 第一个template 结束
                cursor = templateEnd;
            }
        }
    }
    function templateStringWithScope(templateString, expressionContext) {
        // 必须以反引号开头 结尾
        let result = '`';
        let cursor = 1;
        while (cursor <= templateString.length - 1) {
            let nextBackQuotePosition = templateString.indexOf('`', cursor);
            let templateStartPosition = templateString.indexOf('${', cursor);
            if (templateStartPosition === -1 || templateStartPosition > nextBackQuotePosition) {
                // 只会执行一次
                let restStaticContent = templateString.slice(cursor, templateString.length);
                result += restStaticContent;
                return result;
            }
            else {
                // 存在template
                let templateEnd = findNextCodeBlockClosingPosition(templateString, templateStartPosition + 1); // 会用 ${ 的 { 去寻找
                // 第一个template 结束
                let staticContent = templateString.slice(cursor, templateStartPosition);
                let templateContent = templateString.slice(templateStartPosition + 2, templateEnd); // +2 是把 ${ 去掉
                let withScopedTempalteContent = expressionWithScope(templateContent, expressionContext);
                result += staticContent;
                result += '${' + withScopedTempalteContent + '}';
                cursor = templateEnd + 1;
            }
        }
        return result;
    }
    // 使用 ， 分隔
    function listExpressionWithScope(expression, expressionContext) {
        let commaList = findFirstLevelComma(expression);
        let items = devideString(expression, commaList);
        return items.map((item) => expressionWithScope(item, expressionContext)).join(',');
    }
    function arrayExpressionWithScope(arrayExpression, expressionContext) {
        return `[${listExpressionWithScope(arrayExpression.slice(1, -1), expressionContext)}]`;
    }
    function isCodeBlockOpening(letter) {
        return letter === '(' || letter === '[' || letter === '{';
    }
    function isCodeBlockClosing(letter) {
        return letter === ')' || letter === ']' || letter === '}';
    }
    const codeBlockOpeningToClosing = {
        '{': '}',
        '[': ']',
        '(': ')'
    };
    function findNextCodeBlockClosingPosition(exp, findIndex = 0) {
        let open = exp[findIndex];
        let close = codeBlockOpeningToClosing[open];
        let blockStack = 0;
        for (let i = findIndex; i < exp.length; i++) {
            let letter = exp[i];
            // 忽视普通字符串
            if (letter === '"' || letter === "'") {
                let stringEnd = exp.indexOf(letter, i + 1);
                i = stringEnd;
                continue;
            }
            // 模板字符串
            if (letter === '`') {
                let rawTemplate = exp.slice(i);
                let templateStringEnd = findTemplateStringEnd(rawTemplate);
                // 忽略掉 template string
                i += templateStringEnd;
            }
            if (letter === close && blockStack === 1) {
                return i;
            }
            if (isCodeBlockOpening(letter)) {
                blockStack++;
            }
            else if (isCodeBlockClosing(letter)) {
                blockStack--;
            }
        }
    }
    function findFirstLevelComma(objectExpression) {
        let blockStack = 0;
        let positions = [];
        for (let i = 0; i < objectExpression.length; i++) {
            let letter = objectExpression[i];
            if (letter === ',') {
                // object devider
                if (blockStack == 0) { // 默认最外层也会计算在内
                    positions.push(i);
                }
            }
            else if (isCodeBlockOpening(letter)) {
                blockStack++;
            }
            else if (isCodeBlockClosing(letter)) {
                blockStack--;
            }
        }
        return positions;
    }
    function devideString(str, positions) {
        // 忽略 position 位置的字符
        let slicePositions = [-1, ...positions, str.length];
        let strs = [];
        for (let i = 0; i < slicePositions.length - 1; i++) {
            strs.push(str.slice(slicePositions[i] + 1, slicePositions[i + 1]));
        }
        return strs;
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
            return `[${target.map(stringify).join(',')}]`; // 格式化
        }
        else if (isObject(target)) {
            return '{' +
                Object.entries(target).map(([property, value]) => {
                    return property + ':' + stringify(value);
                }).join(',')
                + '}';
        }
        else if (isUndefined(target)) {
            return '';
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
    const callFn = (fnName, ...params) => {
        // 去掉最后的空参数
        while (params.length !== 0 && !params[params.length - 1]) {
            params.pop();
        }
        return `${fnName}(${params.join(',')})`;
    };
    const ternaryExp = (condition, ifTrue, ifFalse) => `${condition}?(${ifTrue}):(${ifFalse})`;
    function ternaryChains(conditions, returns, falseDefault = 'undefined', index = 0) {
        return ternaryExp(conditions[index], returns[index], index < conditions.length - 1 ? ternaryChains(conditions, returns, falseDefault, ++index) : (returns[index + 1] || falseDefault));
    }
    const destructur = (target) => `...${target}`;
    var declare = (name, value) => `const ${name} = ${value} ;`;
    const toReservedProp = (prop) => `_${prop}`;
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

    const createScanner = (source) => new Scanner(source);
    // operate the string template
    class Scanner {
        source = '';
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
        indexOf(target) {
            return this.source.indexOf(target);
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
        var ast = [], attributes, rawAttributeMap, inOpen, tag, modifiers;
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
                        rawAttributeMap,
                        children: null,
                        modifiers: modifiers && modifiers.split(':')
                    });
                    tag = null;
                    modifiers = null;
                    attributes = null;
                    rawAttributeMap = null;
                    inOpen = false;
                    scanner.move(1);
                }
                else {
                    /* catch attribute */
                    var exRes = scanner.exec(attributeRE);
                    var attribute = exRes[0];
                    var value = exRes[2];
                    (attributes ||= []).push({ attribute, value });
                    (rawAttributeMap ||= {})[attribute] = value;
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
        // 所有节点都会再此处理
        /*
            process the condition branch and the first dir is condition ,
            处理分支时会为if边际上branch start ， elseif else 标记为branch，或者元素的第一个指令为分支
        */
        var children = [];
        var inBranch = false;
        nodes.forEach((node) => {
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
                let nodeCode = genNode(node, context);
                children.push(nodeCode);
                inBranch = false;
            }
        });
        children = children.map((child) => {
            if (isArray(child)) {
                const branchCondition = child.map((b) => b.condition).filter(Boolean); // 勇于筛除else的condition ， 其他应该在之前就报错
                const branchContent = child.map((b) => {
                    let nodeCode = genNode(b, context);
                    return nodeCode;
                });
                return ternaryChains(branchCondition, branchContent);
            }
            else {
                return child;
            }
        });
        return children;
    }
    const genFor = (target, iterator, context) => {
        return context.callRenderFn('renderList', iterator.iterable, toArrowFunction(target, ...iterator.items), uStringId() /* 显示的在迭代器中传入掺入一个key，每次渲染时这个key不变，并且子节点会根据索引生成唯一key,只需要子层级即可 */);
    };
    function genForWithFragment(target, iterator, context) {
        return genFragment(genFor(target, iterator, context), context);
    }
    function genChildrenString(children, context) {
        if (!children)
            return NULL;
        return stringify(genChildren(children, context));
    }
    function genSlotContent(node, context) {
        var { children } = node;
        /*
            关于插槽的定义 ,
            插槽指令只能 存在子节点的最外一层，并在处理指令时 提升到最外层节点上
            如 <template slot="header" slot-scope="x"> ,
            暂时插槽数量还是固定的，无法通过循环定义多个具名插槽
            
             下面这种情况是不被允许的
            <com>
                <div s-slot-scope="x">  </div>
                <div><div>
            </com>
        */
        if (!children)
            return NULL;
        var _default;
        var slots = {};
        children.forEach((child) => {
            // 作用域插槽只能在具名插槽上
            if (child.defineSlotName) {
                let slotName = child.isDynamicDefineSlotName ? dynamicMapKey(child.defineSlotName) : child.defineSlotName;
                slots[slotName] = toArrowFunction(genNode(child, context), child.slotScope || node.slotScope);
            }
            else {
                (_default ||= []).push(child);
            }
        });
        if (_default) {
            // 会优先使用子节点本身的作用于插槽，当子默认节点只有一个时才可以拥有作用域插槽 ,优先使用
            let defaultSlotScope = (_default.length === 1 && _default[0].slotScope) || node.slotScope;
            slots.default = toArrowFunction(genNodes(_default, context), defaultSlotScope);
        }
        return stringify(slots);
    }
    function genNode(node, context) {
        let nodeCode = null;
        switch (node.type) {
            case 2 /* HTML_COMMENT */:
                nodeCode = context.callRenderFn('createComment', toBackQuotes(node.children), uid());
                break;
            case 7 /* CONDITION_RENDER_IF */:
            case 8 /* CONDITION_RENDER_ELSE_IF */:
            case 9 /* CONDITION_RENDER_ELSE */:
                nodeCode = genNodes(node.children, context);
                break;
            case 10 /* LIST_RENDER */:
                // use the fragment , cause the iterator will set the u key in each node , 
                nodeCode = genForWithFragment(genNodes(node.children, context), node.iterator, context);
                break;
            case 11 /* FRAGMENT */:
                nodeCode = genNodes(node.children, context);
                break;
            case 13 /* USE_COMPONENT_SLOT */:
                let { slotName, isDynamicSlot, children } = node;
                slotName ||= 'default';
                var { propsCode } = genProps(node, context);
                nodeCode = context.callRenderFn('renderSlot', isDynamicSlot ? slotName : toBackQuotes(slotName), propsCode, children ? toArrowFunction(genNodes(children, context)) : NULL, uid());
                break;
            case 14 /* DEFINE_COMPONENT_SLOT */:
                nodeCode = genNodes(node.children, context);
                break;
            case 20 /* DYNAMIC_HTML_ELEMENT */:
                var { is, isDynamicIs } = node;
                var { propsCode, dynamicPropsCode } = genProps(node, context);
                var code = context.callRenderFn('createElement', isDynamicIs ? is : toSingleQuotes(is), propsCode, genChildrenString(node.children, context), uStringId(), dynamicPropsCode);
                nodeCode = code;
                break;
            case 21 /* DYNAMIC_SVG_ELEMENT */:
                var { is, isDynamicIs } = node;
                var { propsCode, dynamicPropsCode } = genProps(node, context);
                var code = context.callRenderFn('createSVGElement', isDynamicIs ? is : toSingleQuotes(is), propsCode, genChildrenString(node.children, context), uStringId(), dynamicPropsCode);
                nodeCode = code;
                break;
            case 1 /* HTML_ELEMENT */:
                var { propsCode, dynamicPropsCode } = genProps(node, context);
                var code = context.callRenderFn('createElement', toBackQuotes(node.tagName), propsCode, genChildrenString(node.children, context), uStringId(), dynamicPropsCode);
                nodeCode = code;
                break;
            case 3 /* SVG_ELEMENT */:
                var { propsCode, dynamicPropsCode } = genProps(node, context);
                var code = context.callRenderFn('createSVGElement', toBackQuotes(node.tagName), propsCode, genChildrenString(node.children, context), uStringId(), dynamicPropsCode);
                nodeCode = code;
                break;
            case 22 /* DYNAMIC_COMPONENT */:
                var { is, isDynamicIs } = node;
                var component = context.useComponent(is, isDynamicIs);
                var { propsCode, dynamicPropsCode } = genProps(node, context);
                var slots = genSlotContent(node, context);
                code = context.callRenderFn('createComponent', component, propsCode, slots, uStringId(), dynamicPropsCode);
                nodeCode = code;
                break;
            case 4 /* COMPONENT */:
                var component = context.useComponent(node.tagName, false);
                var { propsCode, dynamicPropsCode } = genProps(node, context);
                var slots = genSlotContent(node, context);
                code = context.callRenderFn('createComponent', component, propsCode, slots, uStringId(), dynamicPropsCode);
                nodeCode = code;
                break;
            case 5 /* TEXT */:
                nodeCode = genText(node.children, context);
                break;
            case 6 /* STYLESHEET */:
                var { propsCode, dynamicPropsCode } = genProps(node, context);
                var code = context.callRenderFn('createStyleSheet', propsCode, stringify(genChildren(node.children, context)), hasOwn(node, 'scoped'), uStringId(), dynamicPropsCode);
                nodeCode = code;
                break;
            case 24 /* STYLE_RULE */:
                nodeCode = context.callRenderFn('createStyle', genSelector(node.selectors, context), stringify(genChildren(node.children, context)), uStringId());
                break;
            case 23 /* MEDIA_RULE */:
                const rules = stringify(genChildren(node.children, context));
                nodeCode = context.callRenderFn('createMedia', node.appConfigMedia ? context.callRenderFn('getCustomScreensMedia', toBackQuotes(node.media)) : toBackQuotes(node.media), rules, uStringId());
                break;
            case 25 /* KEYFRAMES_RULE */:
                nodeCode = context.callRenderFn('createKeyframes', toBackQuotes(node.keyframes), stringify(genChildren(node.children, context)), uStringId());
                break;
            case 26 /* KEYFRAME_RULE */:
                nodeCode = context.callRenderFn('createKeyframe', toBackQuotes(node.selector.selectorText), stringify(genChildren(node.children, context)), uStringId());
                break;
            case 27 /* SUPPORTS_RULE */:
                nodeCode = context.callRenderFn('createSupports', toBackQuotes(node.supports), stringify(genChildren(node.children, context)), uStringId());
                break;
            case 29 /* DECLARATION_GROUP */:
                nodeCode = context.callRenderFn('createDeclaration', genDeclartion(node.children, context), uStringId());
                break;
        }
        if (node.directives) {
            node.directives.reverse().forEach((dir) => {
                if (dir.type == 10 /* LIST_RENDER */) {
                    nodeCode = genForWithFragment(nodeCode, dir.iterator, context);
                }
                else if (dir.type === 7 /* CONDITION_RENDER_IF */) {
                    nodeCode = ternaryExp(dir.condition, nodeCode, NULL);
                }
            });
        }
        return nodeCode;
    }
    const genFragment = (code, context) => context.callRenderFn('createFragment', code, uStringId());
    const genText = (texts, context) => {
        let isDynamicText = false;
        let textContent = texts.map((text) => {
            const { content, isDynamic, modifier } = text;
            if (isDynamic) {
                isDynamicText = true;
                let args = [content];
                if (modifier) {
                    args.push(toSingleQuotes(modifier));
                }
                return context.callRenderFn('display', ...args);
            }
            else {
                return toBackQuotes(content);
            }
        }).join('+');
        let text = context.callRenderFn('createText', textContent, uid(), isDynamicText);
        if (isDynamicText) {
            return text;
        }
        else {
            return context.hoistExpression(text);
        }
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
                return item;
            }
        });
        return selectorCode.length === 1 ?
            selectorCode[0] :
            context.callRenderFn('mergeSelectors', ...selectorCode);
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
            else if (declaration.type === 28 /* DECLARATION */) {
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
                else if (illegalKey) {
                    property = dynamicMapKey(toSingleQuotes(property));
                }
                else {
                    property = camelize(property);
                }
                if (!isDynamicValue) {
                    value = toBackQuotes(value);
                }
                if (isImportant) {
                    value = context.callRenderFn('important', value);
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
            return context.callRenderFn('mixin', ..._res);
        }
    }
    function genProps(node, context) {
        let { type, attributes } = node;
        attributes ||= emptyArray;
        var props = {};
        var dynamicProps = [];
        attributes.forEach((attr) => {
            switch (attr.type) {
                case 16 /* EVENT */:
                    var { property, isDynamicProperty, value, isHandler, /* if true , just use it , or wrap an arrow function */ _arguments, filters, modifiers } = attr;
                    let handler = value;
                    if (!isHandler) {
                        handler = toArrowFunction(handler || '$' /* 为空字符时默认的handler*/, '$');
                        handler = context.handlerWithCache(handler);
                    }
                    // 处理按键修饰符
                    if (modifiers && (modifiers.includes('left') || modifiers.includes('middle') || modifiers.includes('right'))) {
                        property = 'mouseup';
                    }
                    if (isDynamicProperty) {
                        let key = context.callRenderFn('toEventName', property, _arguments ? stringify(_arguments.map(toBackQuotes)) : NULL, modifiers ? stringify(modifiers.map(toBackQuotes)) : NULL, filters ? stringify(filters.map(toBackQuotes)) : NULL);
                        props[dynamicMapKey(key)] = handler;
                        dynamicProps.push(key);
                    }
                    else {
                        let key = toEventName(property, _arguments, modifiers, filters);
                        props[key] = handler;
                        dynamicProps.push(toSingleQuotes(key));
                    }
                    break;
                case 17 /* ATTRIBUTE_CLASS */:
                    var _class = props.class ||= [];
                    if (attr.isDynamicValue) {
                        _class.push(attr.value);
                        dynamicProps.push(`'class'`);
                    }
                    else {
                        _class.push(toBackQuotes(attr.value));
                    }
                    break;
                case 18 /* ATTRIBUTE_STYLE */:
                    var style = props.style ||= [];
                    if (attr.isDynamicValue) {
                        style.push(attr.value);
                        dynamicProps.push(`'style'`);
                    }
                    else {
                        style.push(toBackQuotes(attr.value));
                    }
                    break;
                case 15 /* ATTRIBUTE */:
                    // normal attributes
                    var { property, value, isDynamicProperty, isDynamicValue, } = attr;
                    let key = isDynamicProperty ? dynamicMapKey(property) : property;
                    props[key] = isDynamicValue ? value : toBackQuotes(value);
                    if (isDynamicProperty || isDynamicValue) {
                        if (property[0] !== '_') {
                            // 保留属性不会记录到
                            dynamicProps.push(toSingleQuotes(property));
                        }
                    }
                    break;
                case 19 /* CUSTOM_DIRECTIVE */:
                    // _directive_??? : 
                    var { property, value, isDynamicProperty, _arguments, modifiers, filters } = attr;
                    var directive = context.useDirective(property, isDynamicProperty);
                    let bindings = {
                        directive
                    };
                    if (value) {
                        bindings.value = value;
                    }
                    if (_arguments) {
                        bindings._arguments = _arguments && _arguments.map(toSingleQuotes);
                    }
                    if (modifiers) {
                        bindings.modifiers = modifiers && modifiers.map(toSingleQuotes);
                    }
                    if (filters) {
                        bindings.filters = filters && filters.map(toSingleQuotes);
                    }
                    props[`_directive_${property}`] = stringify(bindings);
                    break;
            }
        });
        // merge class , there could be more than one class , 不应该在render函数中使用normalize
        if (props.class) {
            props.class = stringify(props.class.length === 1 ? props.class[0] : props.class);
        }
        if (props.style) {
            props.style = stringify(props.style.length === 1 ? props.style[0] : props.style);
        }
        let propsCode, dynamicPropsCode, allPropsStatic = false;
        if (dynamicProps.length) {
            // 存在 dynamicProps
            dynamicPropsCode = stringify(dynamicProps);
            propsCode = stringify(props);
        }
        else {
            dynamicPropsCode = NULL;
            if (isEmptyObject(props)) {
                propsCode = NULL;
            }
            else {
                // 提升
                allPropsStatic = true;
                propsCode = stringify(props);
            }
        }
        return {
            allPropsStatic,
            propsCode,
            dynamicPropsCode
        };
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

    const AttributeFlags = [
        '$--',
        's-',
        '...',
        '$',
        '@',
        '#',
        '.' // class shorthand
    ];
    const AttributeEndFlags = [
        '!' // important css property
    ];
    // 合法的属性名称
    const staticAttributeNameRE = /[\w-]+/;
    // both for html attribute and css declaration
    function parseAttribute(attr) {
        let { attribute, value } = attr;
        let flag, endFlag;
        // 提取开始标志
        for (let _flag of AttributeFlags) {
            if (attribute.startsWith(_flag)) {
                flag = _flag;
                attribute = attribute.slice(_flag.length);
                break;
            }
        }
        // 提取结尾标志
        for (let _flag of AttributeEndFlags) {
            if (attribute.endsWith(_flag)) {
                endFlag = _flag;
                attribute = attribute.slice(0, attribute.length - _flag.length);
                break;
            }
        }
        let isDynamicProperty, property, decorators;
        if (attribute.startsWith('(')) {
            // dynamic attribute
            let lastIndexOfBorder = attribute.lastIndexOf(')');
            property = attribute.slice(1, lastIndexOfBorder);
            isDynamicProperty = true;
            decorators = attribute.slice(lastIndexOfBorder + 1); // 防止内部表达式太复杂解析出错
        }
        else {
            isDynamicProperty = false;
            // 非动态属性， 先提取出 属性名称
            property = staticAttributeNameRE.exec(attribute)[0];
            decorators = attribute.slice(property?.length);
        }
        let _arguments, filters, modifiers;
        if (decorators) {
            let tokens = decorators.split(/(?=[\.|:])/);
            tokens.forEach((token) => {
                if (token[0] === ':') {
                    (_arguments ||= []).push(token.slice(1));
                }
                else if (token[0] === '|') {
                    (filters ||= []).push(token.slice(1));
                }
                else if (token[0] === '.') {
                    (modifiers ||= []).push(token.slice(1));
                }
            });
        }
        modifiers &&= modifiers.map(camelize);
        _arguments &&= _arguments.map(camelize);
        filters &&= filters.map(camelize);
        attr.isBooleanProperty = isUndefined(value);
        attr.isDynamicProperty = isDynamicProperty;
        attr.isDynamicValue = flag === '$';
        attr._arguments = _arguments;
        attr.modifiers = modifiers;
        attr.filters = filters;
        attr.property = property;
        attr.value = value;
        attr.flag = flag;
        attr.endFlag = endFlag;
        // 属性简写
        return attr;
    }

    // we can use $(exp) as a dynamic content
    var extractDynamicSelector = /\$\(([^\)s]*)\)/g;
    function parseSelector(selector) {
        var isDynamic = false;
        let selectorText = selector.replace(extractDynamicSelector, (_, content) => {
            isDynamic = true;
            return '${' + content + '}';
        });
        return {
            isDynamic,
            selectorText: isDynamic ? '`' + selectorText + '`' : selectorText
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
    const CSSCommentRE = /\/\*([\s\S]*?)\*\//;
    const AtGroupRuleRE = /^@([\w]+)(\s*[^{]+)?{/;
    const AtLineRuleRE = /^@([\w]+)\s*([\w]+)\s*;/;
    const mixinRE = /\.\.\.([^;]+);/;
    const CSSDir = /^([\w-]+)\s*(?:\(([^{]*)\))?\s*{/;
    /*
        判断是否已保留字开头，来决定是否为指令，不需要再用 '--' 标识
    */
    const cssReservedWord = /^(if|else-if|else|for|elseIf)/;
    const parseCSS = (source, context) => {
        var scanner = createScanner(source);
        var ast = [], // 存储编译结果
        stack = [], // 保留层级结构
        exResult, // 尝试捕获
        current, parent = null, closing = false, declarationGroup;
        while (scanner.source) {
            if (scanner.startsWith('}')) {
                closing = true;
            }
            else if (scanner.startsWith('@')) {
                /*
                    一个 at-rule 是一个CSS 语句，以 at 符号开头， '@'  后跟一个标识符，并包括直到下一个分号的所有内容， 或下一个 CSS 块，以先到者为准。 --mdn
                */
                let groupPosition = scanner.indexOf('{');
                let linePosition = scanner.indexOf(';');
                if (groupPosition > linePosition) {
                    // line at rule
                    scanner.exec(AtLineRuleRE);
                    // todo
                }
                else {
                    // group at rule
                    const [key, content] = scanner.exec(AtGroupRuleRE);
                    switch (key) {
                        case 'media':
                            current = {
                                type: 23 /* MEDIA_RULE */,
                                media: content
                            };
                            break;
                        case 'keyframes':
                            current = {
                                type: 25 /* KEYFRAMES_RULE */,
                                keyframes: content
                            };
                            break;
                        case 'supports':
                            current = {
                                type: 27 /* SUPPORTS_RULE */,
                                keyframes: content
                            };
                            break;
                        case 'screens':
                            // 转换为动态 media
                            current = {
                                type: 23 /* MEDIA_RULE */,
                                media: content.trim(),
                                appConfigMedia: true // 使用应用配置
                            };
                            break;
                        default:
                            debugger;
                            break;
                    }
                }
            }
            else if (scanner.expect('/*')) {
                /* comment */
                scanner.exec(CSSCommentRE);
                continue;
            }
            else if (scanner.startsWith('...')) {
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
                switch (dir) {
                    case 'for':
                        current = {
                            type: 10 /* LIST_RENDER */,
                            iterator: parseIterator(content)
                        };
                        break;
                    case 'if':
                        current = {
                            type: 7 /* CONDITION_RENDER_IF */,
                            condition: content,
                            isBranchStart: true
                        };
                        break;
                    case 'else-if':
                    case 'elseIf':
                        current = {
                            type: 8 /* CONDITION_RENDER_ELSE_IF */,
                            condition: content,
                            isBranch: true
                        };
                        break;
                    case 'else':
                        current = {
                            type: 9 /* CONDITION_RENDER_ELSE */,
                            isBranch: true
                        };
                        break;
                }
            }
            else if (exResult = scanner.exec(selectorRE)) {
                /*
                    try to get the selector
                */
                current = {
                    type: 24 /* STYLE_RULE */,
                    selector: parseSelector(exResult[0])
                };
            }
            else if (exResult = scanner.exec(declarationRE)) {
                /*
                    the last declaration must end with  " ; "
                */
                var declaration = parseAttribute({ attribute: exResult[0], value: exResult[1] });
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
                    type: 28 /* DECLARATION */
                });
                continue;
            }
            else {
                /* error */
                debugger;
            }
            /* process the relation , with cascading struct */
            if (declarationGroup) {
                var asb = { type: 29 /* DECLARATION_GROUP */ };
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
                let exp = execArr[1].trim();
                var content, modifier;
                if (exp.startsWith('@')) {
                    // 使用修饰非一定要用一个空格作为分隔
                    let firstWhitespace = exp.indexOf(' ');
                    modifier = exp.slice(1, firstWhitespace);
                    content = exp.slice(firstWhitespace);
                }
                else {
                    content = exp;
                }
                texts.push({
                    modifier,
                    content,
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

    /*
        extend the selectors and process keyframes
    */
    const processRules = (rules, context, isKeyframe = false) => {
        rules.forEach((rule) => {
            let shouldPopScope = false;
            switch (rule.type) {
                case 24 /* STYLE_RULE */:
                    if (isKeyframe) {
                        rule.type = 26 /* KEYFRAME_RULE */;
                    }
                    else {
                        let { selector, parent } = rule;
                        if (selector.isDynamic) {
                            selector.selectorText = context.setRenderScope(selector.selectorText);
                        }
                        var extendSelectors = parent?.selectors;
                        if (extendSelectors) {
                            rule.selectors = [...extendSelectors, selector];
                        }
                        else {
                            rule.selectors = [selector];
                        }
                    }
                    break;
                case 7 /* CONDITION_RENDER_IF */:
                    rule.selectors = rule.parent?.selectors;
                    rule.condition = context.setRenderScope(rule.condition);
                    break;
                case 8 /* CONDITION_RENDER_ELSE_IF */:
                    rule.selectors = rule.parent?.selectors;
                    rule.condition = context.setRenderScope(rule.condition);
                    break;
                case 9 /* CONDITION_RENDER_ELSE */:
                    rule.selectors = rule.parent?.selectors;
                    break;
                case 10 /* LIST_RENDER */:
                    rule.selectors = rule.parent?.selectors;
                    let iterator = rule.iterator;
                    iterator.iterable = context.setRenderScope(iterator.iterable);
                    context.pushScope(iterator.items);
                    shouldPopScope = true;
                    break;
                case 23 /* MEDIA_RULE */:
                    rule.selectors = rule.parent?.selectors;
                    break;
                case 27 /* SUPPORTS_RULE */:
                    rule.selectors = rule.parent?.selectors;
                    break;
                case 25 /* KEYFRAMES_RULE */:
                    isKeyframe = true;
                    break;
                case 28 /* DECLARATION */:
                    let declaration = rule.declaration;
                    if (declaration.isDynamicPrperty) {
                        declaration.property = context.setRenderScope(declaration.property);
                    }
                    if (declaration.isDynamicValue) {
                        declaration.value = context.setRenderScope(declaration.value);
                    }
                    break;
                case 30 /* MIXIN */:
                    rule.mixin = context.setRenderScope(rule.mixin);
                    break;
            }
            if (rule.children) {
                processRules(rule.children, context, isKeyframe);
            }
            if (shouldPopScope) {
                context.popScope();
            }
        });
    };

    function processTemplateAst(htmlAst, context) {
        if (isArray(htmlAst)) {
            return htmlAst.forEach((ast) => processTemplateAst(ast, context));
        }
        let scopeStack = 0;
        const tagName = htmlAst.tagName = camelize(htmlAst.tag);
        htmlAst.type = context.compilerOptions.isHTMLTag(tagName) ?
            1 /* HTML_ELEMENT */ : context.compilerOptions.isSVGTag(tagName) ?
            3 /* SVG_ELEMENT */ : tagName === 'style' ?
            6 /* STYLESHEET */ : 4 /* COMPONENT */;
        let attributes = htmlAst.attributes;
        if (attributes) {
            for (let i = 0; i < attributes.length; i++) {
                let attr = attributes[i];
                if (attr.type) {
                    continue;
                }
                parseAttribute(attr);
                let { attribute, value } = attr;
                switch (attr.flag) {
                    case 's-':
                        switch (attr.property) {
                            case 'if':
                                if (htmlAst.directives) {
                                    htmlAst.directives.push({
                                        type: 7 /* CONDITION_RENDER_IF */,
                                        condition: context.setRenderScope(value)
                                    });
                                }
                                else {
                                    htmlAst.isBranchStart = true;
                                    htmlAst.condition = context.setRenderScope(value);
                                }
                                break;
                            case 'else-if':
                                htmlAst.isBranch = true;
                                htmlAst.condition = context.setRenderScope(value);
                                if (htmlAst.directives) {
                                    error('else-if指令必须第一个出现');
                                }
                                break;
                            case 'else':
                                htmlAst.isBranch = true;
                                if (htmlAst.iterator) {
                                    error('else指令必须第一个出现');
                                }
                                break;
                            case 'for':
                                // for 指令会最最先进行处理 ， 因为要进行变量提升
                                let iterator = parseIterator(attr.value);
                                iterator.iterable = context.setRenderScope(iterator.iterable);
                                context.pushScope(iterator.items);
                                scopeStack++;
                                let directives = htmlAst.directives ||= [];
                                directives.push({
                                    type: 10 /* LIST_RENDER */,
                                    iterator
                                });
                                break;
                            case 'text':
                                attr.type = 15 /* ATTRIBUTE */;
                                attr.property = 'innerText';
                                attr.isDynamicValue = true;
                                attr.value = context.setRenderScope(attr.value);
                                htmlAst.children = null; // 直接忽略
                                break;
                            case 'html':
                                attr.type = 15 /* ATTRIBUTE */;
                                attr.property = 'innerText';
                                attr.isDynamicValue = true;
                                attr.value = context.setRenderScope(attr.value);
                                htmlAst.children = null; // 直接忽略
                                break;
                            case 'bind':
                                attr.type = 15 /* ATTRIBUTE */;
                                if (attr._arguments) {
                                    // 单属性的bind, 等同于 $
                                    attr.property = attr._arguments[0];
                                    attr._arguments.shift();
                                }
                                attr.value = context.setRenderScope(attr.value);
                                attr.isDynamicValue = true;
                                break;
                            case 'ref':
                                // 转为普通的 ref属性
                                attr.type = 15 /* ATTRIBUTE */;
                                attr.isDynamicValue = attr?.modifiers?.includes('dynamic');
                                break;
                            case 'on':
                                attr.type = 16 /* EVENT */;
                                attr.property = attr._arguments[0];
                                attr._arguments.shift();
                                attr.isDynamicValue = true;
                                attr.isHandler = isHandler(attr.value);
                                attr.value = context.setRenderScope(attr.value);
                                break;
                            case 'native':
                                if (htmlAst.tagName == 'style') {
                                    attr.type = 15 /* ATTRIBUTE */;
                                    attr.property = 'innerHTML';
                                    attr.value = htmlAst.children[0].children;
                                    htmlAst.native = true; // 标记该节点
                                    break;
                                }
                            case 'scoped':
                                if (htmlAst.tagName == 'style') {
                                    htmlAst.scoped = true;
                                    context.useScopedStyleSheet = true;
                                    break;
                                }
                            case 'slot-scope':
                                htmlAst.slotScope = attr.value;
                                let args = extractFunctionArgs(attr.value);
                                if (args.length) {
                                    context.pushScope(args);
                                    scopeStack++;
                                }
                                break;
                            case 'slot':
                                // 第一个修饰符dynamic代表定义动态插槽
                                htmlAst.isDynamicDefineSlotName = attr?.modifiers?.includes('dynamic');
                                htmlAst.defineSlotName = htmlAst.isDynamicDefineSlotName ? context.setRenderScope(attr?.value) : attr?.value;
                                break;
                            case 'slot-name':
                                // 使用插槽时的名称
                                htmlAst.isDynamicSlot = attr?.modifiers?.includes('dynamic');
                                htmlAst.slotName = htmlAst.isDynamicSlot ? context.setRenderScope(attr?.value) : (attr?.value || 'default');
                                break;
                            case 'style':
                                attr.type = 18 /* ATTRIBUTE_STYLE */;
                                attr.isDynamicValue = true;
                                attr.value = context.setRenderScope(attr.value);
                                break;
                            case 'class':
                                attr.type = 17 /* ATTRIBUTE_CLASS */;
                                attr.isDynamicValue = true;
                                attr.value = context.setRenderScope(attr.value);
                                break;
                            case 'model':
                                if (htmlAst.type === 4 /* COMPONENT */) {
                                    // _modelValue_????
                                    let modelValue = context.setRawScope(attr.value);
                                    attributes.push({
                                        type: 15 /* ATTRIBUTE */,
                                        property: `_modelValue_is_${attr?._arguments?.[0] || 'defaultModelValue'}`,
                                        value: modelValue,
                                        isDynamicValue: true,
                                        isDynamicProperty: false,
                                    });
                                    attributes.push({
                                        type: 15 /* ATTRIBUTE */,
                                        property: `onBeforeUpdate$modelValue_${attr?._arguments?.[0] || 'defaultModelValue'}`,
                                        value: toArrowFunction(`${modelValue} = _`, '_'),
                                        isDynamicValue: true,
                                        isDynamicProperty: false,
                                    });
                                }
                                else {
                                    attr.type = 19 /* CUSTOM_DIRECTIVE */;
                                    let modelType = htmlAst.tag === 'select' ?
                                        (hasOwn(htmlAst.rawAttributeMap, 'multiple') ?
                                            'selectMultiple' : 'selectOne') : (htmlAst.rawAttributeMap.type || 'text');
                                    // transform 
                                    attr.property = `model${initialUpperCase(modelType)}`;
                                    attr.value = context.setRawScope(attr.value);
                                    attributes.push({
                                        type: 15 /* ATTRIBUTE */,
                                        property: '_setModelValue',
                                        value: toArrowFunction(`${attr.value} = _`, '_'),
                                        isDynamicValue: true,
                                        isDynamicProperty: false
                                    });
                                    attributes.push({
                                        type: 15 /* ATTRIBUTE */,
                                        property: '_getModelValue',
                                        value: toArrowFunction(`${attr.value}`),
                                        isDynamicValue: true,
                                        isDynamicProperty: false
                                    });
                                }
                                break;
                            default:
                                attr.type = 19 /* CUSTOM_DIRECTIVE */;
                                attr.value = context.setRenderScope(attr.value);
                                if (attr.isDynamicProperty) {
                                    attr.property = context.setRenderScope(attr.property);
                                }
                                break;
                        }
                        break;
                    case '@':
                        attr.type = 16 /* EVENT */;
                        attr.isHandler = isHandler(attr.value);
                        attr.value = context.setRenderScope(attr.value || attr.property);
                        if (attr.isDynamicProperty) {
                            attr.property = context.setRenderScope(attr.property);
                        }
                        break;
                    case '#':
                        if (htmlAst.tagName === 'template' || htmlAst.tagName === 'fragment') {
                            // 模板上的# 会转换为插槽的定义
                            if (attr.isDynamicProperty) {
                                htmlAst.isDynamicDefineSlotName = true;
                                htmlAst.defineSlotName = context.setRenderScope(attr.property);
                            }
                            else {
                                htmlAst.isDynamicDefineSlotName = false;
                                htmlAst.defineSlotName = attr.property;
                            }
                            htmlAst.slotScope = attr.value;
                            let args = extractFunctionArgs(attr.value);
                            if (args.length) {
                                context.pushScope(args);
                                scopeStack++;
                            }
                        }
                        else {
                            attr.type = 15 /* ATTRIBUTE */;
                            // id 如果是驼峰形式，则在模版中一定是连字符写法 ， 需要转回连字符形式
                            attr.property = 'id';
                            attr.isDynamicValue = attr.isDynamicProperty;
                            attr.isDynamicProperty = false;
                            attr.value = attr.isDynamicValue ? context.setRenderScope(attr.property) : attr.property;
                        }
                        break;
                    case '.':
                        attr.type = 17 /* ATTRIBUTE_CLASS */;
                        attr.isDynamicValue = attr.isDynamicProperty;
                        attr.isDynamicProperty = false;
                        attr.value = attr.isDynamicValue ? context.setRenderScope(attr.property) : attr.property;
                        attr.property = 'class';
                        break;
                    case '...':
                        attr.type = 15 /* ATTRIBUTE */;
                        attribute.property = 'bind';
                        attribute.isDynamicValue = true;
                        attr.value = context.setRenderScope(attr.property);
                        break;
                    default:
                        attr.type = 15 /* ATTRIBUTE */;
                        if (attr.isDynamicProperty) {
                            attr.property = context.setRenderScope(attr.property);
                        }
                        if (!attr.value) {
                            attr.value = attr.property;
                        }
                        if (attr.isDynamicValue) {
                            attr.value = context.setRenderScope(attr.value);
                        }
                        switch (attr.property) {
                            case 'class':
                                attr.type = 17 /* ATTRIBUTE_CLASS */;
                                break;
                            case 'style':
                                attr.type = 18 /* ATTRIBUTE_STYLE */;
                                break;
                        }
                }
            }
        }
        switch (tagName) {
            case '':
                htmlAst.type = 5 /* TEXT */;
                let children = parseText(htmlAst.children);
                let isDynamic = false;
                children.forEach((child) => {
                    if (child.isDynamic) {
                        child.content = context.setRenderScope(child.content);
                        isDynamic = true;
                    }
                });
                htmlAst.isDynamic = isDynamic;
                htmlAst.children = children;
                htmlAst.ignoreChildren = true;
                break;
            case '!':
                htmlAst.type = 2 /* HTML_COMMENT */;
                htmlAst.ignoreChildren = true;
                break;
            case 'if':
                htmlAst.type = 7 /* CONDITION_RENDER_IF */;
                htmlAst.isBranchStart = true;
                htmlAst.condition = context.setRenderScope(htmlAst.rawAttributeMap['condition']);
                break;
            case 'elseIf':
                htmlAst.type = 8 /* CONDITION_RENDER_ELSE_IF */;
                htmlAst.isBranch = true;
                htmlAst.condition = context.setRenderScope(htmlAst.rawAttributeMap['condition']);
                break;
            case 'else':
                htmlAst.type = 9 /* CONDITION_RENDER_ELSE */;
                htmlAst.isBranch = true;
                break;
            case 'for':
                htmlAst.type = 10 /* LIST_RENDER */;
                let iterator = parseIterator(htmlAst.rawAttributeMap['iterator']);
                iterator.iterable = context.setRenderScope(iterator.iterable);
                context.pushScope(iterator.items);
                scopeStack++;
                htmlAst.iterator = iterator;
                break;
            case 'template':
            case 'fragment':
                htmlAst.type = 11 /* FRAGMENT */;
                break;
            case 'slot':
                htmlAst.type = 13 /* USE_COMPONENT_SLOT */;
                break;
            case 'element':
                htmlAst.type = 20 /* DYNAMIC_HTML_ELEMENT */;
                var isAttribute = htmlAst.attributes.find((attr) => attr.property === 'is');
                isAttribute.type = 12 /* SKIP */;
                if (isAttribute.isDynamicValue) {
                    htmlAst.is = context.setRenderScope(isAttribute.value);
                    htmlAst.isDynamicIs = true;
                }
                else {
                    htmlAst.is = isAttribute.value;
                    htmlAst.isDynamicIs = false;
                }
                break;
            case 'component':
                htmlAst.type = 22 /* DYNAMIC_COMPONENT */;
                var isAttribute = htmlAst.attributes.find((attr) => attr.property === 'is');
                isAttribute.type = 12 /* SKIP */;
                if (isAttribute.isDynamicValue) {
                    htmlAst.is = context.setRenderScope(isAttribute.value);
                    htmlAst.isDynamicIs = true;
                }
                else {
                    htmlAst.is = isAttribute.value;
                    htmlAst.isDynamicIs = false;
                }
                break;
            case 'svgElement':
                htmlAst.type = 21 /* DYNAMIC_SVG_ELEMENT */;
                var isAttribute = htmlAst.attributes.find((attr) => attr.property === 'is');
                isAttribute.type = 12 /* SKIP */;
                if (isAttribute.isDynamicValue) {
                    htmlAst.is = context.setRenderScope(isAttribute.value);
                    htmlAst.isDynamicIs = true;
                }
                else {
                    htmlAst.is = isAttribute.value;
                    htmlAst.isDynamicIs = false;
                }
                break;
            case 'style':
                htmlAst.type = 6 /* STYLESHEET */;
                var template = htmlAst.children?.[0].children;
                if (template) {
                    var styleAst = parseCSS(template);
                    processRules(styleAst, context);
                    htmlAst.children = styleAst;
                }
                htmlAst.ignoreChildren = true;
                break;
        }
        if (htmlAst.children && !htmlAst.ignoreChildren) {
            processTemplateAst(htmlAst.children, context);
        }
        if (scopeStack) {
            for (let i = 0; i < scopeStack; i++) {
                context.popScope();
            }
        }
    }

    const createFunction = (content, ...params) => new Function(...params, `${content}`);
    class CodeGenerator {
        compilerOptions;
        code;
        // 记录使用的方法
        methods = {};
        components = {};
        directives = {};
        renderScope;
        scope;
        cache;
        handlerWithCache(handlerExpression) {
            let cacheId = uVar();
            return `(${this.cache}.${cacheId} || (${this.cache}.${cacheId} = ${handlerExpression}))`;
        }
        // 记录模板中是否使用了scoped css
        useScopedStyleSheet = false;
        constructor() {
            this.code = '';
        }
        getCode = () => {
            this.unshift(declare(`{${Object.keys(this.methods).join(',')}}`, 'renderMethods'));
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
        useComponent(name, isDynamic) {
            if (isDynamic) {
                return this.callRenderFn('getComponent', name);
            }
            else {
                if (this.components[name]) {
                    return this.components[name];
                }
                else {
                    let component = this.hoistExpression(this.callRenderFn('getComponent', toBackQuotes(name)));
                    this.components[name] = component;
                    return component;
                }
            }
        }
        useDirective(name, isDynamic) {
            if (isDynamic) {
                return this.callRenderFn('getDirective', name);
            }
            else {
                if (this.directives[name]) {
                    return this.directives[name];
                }
                else {
                    let directive = this.hoistExpression(this.callRenderFn('getDirective', toBackQuotes(name)));
                    this.directives[name] = directive;
                    return directive;
                }
            }
        }
        parseExpressionWithRenderScope(exp) {
            let expInstance = createExpression(exp);
            expInstance.pushScope(this.scopes);
            let setScopedExpression = expInstance.scopedExpression(this.renderScope);
            let variables = expInstance.variables;
            return {
                expression: setScopedExpression,
                variables
            };
        }
        parseExpressionWithRawScope(exp) {
            let expInstance = createExpression(exp);
            expInstance.pushScope(this.scopes);
            let setScopedExpression = expInstance.scopedExpression(this.renderScope);
            let variables = expInstance.variables;
            return {
                expression: setScopedExpression,
                variables
            };
        }
        setRenderScope(exp) {
            let expInstance = createExpression(exp);
            expInstance.pushScope(this.scopes);
            return expInstance.scopedExpression(this.renderScope);
        }
        setRawScope(exp) {
            let expInstance = createExpression(exp);
            expInstance.pushScope(this.scopes);
            return expInstance.scopedExpression(this.scope);
        }
        scopes = [];
        pushScope(scope) {
            this.scopes.push(scope);
        }
        popScope() {
            this.scopes.pop();
        }
    }
    const compilerDefaultOptions = {
        isHTMLTag,
        isSVGTag
    };
    function compile(template, compilerOptions = compilerDefaultOptions) {
        let start = Date.now();
        var context = new CodeGenerator();
        context.compilerOptions = compilerOptions;
        // 初始化渲染作用域
        context.renderScope = context.hoistExpression(context.callRenderFn('getCurrentRenderScope'));
        context.scope = context.hoistExpression(context.callRenderFn('getCurrentScope'));
        context.cache = context.hoistExpression(context.callRenderFn('useCurrentInstanceCache'));
        var htmlAst = baseParseHTML(template);
        processTemplateAst(htmlAst, context);
        let renderCode = genNodes(htmlAst, context);
        const content = `return ${toArrowFunction(renderCode)}`;
        context.pushNewLine(content);
        let code = context.getCode();
        let end = Date.now();
        let render = {
            createRender: null,
            useScopedStyleSheet: context.useScopedStyleSheet,
            cost: end - start
        };
        eval(`render.createRender = function createRender(renderMethods){${code}}`);
        console.log(render.createRender);
        return render;
    }

    const inlineStyleDelimiter = /\s*[:;]\s*/;
    function parseInlineStyle(styleString) {
        var chips = styleString.split(inlineStyleDelimiter).filter(Boolean);
        var l = chips.length;
        var styleMap = {};
        while (l) {
            styleMap[camelize(chips[l - 2])] = chips[l - 1];
            l -= 2;
        }
        return styleMap;
    }
    const inlineClassDelimiter = /\s+/;
    const parseInlineClass = (classString) => stringToMap(classString, inlineClassDelimiter);

    // normalized class always will be a map with true value
    function normalizeClass(rawClass) {
        /*
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
            return extend({}, ...rawClass.map(normalizeClass));
        }
        else if (isFunction(rawClass)) {
            return normalizeClass(rawClass());
        }
        else {
            return emptyObject;
        }
    }

    /*
         always return a map
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
            return extend({}, ...style);
        }
        else if (isFunction(style)) {
            return normalizeStyle(style());
        }
        else {
            return style;
        }
    }

    function renderSlot(name, scope, fallback, key) {
        const instance = getCurrentInstance();
        let slot = instance?.slots?.[name] || fallback;
        if (!slot) {
            return null;
        }
        else {
            slot = slot(scope || emptyObject);
        }
        // 这里返回的一定是单一节点（fragment），不会是数组形式
        slot.key = key; // 唯一插槽节点的key
        return slot;
    }

    var renderMethods = {
        useCurrentInstanceCache,
        getCurrentRenderScope,
        createComment,
        createSVGElement,
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
        mergeSelectors,
        withEventModifiers,
        getCustomScreensMedia,
        toEventName,
    };

    // if you are using css function with dynamic binding , use camelized function name 
    function toPositiveValue(value) {
        if (isNumber(value)) {
            return value < 0 ? -value : value;
        }
        else {
            return value.startsWith('-') ? value.slice(1) : value;
        }
    }
    function toNegativeValue(value) {
        if (isNumber(value)) {
            return value > 0 ? -value : value;
        }
        else {
            return value.startsWith('-') ? value : '-' + value;
        }
    }
    function toAbsoluteValue(value) {
        if (isNumber(value)) {
            return Math.abs(value);
        }
        else {
            return value.startsWith('-') ? value.slice(1) : value;
        }
    }
    function addUnit(value, unit) {
        return isNumber(value) ? `${value + unit}` : value;
    }
    function rgba(...rgba) {
        return `rgba(${rgba.join(',')})`;
    }
    function rgb(...rgb) {
        return `rgb(${rgb.join(',')})`;
    }
    /*
        in normal css , the saturation and lightness need to endwith % , but we support to use number , and auto fill %
    */
    function hsla(h, s, l, a = 1) {
        return `hsla(${h},${addUnit(s, '%')},${addUnit(l, '%')},${a})`;
    }
    function hsl(h, s, l) {
        return `hsl(${h},${addUnit(s, '%')},${addUnit(l, '%')})`;
    }
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
    function scaleX(n) {
        return `scaleX(${n})`;
    }

    const groupSelectorDelimiter = /\s*,\s*/;
    const splitSelector = (selector) => selector.split(groupSelectorDelimiter);
    const joinSelector = (splitedSelector) => splitedSelector.join(',');
    function mergeSelector(p, c) {
        var useParentSelector = false; // is using & 
        var merged = c.replace('&', () => {
            useParentSelector = true;
            return p;
        });
        return useParentSelector ? merged : p + ' ' + c; // default merge
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
    function baseSetSelectorAttribute(selector, attribute) {
        let pseduoClassPosition = selector.indexOf(':');
        if (pseduoClassPosition < 0) {
            return `${selector}[${attribute}]`;
        }
        else {
            return `${selector.slice(0, pseduoClassPosition)}[${attribute}]${selector.slice(pseduoClassPosition)}`;
        }
    }
    function setSelectorAttribute(selector, attribute) {
        return joinSelector(splitSelector(selector).map((sel) => baseSetSelectorAttribute(sel, attribute)));
    }

    function keyframes(name, keyframes) {
        return createKeyframes(name, keyframes);
    }
    function keyframe(name, keyframes) {
        return createKeyframe(name, keyframes);
    }
    // 手写渲染函数是时 ， 框架内部无法识别新旧dom树中是否为同一节点 ， 所以应该手动传入 唯一id ， 不然都会作为新节点，全部卸载，并全部重新挂载
    function h(type, props, children, key = uid()) {
        let vnode = null;
        if (isObject(type) || isFunction(type)) {
            // 同时支持有状态组件和函数式组件
            if (children && !isObject(children)) {
                children = { default: children };
            }
            vnode = createComponent(type, props, children, key);
        }
        else if (isHTMLTag(type)) {
            vnode = createElement(type, props, children, key);
        }
        else if (isSVGTag(type)) {
            vnode = createSVGElement(type, props, children, key);
        }
        vnode.h = true;
        return vnode;
    }

    const modelText = {
        created(el, { value, modifiers }, vnode) {
            const { lazy, number, trim, debounce: useDebounce } = modifiers;
            const setter = vnode.props._setModelValue;
            el._modelValue = value;
            // 设置input初始值
            if (isRef(value)) {
                // 如果没设置初始值，会显示 undefined
                el.value = isUndefined(value.value) ? '' : value.value;
            }
            else {
                el.value = isUndefined(value) ? '' : value;
            }
            let inputHandler = () => {
                let inputValue = el.value;
                // number 和 trim 不能同时使用 , 空字符串转数字会变为0
                inputValue = inputValue === '' ? '' : number ? toNumber(inputValue) : trim ? inputValue.trim() : inputValue;
                // 标记输入框刚刚输入完毕
                el._inputing = true;
                if (isRef(el._modelValue)) {
                    el._modelValue.value = inputValue;
                }
                else {
                    setter(inputValue);
                }
            };
            if (useDebounce) {
                let debounceNextModifier = modifiers[modifiers.indexOf('debounce') + 1];
                let numberValue = toNumber(debounceNextModifier);
                // 如果是合理地数字
                let wait = isNumber(numberValue) ? numberValue : 100;
                inputHandler = debounce(inputHandler, wait);
            }
            addListener(el, lazy ? 'change' : 'input', inputHandler);
        },
        beforeUpdate(el, { value }) {
            // 由输入框输入引发的更新，不会重新设置输入框的值
            if (el._inputing) {
                el._inputing = false;
            }
            else {
                el._modelValue = el.value;
                let newValue = isRef(value) ? value.value : value;
                el.value = isUndefined(newValue) ? '' : newValue;
            }
        }
    };
    // 多个相同name的input同时出现
    const modelRadio = {
        created(el, { value }, { props: { _setModelValue } }) {
            if (el.value === value) {
                el.checked = true;
            }
            addListener(el, 'change', () => {
                _setModelValue(el.value);
            });
        },
        // data to input
        beforeUpdate(el, { value }) {
            if (el.value === String(value)) {
                el.checked = true;
            }
            else {
                el.checked = false;
            }
        }
    };
    const modelCheckbox = {
        created(el, { value }, vnode) {
            debugger;
            if (!isArray(value)) {
                return;
            }
            // 设置初始化值
            if (value.includes(el.value)) {
                el.checked = true;
            }
            addListener(el, 'change', () => {
                if (el.checked) {
                    value.push(el.value);
                }
                else {
                    removeFromArray(value, el.value);
                }
            });
        },
        // 数据改变更新视图
        beforeUpdate(el, { value }) {
            el.checked = value.includes(el.value);
        }
    };
    function getSelectedValue(selectEl) {
        let selected = [];
        for (let option of selectEl.options) {
            if (option.selected) {
                selected.push(option.value);
            }
        }
        return selected;
    }
    function setSelectState(selectEl, selected) {
        for (let option of selectEl.options) {
            option.selected = selected.includes(option.value);
        }
    }
    const modelSelectOne = {
        childrenMounted(el, { value }, { props: { _setModelValue } }) {
            let options = el.options;
            for (let option of options) {
                // options 默认第一个为选中的
                option.selected = option.value === value;
            }
            addListener(el, 'change', () => {
                _setModelValue(el.value);
            });
        },
        beforeUpdate(el, { value }) {
            if (value !== el.value) {
                el.value = value;
            }
        }
    };
    const modelSelectMultiple = {
        childrenMounted(el, { value }, { props: { _setModelValue } }) {
            if (!isArray(value)) {
                return;
            }
            let options = el.options;
            for (let option of options) {
                // options 默认第一个为选中的 , 初始化选中状态
                option.selected = value.includes(option.value);
            }
            addListener(el, 'change', () => {
                _setModelValue(getSelectedValue(el));
            });
        },
        beforeUpdate(el, { value }) {
            setSelectState(el, value);
        }
    };
    // 目前只支持 16 进制
    const modelColor = {
        created(el, { value, modifiers: { lazy, rgb, hsl, } }, vnode) {
            el._mdelValue = value;
            const setter = vnode.props._setModelValue;
            // 设置初始值
            el.value = normalizeToHexColor(isRef(value) ? value.value : value);
            addListener(el, lazy ? 'change' : 'input', () => {
                el._inputing = true;
                let colorValue = rgb ? hexToRgb(el.value) : hsl ? hexToHsl(el.value) : el.value;
                isRef(el._mdelValue) ? el._mdelValue.value = colorValue : setter(colorValue);
            });
        },
        beforeUpdate(el, { value }) {
            if (el._inputing) {
                el._inputing = false;
            }
            else {
                el._mdelValue = value;
                el.value = normalizeToHexColor(isRef(value) ? value.value : value);
            }
        }
    };
    const modelRange = {
        created(el, { value, modifiers: { lazy } }, { props: { _setModelValue } }) {
            el.value = isRef(value) ? value.value : value;
            addListener(el, lazy ? 'change' : 'input', () => {
                if (isRef(value)) {
                    value.value = el.value;
                }
                else {
                    _setModelValue(el.value);
                }
            });
        },
        beforeUpdate(el, { value }) {
            el.value = isRef(value) ? value.value : value;
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
                value ? transition.processShow(el) : transition.processHide(el);
            }
        }
    };

    // 指定一个动画keyframes，在执行后自动移除，不影响元素本身属性 
    function normalizeMs(value) {
        return isNumber(Number(value)) ? value + 'ms' : value;
    }
    function doKeyframesAnimation(el, options, endCb, cancelCb) {
        let _name = getElementComputedStyleValue(el, 'animationName');
        if (_name && _name !== 'none') {
            // 元素本身不应该存在动画名称属性
            return;
        }
        const { name, duration, timingFunction, delay, playState, fillMode, iterationCount, // infinite 无限次时 结束回调失效
        direction } = options;
        const animationDeclaration = {
            animationName: name,
            animationDuration: normalizeMs(duration),
            animationDelay: normalizeMs(delay),
            animationTimingFunction: timingFunction,
            animationPlayState: playState,
            animationFillMode: fillMode,
            animationIterationCount: iterationCount,
            animationDirection: direction
        };
        // 动画执行结束后再还原属性
        let copy = getElementStyle(el, animationDeclaration);
        setElementStyleDeclaration(el, animationDeclaration);
        let animationCompleteHandler = () => {
            // 重新设置之前的属性
            setElementStyleDeclaration(el, copy);
            if (endCb) {
                endCb(el);
            }
        };
        onceListener(el, 'animationend', animationCompleteHandler);
        let cancelled = false;
        // stop animation , 只有动画成功执行才会返回取消方法
        return () => {
            if (cancelled) {
                return;
            }
            setElementStyleDeclaration(el, copy);
            removeListener(el, 'animationend', animationCompleteHandler); // 手动移除侦听器
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

    const bounce = [
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
    ];
    const bounceIn = [
        keyframe(['from', 20, 40, 60, 80, 100], {
            animationTimingFunction: cubicBezier(0.215, 0.61, 0.355, 1)
        }),
        keyframe(0, { transform: scale3d(0.3, 0.3, 0.3) }),
        keyframe(20, { transform: scale3d(1.1, 1.1, 1.1) }),
        keyframe(40, { transform: scale3d(0.9, 0.9, 0.9) }),
        keyframe(60, { transform: scale3d(1.03, 1.03, 1.03) }),
        keyframe(80, { transform: scale3d(0.97, 0.97, 0.97) }),
        keyframe(100, { transform: scale3d(1, 1, 1) }),
    ];
    const bounceOut = [
        keyframe(20, { transform: scale3d(0.9, 0.9, 0.9) }),
        keyframe([50, 55], { opacity: 1, transform: scale3d(1.1, 1.1, 1.1) }),
        keyframe(100, { transform: scale3d(0.3, 0.3, 0.3), opacity: 0 })
    ];
    const bounceInDown = [
        keyframe([0, 60, 75, 90, 100], { animationTimingFunction: cubicBezier(0.215, 0.61, 0.355, 1) }),
        keyframe(0, { opacity: 0, transform: [translate3d(0, '-3000px', 0), scaleY(3)] }),
        keyframe(60, { opacity: 1, transform: [translate3d(0, '25px', 0), scaleY(0.9)] }),
        keyframe(75, { transform: [translate3d(0, '-10px', 0), scaleY(0.95)] }),
        keyframe(90, { transform: [translate3d(0, '5px', 0), scaleY(0.985)] }),
        keyframe(100, { transform: translate3d(0, 0, 0) }),
    ];
    const bounceInUp = [
        keyframe([0, 60, 75, 90, 100], { animationTimingFunction: cubicBezier(0.215, 0.61, 0.355, 1) }),
        keyframe(0, { opacity: 0, transform: [translate3d(0, '-3000px', 0), scaleY(3)] }),
        keyframe(60, { opacity: 1, transform: [translate3d(0, '25px', 0), scaleY(0.9)] }),
        keyframe(75, { transform: [translate3d(0, '-10px', 0), scaleY(0.95)] }),
        keyframe(90, { transform: [translate3d(0, '5px', 0), scaleY(0.985)] }),
        keyframe(100, { transform: translate3d(0, 0, 0) }),
    ];
    const bounceInLeft = [
        keyframe([0, 60, 75, 90, 100], { animationTimingFunction: cubicBezier(0.215, 0.61, 0.355, 1) }),
        keyframe(0, { opacity: 0, transform: [translate3d('-3000px', 0, 0), scaleY(3)] }),
        keyframe(60, { opacity: 1, transform: [translate3d('25px', 0, 0), scaleY(0.9)] }),
        keyframe(75, { transform: [translate3d('-10px', 0, 0), scaleY(0.95)] }),
        keyframe(90, { transform: [translate3d('5px', 0, 0), scaleY(0.985)] }),
        keyframe(100, { transform: translate3d(0, 0, 0) }),
    ];
    const bounceInRight = [
        keyframe([0, 60, 75, 90, 100], { animationTimingFunction: cubicBezier(0.215, 0.61, 0.355, 1) }),
        keyframe(0, { opacity: 0, transform: [translate3d('3000px', 0, 0), scaleY(3)] }),
        keyframe(60, { opacity: 1, transform: [translate3d('-25px', 0, 0), scaleY(0.9)] }),
        keyframe(75, { transform: [translate3d('10px', 0, 0), scaleY(0.95)] }),
        keyframe(90, { transform: [translate3d('-5px', 0, 0), scaleY(0.985)] }),
        keyframe(100, { transform: translate3d(0, 0, 0) }),
    ];
    const bounceOutDown = [
        keyframe(20, { transform: [translate3d(0, '10px', 0), scaleY(0.985)] }),
        keyframe([40, 45], { opacity: 1, transform: [translate3d(0, '-20px', 0), scaleY(0.9)] }),
        keyframe(100, { opacity: 0, transform: [translate3d(0, '2000px', 0), scaleY(3)] }),
    ];
    const bounceOutUp = [
        keyframe(20, { transform: [translate3d(0, '-10px', 0), scaleY(0.985)] }),
        keyframe([40, 45], { opacity: 1, transform: [translate3d(0, '20px', 0), scaleY(0.9)] }),
        keyframe(100, { opacity: 0, transform: [translate3d(0, '-2000px', 0), scaleY(3)] }),
    ];
    const bounceOutLeft = [
        keyframe(20, { opacity: 1, transform: [translate3d('20px', 0, 0), scaleX(2)] }),
        keyframe(100, { opacity: 0, transform: [translate3d('-2000px', 0, 0), scaleX(2)] })
    ];
    const bounceOutRight = [
        keyframe(20, { opacity: 1, transform: [translate3d('-20px', 0, 0), scaleX(2)] }),
        keyframe(100, { opacity: 0, transform: [translate3d('2000px', 0, 0), scaleX(2)] })
    ];

    const swing = [
        keyframe(20, { transform: rotate3d(0, 0, 1, '15deg') }),
        keyframe(40, { transform: rotate3d(0, 0, 1, '-10deg') }),
        keyframe(60, { transform: rotate3d(0, 0, 1, '5deg') }),
        keyframe(80, { transform: rotate3d(0, 0, 1, '-5deg') }),
        keyframe(100, { transform: rotate3d(0, 0, 1, '0deg') }),
    ];

    const flash = [
        keyframe([0, 50, 100], {
            opacity: 1
        }),
        keyframe([25, 75], {
            opacity: 0
        })
    ];

    const shakeX = [
        keyframe([0, 100], { transform: translate3d(0, 0, 0) }),
        keyframe([10, 30, 50, 70, 90], { transform: translate3d('-10px', 0, 0) }),
        keyframe([20, 40, 60, 80], { transform: translate3d('10px', 0, 0) }),
    ];
    const shakeY = [
        keyframe([0, 100], { transform: translate3d(0, 0, 0) }),
        keyframe([10, 30, 50, 70, 90], { transform: translate3d(0, '-10px', 0) }),
        keyframe([20, 40, 60, 80], { transform: translate3d(0, '10px', 0) }),
    ];

    const pulse = [
        keyframe(0, {
            transform: scale3d(1, 1, 1)
        }),
        keyframe(50, {
            transform: scale3d(1.05, 1.05, 1.05)
        }),
        keyframe(100, {
            transform: scale3d(1, 1, 1)
        }),
    ];

    const backInDown = [
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
    ];
    const backInUp = [
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
    ];
    const backInLeft = [
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
    ];
    const backInRight = [
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
    ];
    const backOutDown = [
        keyframe(0, {
            transform: scale(1),
            opacity: 1
        }),
        keyframe(20, {
            transform: [translateY('0px'), scale(0.7)],
            opacity: 0.7
        }),
        keyframe(100, {
            transform: [translateY('700px'), scale(0.7)],
            opacity: 0.7
        }),
    ];
    const backOutUp = [
        keyframe(0, {
            transform: scale(1),
            opacity: 1
        }),
        keyframe(20, {
            transform: [translateY('0px'), scale(0.7)],
            opacity: 0.7
        }),
        keyframe(100, {
            transform: [translateY('-700px'), scale(0.7)],
            opacity: 0.7
        }),
    ];
    const backOutLeft = [
        keyframe(0, {
            transform: scale(1),
            opacity: 1
        }),
        keyframe(20, {
            transform: [translateX('0px'), scale(0.7)],
            opacity: 0.7
        }),
        keyframe(100, {
            transform: [translateX('-2000px'), scale(0.7)],
            opacity: 0.7
        }),
    ];
    const backOutRight = [
        keyframe(0, {
            transform: scale(1),
            opacity: 1
        }),
        keyframe(20, {
            transform: [translateX('0px'), scale(0.7)],
            opacity: 0.7
        }),
        keyframe(100, {
            transform: [translateX('2000px'), scale(0.7)],
            opacity: 0.7
        }),
    ];

    const flip = [
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
    ];
    const flipInX = [
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
    ];
    const flipInY = [
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
    ];
    const flipOutX = [
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
    ];
    const flipOutY = [
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
    ];

    const headShake = [
        keyframe(0, { transform: translateX('0px') }),
        keyframe(6.5, { transform: [translateX('-6px'), rotateY(-9)] }),
        keyframe(18.5, { transform: [translateX('5px'), rotateY(7)] }),
        keyframe(31.5, { transform: [translateX('-3px'), rotateY(-5)] }),
        keyframe(43.5, { transform: [translateX('2px'), rotateY(3)] }),
        keyframe(50, { transform: translateX('0px') }),
    ];

    const lightSpeedInRight = [
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
    ];
    const lightSpeedInLeft = [
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
    ];
    const lightSpeedOutRigt = [
        keyframe(0, {
            opacity: 1
        }),
        keyframe(100, {
            transform: [translate3d('100%', 0, 0), skewX(30)],
            opacity: 0
        }),
    ];
    const lightSpeedOutLeft = [
        keyframe(0, {
            opacity: 1
        }),
        keyframe(100, {
            transform: [translate3d('-100%', 0, 0), skewX(-30)],
            opacity: 0
        }),
    ];

    const rubberBand = [
        keyframe(0, { transform: scale3d(1, 1, 1) }),
        keyframe(30, { transform: scale3d(1.25, 0.75, 1) }),
        keyframe(40, { transform: scale3d(0.75, 1.25, 1) }),
        keyframe(50, { transform: scale3d(1.15, 0.85, 1) }),
        keyframe(65, { transform: scale3d(0.95, 1.05, 1) }),
        keyframe(75, { transform: scale3d(1.05, 0.95, 1) }),
        keyframe(100, { transform: scale3d(1, 1, 1) }),
    ];

    const heartBeat = [
        keyframe(0, {
            transform: scale(1)
        }),
        keyframe(14, {
            transform: scale(1.3)
        }),
        keyframe(28, {
            transform: scale(1)
        }),
        keyframe(42, {
            transform: scale(1.3)
        }),
        keyframe(70, {
            transform: scale(1)
        })
    ];

    const wobble = [
        keyframe(0, {
            transform: translate3d(0, 0, 0)
        }),
        keyframe(15, {
            transform: [translate3d('-25%', 0, 0), rotate3d(0, 0, 1, '-5deg')]
        }),
        keyframe(30, {
            transform: [translate3d('25%', 0, 0), rotate3d(0, 0, 1, '3deg')]
        }),
        keyframe(45, {
            transform: [translate3d('-15%', 0, 0), rotate3d(0, 0, 1, '-3deg')]
        }),
        keyframe(60, {
            transform: [translate3d('10%', 0, 0), rotate3d(0, 0, 1, '2deg')]
        }),
        keyframe(75, {
            transform: [translate3d('-5%', 0, 0), rotate3d(0, 0, 1, '-1deg')]
        }),
        keyframe(100, {
            transform: translate3d(0, 0, 0)
        })
    ];

    const rotateIn = [
        keyframe(0, { transform: rotate3d(0, 0, 1, '-200deg'), opacity: 0 }),
        keyframe(100, { transform: translate3d(0, 0, 0), opacity: 1 }),
    ];
    const rotateInDownLeft = [
        keyframe(0, { transform: rotate3d(0, 0, 1, '-45deg'), opacity: 0 }),
        keyframe(100, { transform: translate3d(0, 0, 0), opacity: 1 }),
    ];
    const rotateInDownRight = [
        keyframe(0, { transform: rotate3d(0, 0, 1, '45deg'), opacity: 0 }),
        keyframe(100, { transform: translate3d(0, 0, 0), opacity: 1 }),
    ];
    const rotateInUpLeft = [
        keyframe(0, { transform: rotate3d(0, 0, 1, '45deg'), opacity: 0 }),
        keyframe(100, { transform: translate3d(0, 0, 0), opacity: 1 }),
    ];
    const rotateInUpRight = [
        keyframe(0, { transform: rotate3d(0, 0, 1, '-90deg'), opacity: 0 }),
        keyframe(100, { transform: translate3d(0, 0, 0), opacity: 1 }),
    ];
    const rotateOut = [
        keyframe(0, { opacity: 1 }),
        keyframe(100, { transform: rotate3d(0, 0, 1, '200deg'), opacity: 0 }),
    ];
    const rotateOutDownLeft = [
        keyframe(0, { opacity: 1 }),
        keyframe(100, { transform: rotate3d(0, 0, 1, '90deg'), opacity: 0 }),
    ];
    const rotateOutDownRight = [
        keyframe(0, { opacity: 1 }),
        keyframe(100, { transform: rotate3d(0, 0, 1, '90deg'), opacity: 0 }),
    ];
    const rotateOutUpLeft = [
        keyframe(0, { opacity: 1 }),
        keyframe(100, { transform: rotate3d(0, 0, 1, '-45deg'), opacity: 0 }),
    ];
    const rotateOutUpRight = [
        keyframe(0, { opacity: 1 }),
        keyframe(100, { transform: rotate3d(0, 0, 1, '90deg'), opacity: 0 }),
    ];

    const fadeIn = [
        keyframe(0, { opacity: 0 }),
        keyframe(100, { opacity: 1 })
    ];
    const fadeInDown = [
        keyframe(0, { opacity: 0, transform: translate3d(0, '-100%', 0) }),
        keyframe(100, { opacity: 1, transform: translate3d(0, 0, 0) })
    ];
    const fadeInDownBig = [
        keyframe(0, { opacity: 0, transform: translate3d(0, '-2000px', 0) }),
        keyframe(100, { opacity: 1, transform: translate3d(0, 0, 0) })
    ];
    const fadeInLeft = [
        keyframe(0, { opacity: 0, transform: translate3d('-100%', 0, 0) }),
        keyframe(100, { opacity: 1, transform: translate3d(0, 0, 0) })
    ];
    const fadeInLeftBig = [
        keyframe(0, { opacity: 0, transform: translate3d('-2000px', 0, 0) }),
        keyframe(100, { opacity: 1, transform: translate3d(0, 0, 0) })
    ];
    const fadeInRight = [
        keyframe(0, { opacity: 0, transform: translate3d('100%', 0, 0) }),
        keyframe(100, { opacity: 1, transform: translate3d(0, 0, 0) })
    ];
    const fadeInRightBig = [
        keyframe(0, { opacity: 0, transform: translate3d('2000px', 0, 0) }),
        keyframe(100, { opacity: 1, transform: translate3d(0, 0, 0) })
    ];
    const fadeInUp = [
        keyframe(0, { opacity: 0, transform: translate3d(0, '100%', 0) }),
        keyframe(100, { opacity: 1, transform: translate3d(0, 0, 0) })
    ];
    const fadeInUpBig = [
        keyframe(0, { opacity: 0, transform: translate3d(0, '2000px', 0) }),
        keyframe(100, { opacity: 1, transform: translate3d(0, 0, 0) })
    ];
    const fadeInTopLeft = [
        keyframe(0, { opacity: 0, transform: translate3d('-100%', '-100%', 0) }),
        keyframe(100, { opacity: 1, transform: translate3d(0, 0, 0) })
    ];
    const fadeInTopRight = [
        keyframe(0, { opacity: 0, transform: translate3d('100%', '-100%', 0) }),
        keyframe(100, { opacity: 1, transform: translate3d(0, 0, 0) })
    ];
    const fadeInBottomLeft = [
        keyframe(0, { opacity: 0, transform: translate3d('-100%', '100%', 0) }),
        keyframe(100, { opacity: 1, transform: translate3d(0, 0, 0) })
    ];
    const fadeInBottomRight = [
        keyframe(0, { opacity: 0, transform: translate3d('100%', '-100%', 0) }),
        keyframe(100, { opacity: 1, transform: translate3d(0, 0, 0) })
    ];
    const fadeOut = [
        keyframe(0, { opacity: 1 }),
        keyframe(100, { opacity: 0 })
    ];
    const fadeOutDown = [
        keyframe(0, { opacity: 1 }),
        keyframe(100, { opacity: 0, transform: translate3d(0, '100%', 0) })
    ];
    const fadeOutDownBig = [
        keyframe(0, { opacity: 1 }),
        keyframe(100, { opacity: 0, transform: translate3d(0, '2000px', 0) })
    ];
    const fadeOutLeft = [
        keyframe(0, { opacity: 1 }),
        keyframe(100, { opacity: 0, transform: translate3d('-100%', 0, 0) })
    ];
    const fadeOutLeftBig = [
        keyframe(0, { opacity: 1 }),
        keyframe(100, { opacity: 0, transform: translate3d('-2000px', 0, 0) })
    ];
    const fadeOutRight = [
        keyframe(0, { opacity: 1 }),
        keyframe(100, { opacity: 0, transform: translate3d('100%', 0, 0) })
    ];
    const fadeOutRightBig = [
        keyframe(0, { opacity: 1 }),
        keyframe(100, { opacity: 0, transform: translate3d('2000px', 0, 0) })
    ];
    const fadeOutUp = [
        keyframe(0, { opacity: 1 }),
        keyframe(100, { opacity: 0, transform: translate3d(0, '-100%', 0) })
    ];
    const fadeOutUpBig = [
        keyframe(0, { opacity: 1 }),
        keyframe(100, { opacity: 0, transform: translate3d(0, '-2000px', 0) })
    ];
    const fadeOutTopLeft = [
        keyframe(0, { opacity: 1, transform: translate3d(0, 0, 0) }),
        keyframe(100, { opacity: 0, transform: translate3d('-100%', '-100%', 0) })
    ];
    const fadeOutTopRight = [
        keyframe(0, { opacity: 1, transform: translate3d(0, 0, 0) }),
        keyframe(100, { opacity: 0, transform: translate3d('100%', '-100%', 0) })
    ];
    const fadeOutBottomRight = [
        keyframe(0, { opacity: 1, transform: translate3d(0, 0, 0) }),
        keyframe(100, { opacity: 0, transform: translate3d('100%', '100%', 0) })
    ];
    const fadeOutBottomLeft = [
        keyframe(0, { opacity: 1, transform: translate3d(0, 0, 0) }),
        keyframe(100, { opacity: 0, transform: translate3d('-100%', '100%', 0) })
    ];

    const animationFrames = {
        // slide 滑动
        slideInDown, slideInLeft, slideInRight, slideInUp, slideOutDown, slideOutLeft, slideOutRight, slideOutUp,
        // zoom 缩放
        zoomIn, zoomInDown, zoomInLeft, zoomInRight, zoomInUp, zoomOut, zoomOutDown, zoomOutLeft, zoomOutRight, zoomOutUp,
        // specials 特殊动画
        hinge, jackInTheBox, rollIn, rollOut,
        // 弹跳
        bounce, bounceIn, bounceInDown, bounceInLeft, bounceInRight, bounceInUp, bounceOut, bounceOutDown, bounceOutLeft, bounceOutRight, bounceOutUp,
        // 摇摆
        swing,
        // 闪烁
        flash,
        // 抖动
        shakeX, shakeY,
        // 脉搏
        pulse,
        // 出场
        backInDown, backInLeft, backInRight, backInUp, backOutDown, backOutLeft, backOutRight, backOutUp,
        // 翻动
        flip, flipInX, flipInY, flipOutX, flipOutY,
        // 摇头
        headShake,
        // 光速
        lightSpeedInLeft, lightSpeedInRight, lightSpeedOutLeft, lightSpeedOutRigt,
        // 橡皮筋
        rubberBand,
        // 心跳
        heartBeat,
        // 摇晃
        wobble,
        // 旋转
        rotateIn, rotateInDownLeft, rotateInDownRight, rotateInUpLeft, rotateInUpRight, rotateOut, rotateOutDownLeft, rotateOutDownRight, rotateOutUpLeft, rotateOutUpRight,
        // 淡入淡出
        fadeIn, fadeInBottomLeft, fadeInBottomRight, fadeInDown, fadeInDownBig, fadeInLeft, fadeInLeftBig, fadeInRight, fadeInRightBig, fadeInTopLeft,
        fadeInTopRight, fadeInUp, fadeInUpBig, fadeOut, fadeOutBottomLeft, fadeOutBottomRight, fadeOutDown, fadeOutDownBig, fadeOutLeft, fadeOutLeftBig,
        fadeOutRight, fadeOutRightBig, fadeOutTopLeft, fadeOutTopRight, fadeOutUp, fadeOutUpBig,
    };
    // 这里可以控制 keyframes 的名称 ， 并没有直接生成完整的keyframes
    const animations = Object.entries(animationFrames).map(([name, frames]) => keyframes(name, frames));
    // 关于 animate的class
    let animationClassStyleSheet, animationClassRecord = {};
    function initAnimationClass(className) {
        if (!className.startsWith('animate_') || animationClassRecord[className]) {
            return;
        }
        let targetSheet = animationClassStyleSheet ||= mount(createStyleSheet(null, animations), document.head);
        let declaration = className.split('animate_')[1].split('_');
        mountStyleRule(targetSheet, createStyle('.' + className, { animation: declaration }));
    }
    const installAnimation = () => {
        // 挂载所有动画帧
        mount(createStyleSheet(null, animations), document.head);
        onBeforeClassMount(initAnimationClass);
    };

    function setElementTranstion(el) {
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
    const createTransition = (options) => new TransitionDesc(options);
    // 整个transtion描述不参与节点的真实挂载卸载，显示或隐藏
    class TransitionDesc {
        type; // css / animation
        name;
        duration; // css一般不需要
        enterKeyframes;
        leaveKeyframes;
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
        onBeforeAppear;
        onAppear;
        onAfterAppear;
        onAppearCancelled;
        constructor(options) {
            this.update(options);
        }
        update(options) {
            options ||= emptyObject;
            this.name = options.name || 'transition';
            this.type = options.type || 'css'; // 默认采用 css
            // 该元素在组件中是否为第一次渲染
            this.appear = options.appear || false;
            this.duration = options.duration;
            this.onBeforeEnter = options.onBeforeEnter;
            this.onEnter = options.onEnter;
            this.onAfterEnter = options.onAfterEnter;
            this.onEnterCancelled = options.onEnterCancelled;
            this.onBeforeLeave = options.onBeforeLeave;
            this.onLeave = options.onLeave;
            this.onAfterLeave = options.onAfterLeave;
            this.onLeaveCancelled = options.onLeaveCancelled;
            this.onBeforeAppear = options.onBeforeAppear;
            this.onAppear = options.onAppear;
            this.onAfterAppear = options.onAfterAppear;
            this.onAppearCancelled = options.onAppearCancelled;
            this.enterKeyframes = options.enterKeyframes;
            this.leaveKeyframes = options.leaveKeyframes;
        }
        bindeEnterClass = (el) => bindEnterClass(el, this.name);
        bindeLeaveClass = (el) => bindLeaveClass(el, this.name);
        removeEnterClass = (el) => removeEnterClass(el, this.name);
        removeLeaveClass = (el) => removeLeaveClass(el, this.name);
        callHook = (hookName, ...args) => {
            let _this = this;
            let hook = _this[`on${initialUpperCase(hookName)}`];
            if (hook) {
                hook.call(_this, ...args);
            }
        };
        beforeEnter() { }
        beforeLeave() { }
        cancelEnter() { }
        canceleave() { }
        // 关于 transition group
        processMount(newEl, insertFn) {
            let { patchKey, instance } = newEl._vnode;
            let appearRecord = instance.appearRecord ||= {};
            let appeared = appearRecord[patchKey];
            if (!this.appear && !appeared) {
                // appear
                insertFn();
                appearRecord[patchKey] = true;
                return;
            }
            let leavingEl = leavingElements[patchKey];
            if (leavingEl) {
                // 上个元素还没卸载完成（过渡中） 直接卸载 , 不管是css过渡还是动画过度，直接卸载即可
                removeElement(leavingEl);
                leavingElements[patchKey] = null;
            }
            // 进入动画挂载
            insertFn();
            appearRecord[patchKey] = true;
            newEl._entering = true;
            if (this.type === 'animate') {
                newEl.cancelKeyframes = doKeyframesAnimation(newEl, {
                    name: this.enterKeyframes,
                    duration: this.duration,
                });
                onceListener(newEl, 'animationend', () => {
                    // after enter
                    newEl._entering = false;
                });
            }
            else if (this.type === 'css') {
                this.bindeEnterClass(newEl);
                onceListener(newEl, 'transitionend', () => {
                    // after enter
                    this.removeEnterClass(newEl);
                    newEl._entering = false;
                });
            }
            else {
                // 其他类型 ， 开发中
                insertFn();
            }
        }
        processUnmount(el) {
            let { patchKey } = el._vnode;
            // 正在进入 ，取消进入动画, 进入卸载东动画
            if (el._entering) {
                if (this.type === 'css') {
                    this.removeEnterClass(el);
                }
                else if (this.type === 'animate') {
                    el.cancelKeyframes();
                }
            }
            leavingElements[patchKey] = el;
            if (this.type === 'css') {
                this.bindeLeaveClass(el);
                onceListener(el, 'transitionend', () => {
                    // 元素直接卸载就不需要卸载class了
                    removeElement(el);
                    leavingElements[patchKey] = null;
                });
            }
            else if (this.type === 'animate') {
                doKeyframesAnimation(el, {
                    name: this.leaveKeyframes,
                    duration: this.duration
                });
                onceListener(el, 'animationend', () => {
                    // 元素直接卸载就不需要卸载class了
                    removeElement(el);
                    leavingElements[patchKey] = null;
                });
            }
            else {
                // 其他类型 ， 开发中
                removeElement(el);
            }
        }
        // show todo
        processShow(el) {
            // appear 好像蹭挂载的就可以了
            // enter
            if (el._leaving) {
                // cancel leave
                this.removeLeaveClass(el);
                el._leaving = false;
                // 此时如果进入进入动画的话，会使用过渡，而不是直接设为
                // 按逻辑说应该设为none，但好像没必要
            }
            el._entering = true;
            setDisplay(el, true);
            // 解决bug，让元素重新挂载一次
            remountElement(el);
            this.bindeEnterClass(el);
            onceListener(el, 'transitionend', () => {
                this.removeEnterClass(el);
                setDisplay(el, true);
                el._entering = false;
            });
        }
        processHide(el) {
            if (el._entering) {
                // cancel
                this.removeEnterClass(el);
                el._entering = false;
            }
            el._leaving = true;
            this.bindeLeaveClass(el);
            onceListener(el, 'transitionend', () => {
                this.removeLeaveClass(el);
                el._leaving = false;
                setDisplay(el, false);
            });
        }
    }

    // 第一次进入任何元素都不会过渡
    const transitionGroupComponent = {
        render: ({ $slots }) => $slots.default(),
        beforeUpdate({ $instance: { vnode, renderingVnode }, $props }) {
            const transition = createTransition($props);
            // always true
            transition.appear = true;
            const mountList = renderingVnode.filter((patchKey) => !vnode.map((_) => _.patchKey).includes(patchKey));
            const unmountList = vnode.filter((patchKey) => !renderingVnode.map((_) => _.patchKey).includes(patchKey));
            const transitionList = mountList.concat(unmountList);
            transitionList.forEach((_) => {
                _.transition = transition;
            });
        }
    };
    const transitionComponent = {
        render: ({ $slots }) => $slots.default(),
        beforeMount({ $instance: { renderingVnode }, $props }) {
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
    const transitionDirective = {
        beforeCreate(_, { value }, vnode) {
            vnode.transition = createTransition(value);
        },
        beforeUpdate(_, { value }, nVnode, pVnode) {
            if (!pVnode) {
                // 此时为组件自更新
                return;
            }
            const transition = pVnode.transition;
            transition.update(value);
            nVnode.transition = transition; // extend
        }
    };
    const transitionGroupDirective = {
        beforeUpdate() {
            debugger;
        }
    };

    const body = document.body;
    const defaultTeleportOptions = {
        to: body,
        anchor: null,
        disabled: false
    };
    function normalizeElement(selectorOrElement) {
        if (isString(selectorOrElement)) {
            try {
                selectorOrElement = document.querySelector(selectorOrElement);
            }
            catch (e) {
                return null;
            }
        }
        if (!(selectorOrElement instanceof Element)) {
            return null;
        }
        return selectorOrElement;
    }
    function Teleport(props, { default: _default }, nVnode, pVnode) {
        console.log('teleport update');
        props ||= defaultTeleportOptions;
        let { to: container, anchor, disabled } = props;
        container = normalizeElement(container) || body;
        anchor = normalizeElement(anchor);
        let renderingVnode = processVnodePrerender(_default());
        if (pVnode) {
            // 节点更新 , 参数可能会变
            let { to: pContainer, anchor: pAnchor, disabled: pDisabled } = pVnode.props || defaultTeleportOptions;
            pContainer = normalizeElement(pContainer) || body;
            pAnchor = normalizeElement(pAnchor);
            let instance = pVnode.instance;
            let teleportedVnode = pVnode.teleportedVnode;
            if (disabled && !pDisabled) {
                // 卸载
                patch(teleportedVnode, null, pContainer, pAnchor, instance); // 卸载之前的
                nVnode.teleportedVnode = null; // 清空已传送节点
                nVnode.teleportedVnodeContainer = null;
                nVnode.teleportedVnodeAnchor = null;
            }
            else if (!disabled && pDisabled) {
                // 挂载
                patch(null, renderingVnode, container, anchor, instance); // 挂载新的
                nVnode.teleportedVnode = renderingVnode;
                nVnode.teleportedVnodeContainer = container;
                nVnode.teleportedVnodeAnchor = anchor;
            }
            else {
                // 更新
                if (container !== pContainer || anchor !== pAnchor) {
                    patch(teleportedVnode, null, pContainer, pAnchor, instance); // 卸载之前的
                    patch(null, renderingVnode, container, anchor, instance); // 挂载新的
                    nVnode.teleportedVnode = renderingVnode;
                    nVnode.teleportedVnodeContainer = container;
                    nVnode.teleportedVnodeAnchor = anchor;
                }
                else {
                    patch(teleportedVnode, renderingVnode, container, anchor, instance);
                    nVnode.teleportedVnode = renderingVnode;
                    nVnode.teleportedVnodeContainer = container;
                    nVnode.teleportedVnodeAnchor = anchor;
                }
            }
        }
        else {
            // 第一次挂载
            if (disabled) ;
            else {
                patch(null, renderingVnode, container, anchor, nVnode.instance); // 传送
                nVnode.teleportedVnode = renderingVnode;
            }
        }
        // disabled生效 ，直接渲染空节点
        return disabled ? renderingVnode : null;
    }

    // global reactive url
    ref('666');

    function RouterView(props, slots, vnode, pVnode) {
        vnode.instance;
        return '路由视图';
    }
    function RouterLink({ to, replace, activeClass }) {
    }

    const builtInComponents = {
        transition: transitionComponent,
        transitionGroup: transitionGroupComponent,
        Teleport,
        RouterLink,
        RouterView
    };
    const builtInDirectives = {
        modelText: modelText,
        modelTextarea: modelText,
        modelCheckbox: modelCheckbox,
        modelRadio: modelRadio,
        modelRange: modelRange,
        modelColor: modelColor,
        modelSelectOne: modelSelectOne,
        modelSelectMultiple: modelSelectMultiple,
        show: showDirective,
        transition: transitionDirective,
        transitionGroup: transitionGroupDirective,
    };

    // app.config.responsive
    const responsiveLayoutMedia = {
        xs: '(max-width:768px)',
        sm: '(min-width:768px) and (max-width:992px)',
        md: '(min-width:992px) and (max-width:1200px)',
        lg: '(min-width:1200px) and (max-width:1920px)',
        xl: '(min-width:1920px)'
    };

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

    //  基于 vnode 的元素选择器，在vnode树中查找元素，必须是处理过的树，也可以查询组件等
    /*
        *  所有元素
        #  id 选择器
        .  class 选择器
        普通标签选择 ， 组件会返回实例
    */
    // 如果是组件标签的话，直接通过实例身上的components，可获得组件的type
    var QuerySelectorType;
    (function (QuerySelectorType) {
        QuerySelectorType[QuerySelectorType["ID"] = 0] = "ID";
        QuerySelectorType[QuerySelectorType["CLASS"] = 1] = "CLASS";
        QuerySelectorType[QuerySelectorType["ELEMENT_TYPE"] = 2] = "ELEMENT_TYPE";
        QuerySelectorType[QuerySelectorType["COMPONENT_TYPE"] = 3] = "COMPONENT_TYPE";
        QuerySelectorType[QuerySelectorType["RENDER_COMPONENT_TYPE"] = 4] = "RENDER_COMPONENT_TYPE"; // 渲染函数没有实例
    })(QuerySelectorType || (QuerySelectorType = {}));
    function parseQuerySelector(selector) {
        let type, value;
        if (isFunction(selector)) {
            // render component
            type = QuerySelectorType.RENDER_COMPONENT_TYPE;
            value = selector;
        }
        else if (isObject(selector)) {
            type = QuerySelectorType.COMPONENT_TYPE;
            value = selector;
        }
        else if (selector.startsWith('.')) {
            type = QuerySelectorType.CLASS;
            value = selector.slice(1);
        }
        else if (selector.startsWith('#')) {
            type = QuerySelectorType.ID;
            value = selector.slice(1);
        }
        else {
            type = QuerySelectorType.ELEMENT_TYPE;
            value = selector;
        }
        return {
            type,
            value
        };
    }
    function querySelector(selector, vnode) {
        if (!selector || !vnode) {
            return null;
        }
        let { type, value } = parseQuerySelector(selector);
        return doQuerySelector(value, type, vnode);
    }
    function doQuerySelector(selector, type, vnode) {
        let result = null;
        // vnode 始终是数组形式 
        for (let item of vnode) {
            if (type === QuerySelectorType.CLASS) {
                // class 中 selector 为 true
                if (item?.props?.class?.[selector]) {
                    result = item.el || item.instance;
                    break;
                }
            }
            else if (type === QuerySelectorType.ID) {
                if (item?.props?.id === selector) {
                    result = item.el || item.instance;
                    break;
                }
            }
            else if (type === QuerySelectorType.ELEMENT_TYPE || type === QuerySelectorType.COMPONENT_TYPE) {
                if (item.type === selector) {
                    result = item.el || item.instance; // 元素节点身上也有 instance属性
                    break;
                }
            }
            else if (type === QuerySelectorType.RENDER_COMPONENT_TYPE) {
                // render component 暂时没有相应的元素或实例
                // 或者 render component 返回对应的子元素或实例
                result = null;
            }
            else {
                continue;
            }
            if (item.children && (item.nodeType == 13 /* HTML_ELEMENT */ || item.nodeType == 9 /* SVG_ELEMENT */)) {
                // 有状态组件，无状态组件，样式表 不会寻找子元素
                result = doQuerySelector(selector, type, item.children);
            }
        }
        return result;
    }
    function querySelectorAll(selector, vnode) {
        if (!selector || !vnode) {
            return null;
        }
        let { type, value } = parseQuerySelector(selector);
        return doQuerySelectorAll(value, type, vnode, []);
    }
    function doQuerySelectorAll(selector, type, vnode, results) {
        for (let item of vnode) {
            if (type === QuerySelectorType.CLASS) {
                // class 中 selector 为 true
                if (item?.props?.class?.[selector]) {
                    results.push(item.el || item.instance);
                }
            }
            else if (type === QuerySelectorType.ID) {
                if (item?.props?.id === selector) {
                    results.push(item.el || item.instance);
                }
            }
            else if (type === QuerySelectorType.ELEMENT_TYPE || type === QuerySelectorType.COMPONENT_TYPE) {
                if (item.type === selector) {
                    results.push(item.el || item.instance);
                }
            }
            else if (type === QuerySelectorType.RENDER_COMPONENT_TYPE) ;
            else {
                continue;
            }
            if (item.children && (item.nodeType == 13 /* HTML_ELEMENT */ || item.nodeType == 9 /* SVG_ELEMENT */)) {
                // 有状态组件，无状态组件，样式表 不会寻找子元素
                doQuerySelectorAll(selector, type, item.children, results);
            }
        }
        return results;
    }

    const scopeProperties = {
        _currentPropertyAccessInstance: null,
        get $app() {
            return getCurrentApp();
        },
        get $uid() {
            return this._currentPropertyAccessInstance.uid;
        },
        get $uuid() {
            return uid();
        },
        get $options() {
            return this._currentPropertyAccessInstance.options;
        },
        get $instance() {
            return this._currentPropertyAccessInstance;
        },
        get $refs() {
            return this._currentPropertyAccessInstance.refs ||= {}; // 确保组件没挂载时可以拿到 refs
        },
        get $colors() {
            return getCurrentApp().colors;
        },
        get $el() {
            let { vnode, isMounted } = this._currentPropertyAccessInstance;
            if (!isMounted || !vnode) {
                return null;
            }
            // 不会包括style元素
            let els = getEdgeElements(vnode.filter((_vnode) => _vnode.type !== 'style'));
            // 有多个根元素会返回多个元素
            return els.length === 1 ? els[0] : els;
        },
        get $root() {
            return this._currentPropertyAccessInstance.root;
        },
        get $props() {
            return this._currentPropertyAccessInstance.props;
        },
        get $attrs() {
            return this._currentPropertyAccessInstance.attrs ||= {};
        },
        get $slots() {
            return this._currentPropertyAccessInstance.slots;
        },
        get $parent() {
            return this._currentPropertyAccessInstance.parent;
        },
        get $watch() {
            return this._currentPropertyAccessInstance.watch;
        },
        get $nextTick() {
            return nextTick.bind(this._currentPropertyAccessInstance.scope);
        },
        get $self() {
            return this._currentPropertyAccessInstance.scope;
        },
        get $forceUpdate() {
            if (!this._currentPropertyAccessInstance.isMounted) {
                return this._currentPropertyAccessInstance.update;
            }
        },
        // evnets
        get $emit() {
            return this._currentPropertyAccessInstance.emit;
        },
        get $on() {
            return this._currentPropertyAccessInstance.on;
        },
        get $off() {
            return this._currentPropertyAccessInstance.off;
        },
        get $once() {
            return this._currentPropertyAccessInstance.once;
        },
        // 查询当前组件内的元素 , 组件的话返回组件实例
        get $querySelector() {
            return (selector) => {
                // 先当做组件选择器，如果不是定义的组件则当做普通元素
                let type = this._currentPropertyAccessInstance?.components?.[selector] || selector;
                return querySelector(type, this._currentPropertyAccessInstance.vnode);
            };
        },
        get $querySelectorAll() {
            return (selector) => {
                // 先当做组件选择器，如果不是定义的组件则当做普通元素
                let type = this._currentPropertyAccessInstance?.components?.[selector] || selector;
                return querySelectorAll(type, this._currentPropertyAccessInstance.vnode);
            };
        },
    };
    const defineScopeProperty = (key, property) => scopeProperties[key] = property;
    const protoMethods = {
        debounce,
        throttle,
        lighten,
        darken,
        saturate,
        desaturate,
        opacity,
        ...cssMethods,
    };
    // inject scope property
    function createScope(instance) {
        const scope = reactive(Object.create(protoMethods));
        return new Proxy(scope, {
            get(target, key, receiver) {
                scopeProperties._currentPropertyAccessInstance = instance;
                let value = hasOwn(scopeProperties, key) ? scopeProperties[key] : Reflect.get(target, key, receiver);
                return value;
            },
            set(target, key, newValue, receiver) {
                if (hasOwn(scopeProperties, key)) {
                    // 实例方法不能设置
                    return true;
                }
                // 挂载到作用于上的promise异步数据会被自动请求
                if (isPromise(newValue)) {
                    // 先设置一个默认值,不然会出现bug
                    Reflect.set(target, key, null, receiver);
                    newValue.then((result) => {
                        return Reflect.set(target, key, result, receiver);
                    });
                }
                else {
                    return Reflect.set(target, key, newValue, receiver);
                }
                return true;
            }
        });
    }
    // 这些方法只能提供给模板使用
    const specialTemplateMethods = {
        // 模板会编译成 () => debounce(...) 所以函数会直接调用
        debounce(fn, wait) {
            return cacheDebounce(fn, wait)();
        },
        throttle(fn, wait) {
            return cacheThrottle(fn, wait)();
        },
    };
    function createRenderScope(instanceScope) {
        return new Proxy(instanceScope, {
            get(target, key, receiver) {
                if (hasOwn(specialTemplateMethods, key)) {
                    return specialTemplateMethods[key];
                }
                // todo magic variables
                var result = Reflect.get(target, key, receiver);
                return isRef(result) ? result.value : result;
            }
        });
    }

    // forward
    log(`welcome to use crush.js to build your web application! github: https://github.com/chan-max/Crush`);
    var currentApp;
    function getCurrentApp() {
        return currentApp;
    }
    function createApp(rootComponent) {
        if (currentApp) {
            // 只能有一个应用
            warn('APP', currentApp, 'is runing and there can only be one application in your webpage');
            return;
        }
        const app = {
            isMounted: false,
            rootComponent,
            component,
            directive,
            components: builtInComponents,
            directives: builtInDirectives,
            plugins: new Set(),
            mixin,
            mixins: [],
            use,
            mount: mountApp,
            unmount: unmountApp,
            beforeAppMount: null,
            errorHandler: null,
            warnHandler: null,
            // 全局颜色 $colors
            colors,
            // 按键修饰符
            keyCodes,
            // 事件修饰符
            eventModifiers,
            // config
            // @screens
            customScreens: responsiveLayoutMedia,
            // scope property
            globalProperties: scopeProperties,
            compilerOptions: null,
            // 文本修饰符
            textModifiers,
        };
        currentApp = app;
        // 安装动画
        use(installAnimation);
        function component(name, component) {
            name = camelize(name);
            if (!app.components[name]) {
                app.components[name] = component;
            }
            else {
                warn(`component ${name} is already registered , use another name instead`);
            }
        }
        function mixin(mixin) {
            app.mixins.push(mixin);
        }
        function directive(name, directive) {
            name = camelize(name);
            if (!app.directives[name]) {
                app.directives[name] = directive;
            }
            else {
                warn(`directive ${name} is already registered , use another name instead`);
            }
        }
        function use(plugin, ...options) {
            if (app.plugins.has(plugin))
                return;
            let install = isFunction(plugin) ? plugin : plugin.install;
            install.call(plugin, app, ...options);
            app.plugins.add(plugin);
        }
        function mountApp(container = app.container) {
            if (!container) {
                // 没传入container , 默认使用
                container = document.querySelector('div[id=app]') || mount(createElement('div', { id: 'app' }), document.body, document.body.children[0]);
            }
            else if (isString(container)) {
                let el = document.querySelector(container);
                if (!el) {
                    return error(`can't find element by selector ${container}`);
                }
                else {
                    container = el;
                }
            }
            else if (!(container instanceof HTMLElement)) {
                return error(`container ${container} is not a legal container type`);
            }
            app.container = container;
            app.inlineTemplate = container.innerHTML;
            container.innerHTML = '';
            // 需要在css中设置display:none
            if (container.hasAttribute('s-cloak')) {
                container.style.display = "block";
            }
            if (!app.rootComponent.template && !app.rootComponent.render) {
                app.rootComponent.template = app.inlineTemplate;
            }
            // 执行应用挂载前钩子，可以拿到用户定义的配置信息
            app.beforeAppMount && app.beforeAppMount(app);
            app.rootComponentVnode = createComponent(rootComponent, null, null);
            mount(app.rootComponentVnode, app.container);
            app.isMounted = true;
        }
        function unmountApp() {
            // 卸载已安装的插件
            app.plugins.forEach((plugin) => {
                let uninstall = isObject(plugin) && plugin.uninstall;
                if (uninstall) {
                    uninstall(app);
                }
            });
            unmountComponent(app.rootComponentVnode, app.container);
            app.isMounted = false;
            currentApp = null;
        }
        return app;
    }
    function getCustomScreensMedia(screen) {
        return getCurrentApp().customScreens[screen] || 'screen'; // 默认屏幕 , 所有情况都生效
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
    function injectMapHooks(target, mapHooks) {
        for (let type in mapHooks) {
            injectHook(type, target, mapHooks[type]);
        }
        return target;
    }
    function isElementLifecycleHook(name) {
        return [
            "beforeCreate" /* BEFORE_CREATE */,
            "beforeMount" /* BEFORE_MOUNT */,
            "beforeUnmount" /* BEFORE_UNMOUNT */,
            "beforeUpdate" /* BEFORE_UPDATE */,
            "updated" /* UPDATED */,
            "childrenMounted" /* CHILDREN_MOUNTED */,
            "unmounted" /* UNMOUNTED */,
            "mounted" /* MOUNTED */,
            "created" /* CREATED */
        ].includes(name);
    }
    function isComponentLifecycleHook(name) {
        return [
            "beforeCreate" /* BEFORE_CREATE */,
            "beforeMount" /* BEFORE_MOUNT */,
            "beforeUnmount" /* BEFORE_UNMOUNT */,
            "beforeUpdate" /* BEFORE_UPDATE */,
            "updated" /* UPDATED */,
            "unmounted" /* UNMOUNTED */,
            "mounted" /* MOUNTED */,
            "created" /* CREATED */,
            "activated" /* ACTIVATED */,
            "deactivated" /* DEACTIVATED */,
            "beforeRouteEnter" /* BEFORE_ROUTE_ENTER */,
            "beforeRouteLeave" /* BEFORE_ROUTE_LEAVE */,
            "beforeRouteUpdate" /* BEFORE_ROUTE_UPDATE */
        ].includes(name);
    }
    // is renderComponent hook ???
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
    const onBeforePatch = createHook("beforePatch" /* BEFORE_PATCH */);

    function injectMixin(options, mixin) {
        for (let key in mixin) {
            switch (key) {
                case 'mixins':
                    injectMixins(options, options[key]);
                    break;
                case 'beforeCreate':
                case 'create':
                case 'created':
                case 'beforeMount':
                case 'mounted':
                case 'beforeUpdate':
                case 'updated':
                case 'beforeUnmount':
                case 'unmounted':
                    injectHook(key, options, mixin[key]);
                    break;
                default:
                    debugger;
            }
        }
        // 
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

    function createInstanceWatch(instance) {
        return (source, cb) => {
            let scope = instance.scope;
            if (isString(source)) {
                return watchTargetKey(scope, source, cb);
            }
            else if (isReactive(source)) {
                return watchReactive(source, cb);
            }
            else if (isRef(source)) {
                return watchRef(source, cb);
            }
        };
    }
    // create hook watch , 只能在create钩子中使用
    function watch(source, cb) {
        return getCurrentInstance().watch(source, cb);
    }
    // 更加语义化的
    function onPropsChange(cb) {
        return watchReactive(getCurrentInstance().props, cb);
    }
    function onPropChange(prop, cb) {
        if (!getCurrentInstance().propsOptions[prop]) {
            return;
        }
        return watchTargetKey(getCurrentInstance().props, prop, cb);
    }

    function useCurrentInstanceCache() {
        return getCurrentInstance().cache;
    }
    const createComponentInstance = (options, parent) => {
        let app = getCurrentApp();
        let instance = {
            app,
            parent,
            options,
            cache: getEmptyObject(),
            uid: uid(),
            update: null,
            isMounted: false,
            scope: null,
            renderScope: null,
            vnode: null,
            componentVnode: null,
            updatingComponentVnode: null,
            renderingVnode: null,
            slots: null,
            props: null,
            attrs: null,
            refs: null,
            events: null,
            root: null,
            appearRecord: null,
            emit: null,
            on: null,
            off: null,
            once: null,
            watch: null,
            useScopedStyleSheet: options.useScopedStyleSheet,
            renderEffect: null,
            render: options.render,
            scopedId: options.scopedId,
            propsOptions: options.propsOptions || emptyObject,
            emitsOptions: options.emitsOptions || emptyObject,
            createRender: options.createRender,
            components: shallowCloneObject(options.components),
            directives: options.directives,
            // hooks will always be an array
            create: shallowCloneArray(options.create),
            beforeCreate: shallowCloneArray(options.beforeCreate),
            created: shallowCloneArray(options.created),
            beforeMount: shallowCloneArray(options.beforeMount),
            mounted: shallowCloneArray(options.mounted),
            beforeUnmount: shallowCloneArray(options.beforeUnmount),
            unmounted: shallowCloneArray(options.unmounted),
            beforeUpdate: shallowCloneArray(options.beforeUpdate),
            updated: shallowCloneArray(options.updated),
            beforePatch: shallowCloneArray(options.beforePatch),
            activated: shallowCloneArray(options.activated),
            deactivated: shallowCloneArray(options.deactivated),
            beforeRouteEnter: shallowCloneArray(options.beforeRouteEnter),
            beforeRouteLeave: shallowCloneArray(options.beforeRouteLeave),
            beforeRouteUpdate: shallowCloneArray(options.beforeRouteUpdate)
        };
        injectMixins(instance, options.mixins);
        injectMixins(instance, app.mixins);
        instance.root = parent ? parent.root : instance;
        instance.scope = createScope(instance);
        instance.renderScope = createRenderScope(instance.scope);
        instance.emit = createInstanceEventEmitter(instance);
        instance.on = (event, handler) => addInstanceListener(instance, event, handler);
        instance.off = (event, handler) => removeInstanceListener(instance, event, handler);
        instance.once = (event, handler) => onceInstanceListener(instance, event, handler);
        instance.events = getInstanceEvents(instance);
        instance.watch = createInstanceWatch(instance);
        return instance;
    };

    /*
        pervious 节点存在一定是更新 ， 但可能存在key不相同，此时需要进入节点的卸载和新节点的挂载
    */
    function normalizeDirective(directive) {
        return isFunction(directive) ? {
            mounted: directive,
            updated: directive
        } : directive;
    }
    /*
        参数和修饰符是一个数组结构但自身挂载了所有的key，可以灵活运用
    */
    function processModifiers(arr) {
        for (let key of arr) {
            arr[key] = true;
        }
        arr._self = arr;
        return arr;
    }
    function processHook(type, vnode, pVnode = null) {
        switch (vnode.nodeType) {
            case 14 /* COMPONENT */:
                processComponentHook(type, vnode, pVnode);
                break;
            case 15 /* RENDER_COMPONENT */:
                processRenderComponentHook(type, vnode, pVnode);
                break;
            case 17 /* STYLE */:
            case 13 /* HTML_ELEMENT */:
            case 9 /* SVG_ELEMENT */:
                processElementHook(type, vnode, pVnode);
                break;
        }
    }
    function processComponentHook(type, vnode, pVnode) {
        const instance = vnode.instance;
        // 组件需要处理实例钩子
        const scope = instance.scope;
        callHook(type, instance, { binding: scope }, scope);
        let hookKey = `on${initialUpperCase(type)}`;
        for (let key in (vnode.props || emptyObject)) {
            if (key.startsWith('_directive')) {
                let bindings = vnode.props[key];
                let directive = normalizeDirective(bindings.directive);
                let hook = directive[type];
                if (hook) {
                    bindings._arguments ? processModifiers(bindings._arguments) : bindings._arguments = emptyArray;
                    bindings.filters ? processModifiers(bindings.filters) : bindings.filters = emptyArray;
                    bindings.modifiers ? processModifiers(bindings.modifiers) : bindings.modifiers = emptyArray;
                    if (pVnode) {
                        let pBindings = pVnode.props[key];
                        let oldValue = pBindings.value;
                        bindings.oldValue = oldValue;
                    }
                    hook(scope, bindings, vnode, pVnode);
                }
            }
            else if (key.startsWith(hookKey)) {
                if (key.startsWith(hookKey + '$modelValue')) {
                    let modelKey = key.split('_')[1];
                    // 每次更新需要对比 新旧值，如果变化通过setter传递到父组件
                    let setParentModelValue = vnode.props[key];
                    setParentModelValue(scope[modelKey]);
                }
                else {
                    normalizeHandler(vnode.props[key]).forEach((handler) => handler(scope));
                }
            }
        }
    }
    function processElementHook(type, vnode, pVnode) {
        let hookKey = `on${initialUpperCase(type)}`;
        for (let key in (vnode.props || emptyObject)) {
            if (key.startsWith('_directive')) {
                let bindings = vnode.props[key];
                let directive = normalizeDirective(bindings.directive);
                let hook = directive[type];
                if (hook) {
                    bindings._arguments ? processModifiers(bindings._arguments) : bindings._arguments = emptyArray;
                    bindings.filters ? processModifiers(bindings.filters) : bindings.filters = emptyArray;
                    bindings.modifiers ? processModifiers(bindings.modifiers) : bindings.modifiers = emptyArray;
                    if (pVnode) {
                        let pBindings = pVnode.props[key];
                        let oldValue = pBindings.value;
                        bindings.oldValue = oldValue;
                    }
                    hook(vnode.el, bindings, vnode, pVnode);
                }
            }
            else if (key.startsWith(hookKey)) {
                normalizeHandler(vnode.props[key]).forEach((handler) => handler(vnode.el));
            }
        }
    }
    function processRenderComponentHook(type, vnode, pVnode) {
        let hookKey = `on${initialUpperCase(type)}`;
        for (let key in (vnode.props || emptyObject)) {
            if (key.startsWith('_directive')) {
                let bindings = vnode.props[key];
                let directive = normalizeDirective(bindings.directive);
                let hook = directive[type];
                if (hook) {
                    bindings._arguments ? processModifiers(bindings._arguments) : bindings._arguments = emptyArray;
                    bindings.filters ? processModifiers(bindings.filters) : bindings.filters = emptyArray;
                    bindings.modifiers ? processModifiers(bindings.modifiers) : bindings.modifiers = emptyArray;
                    if (pVnode) {
                        let pBindings = pVnode.props[key];
                        let oldValue = pBindings.value;
                        bindings.oldValue = oldValue;
                    }
                    hook(null, bindings, vnode, pVnode);
                }
            }
            else if (key.startsWith(hookKey)) {
                normalizeHandler(vnode.props[key]).forEach((handler) => handler());
            }
        }
    }

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
    function normalizeEmitsOptions(options) {
        if (isArray(options)) {
            return arrayToMap(options, emptyObject);
        }
        else {
            return options;
        }
    }

    function resolveOptions(options) {
        for (let key in options) {
            const value = options[key];
            switch (key) {
                case "props" /* PROPS */:
                    options.propsOptions = normalizePropsOptions(value);
                    break;
                case "emits" /* EMITS */:
                    options.emitsOptions = normalizeEmitsOptions(value);
                    break;
                case "template" /* TEMPLATE */:
                    let render = compile(value);
                    let { createRender, useScopedStyleSheet } = render;
                    options.createRender = createRender;
                    options.useScopedStyleSheet = useScopedStyleSheet;
                    break;
                case "render" /* RENDER */:
                    // todo
                    break;
                case "create" /* CREATE */:
                case "beforeCreate" /* BEFORE_CREATE */:
                case "created" /* CREATED */:
                case "beforeMount" /* BEFORE_MOUNT */:
                case "mounted" /* MOUNTED */:
                case "beforeUpdate" /* BEFORE_UPDATE */:
                case "updated" /* UPDATED */:
                case "beforeUnmount" /* BEFORE_UNMOUNT */:
                case "unmounted" /* UNMOUNTED */:
                case "beforePatch" /* BEFORE_PATCH */:
                case "activated" /* ACTIVATED */:
                case "deactivated" /* DEACTIVATED */:
                case "beforeRouteEnter" /* BEFORE_ROUTE_ENTER */:
                case "beforeRouteLeave" /* BEFORE_ROUTE_LEAVE */:
                case "beforeRouteUpdate" /* BEFORE_ROUTE_UPDATE */:
                    // 转换为数组形式
                    if (value && !isArray(value)) {
                        options[key] = [value];
                    }
                    break;
            }
            // 组件定义了name 可以递归 
            // 这种是组件配置的名称，但可以被create中注册的名字替代
            if (options["name" /* NAME */]) {
                (options["components" /* COMPOENNTS */] ||= {})[options["name" /* NAME */]] = options;
            }
        }
    }

    function useRefState(value, refOptions) {
        let scope = getCurrentScope();
        var state = ref(value, refOptions);
        var setState = createRefValueSetter(state);
        var watcher = (callback) => watchRef(state, callback);
        let i = 0;
        return new Proxy(emptyObject, {
            get(_, key) {
                switch (i) {
                    case 0:
                        // provide to scope
                        scope[key] = state;
                        i++;
                        return state;
                    case 1:
                        // provide to scope
                        scope[key] = setState;
                        i++;
                        return state;
                    case 2:
                        scope[key] = watcher;
                        i++;
                        return watcher;
                    default:
                        return null;
                }
            }
        });
    }

    // create , 优先级比options中的name高 , 用于组件递归
    function defineSelfName(name) {
        let instance = getCurrentInstance();
        let components = instance.components ||= {};
        // 将自身配置注册到自身组件中
        components[name] = instance.options;
    }
    function useUid() {
        return getCurrentInstance().uid;
    }
    function useOptions() {
        return getCurrentInstance().customOptions;
    }
    function useProps() {
        return getCurrentInstance().props;
    }
    function useRefs() {
        return getCurrentInstance().refs ||= {};
    }
    function useRef(name) {
        let refs = useRefs();
        return refs[name];
    }
    function useAttrs() {
        return getCurrentInstance().attrs ||= {};
    }
    function useSlots() {
        return getCurrentInstance().slots ||= {};
    }
    function useSlot(name = 'default') {
        return useSlots()[name];
    }
    function useWatch() {
        return getCurrentInstance().watch;
    }
    function useRoot() {
        return getCurrentInstance().root;
    }
    function useParent() {
        return getCurrentInstance().parent;
    }
    function useEmit() {
        return getCurrentInstance().emit;
    }
    function useOn() {
        return getCurrentInstance().on;
    }
    function useOnce() {
        return getCurrentInstance().once;
    }
    function useOff() {
        return getCurrentInstance().off;
    }
    function useScope() {
        return getCurrentInstance().scope;
    }
    function useInstance() {
        return getCurrentInstance();
    }
    function useApp() {
        return getCurrentApp();
    }
    // for debgger
    function exposeCurrentScopeToWindow(name = 'scope') {
        window[name] = getCurrentScope();
    }

    exports.$var = $var;
    exports.CodeGenerator = CodeGenerator;
    exports.Comment = Comment;
    exports.ComputedRef = ComputedRef;
    exports.Expression = Expression;
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
    exports.arrayExpressionWithScope = arrayExpressionWithScope;
    exports.arrayToMap = arrayToMap;
    exports.attr = attr;
    exports.builtInComponents = builtInComponents;
    exports.builtInDirectives = builtInDirectives;
    exports.cache = cache;
    exports.cacheDebounce = cacheDebounce;
    exports.cacheThrottle = cacheThrottle;
    exports.calc = calc;
    exports.callFn = callFn;
    exports.callHook = callHook;
    exports.camelize = camelize;
    exports.cleaarRefDeps = cleaarRefDeps;
    exports.clearCurrentInstance = clearCurrentInstance;
    exports.colors = colors;
    exports.compile = compile;
    exports.computed = computed;
    exports.conicGradient = conicGradient;
    exports.createApp = createApp;
    exports.createComment = createComment;
    exports.createComponent = createComponent;
    exports.createComponentInstance = createComponentInstance;
    exports.createDeclaration = createDeclaration;
    exports.createElement = createElement;
    exports.createExpression = createExpression;
    exports.createFragment = createFragment;
    exports.createFunction = createFunction;
    exports.createInstanceEventEmitter = createInstanceEventEmitter;
    exports.createInstanceWatch = createInstanceWatch;
    exports.createKeyframe = createKeyframe;
    exports.createKeyframes = createKeyframes;
    exports.createMap = createMap;
    exports.createMapEntries = createMapEntries;
    exports.createMedia = createMedia;
    exports.createReactiveCollection = createReactiveCollection;
    exports.createReactiveEffect = createReactiveEffect;
    exports.createReactiveObject = createReactiveObject;
    exports.createReadonlyCollection = createReadonlyCollection;
    exports.createReadonlyObject = createReadonlyObject;
    exports.createRefValueSetter = createRefValueSetter;
    exports.createRenderScope = createRenderScope;
    exports.createReverseKeyCodes = createReverseKeyCodes;
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
    exports.darken = darken;
    exports.dateFormatRE = dateFormatRE;
    exports.debounce = debounce;
    exports.declare = declare;
    exports.defineScopeProperty = defineScopeProperty;
    exports.defineSelfName = defineSelfName;
    exports.defineTextModifier = defineTextModifier;
    exports.deleteActiveEffect = deleteActiveEffect;
    exports.deleteKeyframe = deleteKeyframe;
    exports.deleteMedium = deleteMedium;
    exports.deleteRule = deleteRule;
    exports.desaturate = desaturate;
    exports.destructur = destructur;
    exports.display = display;
    exports.doFlat = doFlat;
    exports.doKeyframesAnimation = doKeyframesAnimation;
    exports.docCreateComment = docCreateComment;
    exports.docCreateElement = docCreateElement;
    exports.docCreateText = docCreateText;
    exports.dynamicMapKey = dynamicMapKey;
    exports.effect = effect;
    exports.emitInstancetEvent = emitInstancetEvent;
    exports.emptyArray = emptyArray;
    exports.emptyFunction = emptyFunction;
    exports.emptyObject = emptyObject;
    exports.error = error;
    exports.eventModifiers = eventModifiers;
    exports.exec = exec;
    exports.execCaptureGroups = execCaptureGroups;
    exports.exposeCurrentScopeToWindow = exposeCurrentScopeToWindow;
    exports.expressionWithScope = expressionWithScope;
    exports.extend = extend;
    exports.extractFunctionArgs = extractFunctionArgs;
    exports.findNextCodeBlockClosingPosition = findNextCodeBlockClosingPosition;
    exports.findStringFromArray = findStringFromArray;
    exports.findTemplateStringEnd = findTemplateStringEnd;
    exports.flatRules = flatRules;
    exports.getActiveEffect = getActiveEffect;
    exports.getComponent = getComponent;
    exports.getCurrentApp = getCurrentApp;
    exports.getCurrentInstance = getCurrentInstance;
    exports.getCurrentRenderScope = getCurrentRenderScope;
    exports.getCurrentScope = getCurrentScope;
    exports.getCustomScreensMedia = getCustomScreensMedia;
    exports.getDeps = getDeps;
    exports.getDepsMap = getDepsMap;
    exports.getDirective = getDirective;
    exports.getEdgeElements = getEdgeElements;
    exports.getElementComputedStyle = getElementComputedStyle;
    exports.getElementComputedStyleValue = getElementComputedStyleValue;
    exports.getElementStyle = getElementStyle;
    exports.getElementStyleValue = getElementStyleValue;
    exports.getEmptyObject = getEmptyObject;
    exports.getEventName = getEventName;
    exports.getInstanceEvent = getInstanceEvent;
    exports.getInstanceEvents = getInstanceEvents;
    exports.getInstancetEventListeners = getInstancetEventListeners;
    exports.getLastSetKey = getLastSetKey;
    exports.getLastSetNewValue = getLastSetNewValue;
    exports.getLastSetOldValue = getLastSetOldValue;
    exports.getLastSetTarget = getLastSetTarget;
    exports.getLastVisitKey = getLastVisitKey;
    exports.getLastVisitTarget = getLastVisitTarget;
    exports.getLeftEdgeElement = getLeftEdgeElement;
    exports.getStyle = getStyle;
    exports.getStyleValue = getStyleValue;
    exports.h = h;
    exports.hasOwn = hasOwn;
    exports.hexToHsl = hexToHsl;
    exports.hexToRgb = hexToRgb;
    exports.hsl = hsl;
    exports.hslToHex = hslToHex;
    exports.hsla = hsla;
    exports.hyphenate = hyphenate;
    exports.important = important;
    exports.initialLowerCase = initialLowerCase;
    exports.initialUpperCase = initialUpperCase;
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
    exports.isComponentLifecycleHook = isComponentLifecycleHook;
    exports.isComputed = isComputed;
    exports.isDate = isDate;
    exports.isEffect = isEffect;
    exports.isElementLifecycleHook = isElementLifecycleHook;
    exports.isEmptyObject = isEmptyObject;
    exports.isEvent = isEvent;
    exports.isFunction = isFunction;
    exports.isHTMLTag = isHTMLTag;
    exports.isHandler = isHandler;
    exports.isHexColor = isHexColor;
    exports.isHslColor = isHslColor;
    exports.isNumber = isNumber;
    exports.isNumberString = isNumberString;
    exports.isObject = isObject;
    exports.isPromise = isPromise;
    exports.isProxy = isProxy;
    exports.isProxyType = isProxyType;
    exports.isReactive = isReactive;
    exports.isRef = isRef;
    exports.isRgbColor = isRgbColor;
    exports.isSVGTag = isSVGTag;
    exports.isShallow = isShallow;
    exports.isShortHexColor = isShortHexColor;
    exports.isString = isString;
    exports.isUndefined = isUndefined;
    exports.joinSelector = joinSelector;
    exports.keyCodes = keyCodes;
    exports.keyframe = keyframe;
    exports.keyframes = keyframes;
    exports.lighten = lighten;
    exports.linearGradient = linearGradient;
    exports.log = log;
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
    exports.normalizeHandler = normalizeHandler;
    exports.normalizeKeyText = normalizeKeyText;
    exports.normalizeStyle = normalizeStyle;
    exports.normalizeToHexColor = normalizeToHexColor;
    exports.objectExpressionWithScope = objectExpressionWithScope;
    exports.objectStringify = objectStringify;
    exports.onBeforeClassMount = onBeforeClassMount;
    exports.onBeforeMount = onBeforeMount;
    exports.onBeforePatch = onBeforePatch;
    exports.onBeforeUnmount = onBeforeUnmount;
    exports.onBeforeUpdate = onBeforeUpdate;
    exports.onCreated = onCreated;
    exports.onMounted = onMounted;
    exports.onPropChange = onPropChange;
    exports.onPropsChange = onPropsChange;
    exports.onSet = onSet;
    exports.onSetCallbacks = onSetCallbacks;
    exports.onUnmounted = onUnmounted;
    exports.onUpdated = onUpdated;
    exports.onceInstanceListener = onceInstanceListener;
    exports.onceListener = onceListener;
    exports.opacity = opacity;
    exports.parseAttribute = parseAttribute;
    exports.parseColor = parseColor;
    exports.parseEventName = parseEventName;
    exports.parseHex = parseHex;
    exports.parseHsl = parseHsl;
    exports.parseHslToRgb = parseHslToRgb;
    exports.parseInlineClass = parseInlineClass;
    exports.parseInlineStyle = parseInlineStyle;
    exports.parseRgb = parseRgb;
    exports.parseRgbToHsl = parseRgbToHsl;
    exports.parseStyleValue = parseStyleValue;
    exports.patch = patch;
    exports.perspective = perspective;
    exports.processHook = processHook;
    exports.processVnodePrerender = processVnodePrerender;
    exports.queueJob = queueJob;
    exports.radialGradient = radialGradient;
    exports.reactive = reactive;
    exports.reactiveCollectionHandler = reactiveCollectionHandler;
    exports.reactiveHandler = reactiveHandler;
    exports.readonly = readonly;
    exports.readonlyCollectionHandler = readonlyCollectionHandler;
    exports.readonlyHandler = readonlyHandler;
    exports.ref = ref;
    exports.remountElement = remountElement;
    exports.removeAttribute = removeAttribute;
    exports.removeClass = removeClass;
    exports.removeElement = removeElement;
    exports.removeFromArray = removeFromArray;
    exports.removeInstanceListener = removeInstanceListener;
    exports.removeListener = removeListener;
    exports.renderList = renderList;
    exports.renderSlot = renderSlot;
    exports.resolveOptions = resolveOptions;
    exports.responsiveLayoutMedia = responsiveLayoutMedia;
    exports.rgb = rgb;
    exports.rgbToHex = rgbToHex;
    exports.rgba = rgba;
    exports.rotate = rotate;
    exports.rotate3d = rotate3d;
    exports.rotateY = rotateY;
    exports.saturate = saturate;
    exports.scale = scale;
    exports.scale3d = scale3d;
    exports.scaleX = scaleX;
    exports.scaleY = scaleY;
    exports.scopeProperties = scopeProperties;
    exports.setActiveEffect = setActiveEffect;
    exports.setAttribute = setAttribute;
    exports.setCurrentInstance = setCurrentInstance;
    exports.setElementStyleDeclaration = setElementStyleDeclaration;
    exports.setElementTranstion = setElementTranstion;
    exports.setKeyText = setKeyText;
    exports.setKeyframesName = setKeyframesName;
    exports.setSelector = setSelector;
    exports.setSelectorAttribute = setSelectorAttribute;
    exports.setStyleProperty = setStyleProperty;
    exports.setText = setText;
    exports.shallowCloneArray = shallowCloneArray;
    exports.shallowCloneObject = shallowCloneObject;
    exports.shallowReactive = shallowReactive;
    exports.shallowReactiveCollectionHandler = shallowReactiveCollectionHandler;
    exports.shallowReactiveHandler = shallowReactiveHandler;
    exports.shallowReadonly = shallowReadonly;
    exports.shallowReadonlyCollectionHandler = shallowReadonlyCollectionHandler;
    exports.shallowReadonlyHandler = shallowReadonlyHandler;
    exports.shallowWatchReactive = shallowWatchReactive;
    exports.shortHexToHex = shortHexToHex;
    exports.skew = skew;
    exports.skewX = skewX;
    exports.skewY = skewY;
    exports.sortChildren = sortChildren;
    exports.sortRules = sortRules;
    exports.splitSelector = splitSelector;
    exports.stringToMap = stringToMap;
    exports.stringify = stringify;
    exports.targetObserverSymbol = targetObserverSymbol;
    exports.ternaryChains = ternaryChains;
    exports.ternaryExp = ternaryExp;
    exports.textModifiers = textModifiers;
    exports.throttle = throttle;
    exports.throwError = throwError;
    exports.toAbsoluteValue = toAbsoluteValue;
    exports.toArray = toArray;
    exports.toArrowFunction = toArrowFunction;
    exports.toBackQuotes = toBackQuotes;
    exports.toDec = toDec;
    exports.toEventName = toEventName;
    exports.toHex = toHex;
    exports.toNegativeValue = toNegativeValue;
    exports.toNumber = toNumber;
    exports.toPositiveValue = toPositiveValue;
    exports.toRaw = toRaw;
    exports.toReservedProp = toReservedProp;
    exports.toSingleQuotes = toSingleQuotes;
    exports.toTernaryExp = toTernaryExp;
    exports.track = track;
    exports.trackTargetObserver = trackTargetObserver;
    exports.translate3d = translate3d;
    exports.translateX = translateX;
    exports.translateY = translateY;
    exports.trigger = trigger;
    exports.triggerAllDepsMap = triggerAllDepsMap;
    exports.triggerTargetKey = triggerTargetKey;
    exports.triggerTargetObserver = triggerTargetObserver;
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
    exports.updateChildren = updateChildren;
    exports.updateClass = updateClass;
    exports.updateComponent = updateComponent;
    exports.updateDeclaration = updateDeclaration;
    exports.updateElementAttributes = updateElementAttributes;
    exports.updateInstanceListeners = updateInstanceListeners;
    exports.updateStyleSheet = updateStyleSheet;
    exports.useApp = useApp;
    exports.useAttrs = useAttrs;
    exports.useBoolean = useBoolean;
    exports.useCurrentInstanceCache = useCurrentInstanceCache;
    exports.useDate = useDate;
    exports.useEmit = useEmit;
    exports.useInstance = useInstance;
    exports.useNumber = useNumber;
    exports.useOff = useOff;
    exports.useOn = useOn;
    exports.useOnce = useOnce;
    exports.useOptions = useOptions;
    exports.useParent = useParent;
    exports.usePromise = usePromise;
    exports.useProps = useProps;
    exports.useRef = useRef;
    exports.useRefState = useRefState;
    exports.useRefs = useRefs;
    exports.useRoot = useRoot;
    exports.useScope = useScope;
    exports.useSlot = useSlot;
    exports.useSlots = useSlots;
    exports.useString = useString;
    exports.useUid = useUid;
    exports.useWatch = useWatch;
    exports.warn = warn;
    exports.watch = watch;
    exports.watchReactive = watchReactive;
    exports.watchRef = watchRef;
    exports.watchTargetKey = watchTargetKey;
    exports.withEventModifiers = withEventModifiers;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

})({});
