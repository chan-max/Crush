(function () {
    'use strict';

    const exec = (regExp, target) => regExp.exec(target);
    const trimS = (s, len = 0) => s.slice(len).trimStart();

    const openTagRE = /^<([\w-]+)(?:\:(\w+))?/;
    /*
        $1 : tagName
        $2 : modifier
    */
    const closeTagRE = /^<\/([\w-]+)\s*>/;
    /*
        $1 : comment content
    */
    const baseAttrRE = /([^=\s]+)\s*(?:=\s*(["'])([^\2]*?)\2)?/;
    /*
        $1 : attrName
        $2 : ' "
        $3 : value
    */
    var textRE = /(.*?)(<|{{|}})/;

    var parseTag = (tag, modifier) => {
        return {
            tag, modifier
        };
    };
    var parseAttr = (attr, val) => {
        return {
            attr, val
        };
    };
    var parseTexts = (texts) => {
        return {
            texts
        };
    };

    const parseDOMTemplate = (ts) => {
        var ast = [], attrs = [], inOpen = false, /* capture attrs */ sl = 0, texts = [], inExp = false, $, /* extracted */ t, /* current tag */ m; /* current tag modifier */
        while (ts = trimS(ts, sl)) {
            if (ts[0] === '<') { /* in tag */
                if (texts.length) {
                    ast.push(parseTexts(texts));
                    texts = [];
                }
                if (ts[1] === '/') { /* tag close */
                    $ = exec(closeTagRE, ts);
                    for (var i = ast.length - 1; i >= 0; i--) {
                        if (ast[i].closed)
                            continue;
                        if (ast[i].tag === $[1]) {
                            ast[i].closed = true;
                            var children = ast.splice(i + 1);
                            if (children) {
                                ast[i].children = children;
                            }
                            break;
                        }
                    }
                    sl = $[0].length;
                }
                else if (ts[1] === '!') ;
                else {
                    $ = exec(openTagRE, ts);
                    t = $[1];
                    m = $[2];
                    inOpen = true;
                    sl = $[0].length;
                }
            }
            else if (inOpen) { /* attrs */
                if (ts[0] === '/') { /* there is not must for decide a opentag is close or not by '/', so just forget it */
                    sl = 1;
                }
                else if (ts[0] === '>') {
                    var token = parseTag(t, m);
                    token.attr = attrs;
                    token.children = [];
                    token.closed = false;
                    ast.push(token);
                    attrs = [];
                    inOpen = false;
                    sl = 1;
                }
                else { /* catch attrs */
                    $ = exec(baseAttrRE, ts);
                    attrs.push(parseAttr($[1], $[3]));
                    sl = $[0].length;
                }
            }
            else { /* texts */
                $ = exec(textRE, ts);
                if ($) { /* capture success */
                    var content = $[1];
                    var f = $[2];
                    var dynamic;
                    if (f === '{{') {
                        dynamic = false;
                        inExp = true;
                        sl = $[0].length;
                    }
                    else if (f === '}}') {
                        dynamic = true;
                        inExp = false;
                        sl = $[0].length;
                    }
                    else if (f === '<') {
                        if (inExp) {
                            content = $[0];
                            dynamic = true;
                            sl = $[0].length;
                        }
                        else {
                            dynamic = false;
                            sl = $[0].length - 1;
                        }
                    }
                    texts.push({ content, dynamic });
                }
                else { /* capture failed ,there is only one possiblity , the string is in the end */
                    texts.push({
                        content: ts,
                        dynamic: false
                    });
                    sl = ts.length;
                    if (texts.length) {
                        ast.push(parseTexts(texts));
                    }
                }
            }
        }
        return ast;
    };

    var template = `

    <div>
        <button> 早上好 ！ 请 {{ num < 0  }} 登录 </button>
    </div>
    
`;
    console.log(parseDOMTemplate(template));

}());
