(function () {
    'use strict';

    var startTag = /<([\w-]+)/; // 匹配开始标签，获取标签名
    var endTag = /<\/([\w]+)\s*>/;
    var value = /=\s*(["'])([^\\1]*?)(\1)/; // 获取属性值，用单引号或双引号包起来的非单引号或双引号的内容
    var attribute = /([^=\s]+)/; // 获取属性名 
    var text = /([^<]+)/;
    var inStartTag = false; // 判断当前是否处于开始标签中，用于区分属性和文本
    var isAttrubute = true;
    var currentTag = ''; //保存实时标签名
    var attrubuteMap = {}; // 保存
    var attributeSet = [];
    var attr = '';
    function* templateExtract(template) {
        template = template.trimLeft();
        if (template) {
            if (template[0] === '<') {
                if (/[a-zA-Z]/.test(template[1])) {
                    // 开始标签
                    var [{ length }, st] = startTag.exec(template);
                    template = template.substring(length);
                    currentTag = st;
                    inStartTag = true;
                    template = template.trimLeft();
                    yield* templateExtract(template);
                }
                else if (template[1] === '/') {
                    var [{ length }, ed] = endTag.exec(template);
                    yield {
                        type: '闭合标签',
                        tagName: ed
                    };
                    template = template.substring(length).trimLeft();
                    yield* templateExtract(template);
                    // 结束标签
                }
                else if (template[1] === '!') ;
            }
            else {
                if (inStartTag) { //在开始标签内
                    if (template[0] === '=') {
                        // 处理属性过渡
                        var chip = value.exec(template) || [];
                        var captureValue = chip[2];
                        attrubuteMap[attr] = captureValue;
                        isAttrubute = true;
                        template = template.substring(chip[0].length).trimLeft();
                        yield* templateExtract(template);
                    }
                    else if (template[0] === '>') {
                        // 一个标签闭合了
                        template = template.substring(1).trimLeft();
                        yield {
                            type: '开始标签',
                            tagName: currentTag,
                            attrubuteMap,
                            attributeSet
                        };
                        attrubuteMap = {};
                        attributeSet = [];
                        inStartTag = false;
                        yield* templateExtract(template);
                    }
                    else if (isAttrubute) {
                        var chip = attribute.exec(template) || [];
                        attr = chip[1];
                        template = template.substring(chip[0].length).trimLeft();
                        isAttrubute = false;
                        yield* templateExtract(template);
                    }
                    else {
                        var chip = attribute.exec(template) || [];
                        attributeSet.push(attr);
                        attr = chip[1];
                        template = template.substring(chip[0].length).trimLeft();
                        yield* templateExtract(template);
                    }
                }
                else {
                    // 不再标签内处理文本
                    var chip = text.exec(template) || [];
                    template = template.substring(chip[0].length).trimLeft();
                    yield {
                        type: '文本',
                        value: chip[1]
                    };
                    yield* templateExtract(template);
                }
            }
        }
        else {
            console.log('over');
        }
        return 'over';
    }

    // Crush Studio
    console.log("%cCrush Studio", "color: #333;  font-size: 10px; font-weight:bold;");
    var template = ` 

<body>
  <div class="app">
    <button >button</button>
  </div>
</body>

<script src="./vue3.js"></script>
<script src="./dist/iife/iife.js"></script>

<script>

</script>


`;
    var x = templateExtract(template);
    for (var i of x) {
        console.log(i);
    }
    var tagTypes;
    (function (tagTypes) {
        tagTypes[tagTypes["HTMLELEMENT"] = 123] = "HTMLELEMENT";
        tagTypes[tagTypes["SVGELEMENT"] = 124] = "SVGELEMENT";
    })(tagTypes || (tagTypes = {}));

}());
