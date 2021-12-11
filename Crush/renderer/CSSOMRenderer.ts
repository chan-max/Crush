function mark(target: Record<string, any>, name: string, value: any) {
    return Reflect.defineProperty(target, name, {
        writable: false,
        configurable: false,
        enumerable: false,
        value
    })
} // 打上标记

function createStyle(selector: string, declarations: Record<string, any>) {
    return {
        type: 'CSSStyleRule',
        selector,
        declarations,

    }
}

function createMedia(condition: string, rules: Array<any>) {
    return {
        type: 'CSSMediaRule',
        condition,
        rules
    }
}



function createKeyframes(name: string, rules: Array<any>) {
    return {
        type: 'CSSKeyframesRule',
        name,
        rules
    }
}

function createKeyframe(selector: string, declarations: Record<string, any>) {
    return {
        type: 'CSSKeyframeRule',
        selector,
        declarations
    }
}

var nextStyle = [
    createKeyframes('first', [
        createKeyframe('from', {
            'background-color': 'red'
        }),
        createKeyframe('to', {
            'background-color': 'blue'
        })
    ])
]

interface styleRule {
    type: 'CSSMediaRule',
    selector: string,
    declarations: Record<string, any>
}


// 获取styleRule的字符串形式
function getStyleRuleString(styleRule: styleRule) {
    var {
        selector,
        declarations
    } = styleRule

    var ruleContent = Object.keys(declarations).reduce((res, property) => {
        return res + property + ':' + declarations[property] + ';'
    }, '')

    return selector + '{' + ruleContent + '}'
}


function getMediaRuleString(mediaRule: any) {
    const {
        condition,
        rules
    } = mediaRule

    var ruleContent = rules.reduce((res: string, rule: any) => {
        return res + getStyleRuleString(rule)
    }, '')

    return '@media' + ' ' + condition + '{' + ruleContent + '}'
}

function getEmptyMediaRuleString(condition: string) {
    return getMediaRuleString(createMedia(condition, []))
}

function getEmptyKeyframesRule(name: string) {
    return '@keyframes' + ' ' + name + '{' + '' + '}'
}


function getKeyframeRuleString(keyframeRule: any) {
    var {
        selector,
        declarations
    } = keyframeRule

    var ruleContent = Object.keys(declarations).reduce((res, property) => {
        return res + property + ':' + declarations[property] + ';'
    }, '')

    return selector + '{' + ruleContent + '}'
}




function updateSheet(sheet: any, nextRules: any) {

    const prevRules = sheet.__Cr_rules

    if (!prevRules) {
        // 直接渲染全新的样式表
        nextRules.forEach((rule: any, index: number) => {
            if (rule.type === 'CSSStyleRule') {
                // 生成普通样式规则
                sheet.insertRule(getStyleRuleString(rule), index)
                mark(sheet.cssRules[index], '__Cr_styleRule', rule)
            } else if (rule.type === 'CSSMediaRule') {
                // 生成媒体样式
                var { condition, rules } = rule
                sheet.insertRule(getEmptyMediaRuleString(condition), index)
                updateSheet(sheet.cssRules[index], rules) // 递归处理媒体样式
                mark(sheet.cssRules[index], '__Cr_mediaRule', rule)
            } else if (rule.type === 'CSSKeyframesRule') {
                // 生成动画规则
                var { name, rules } = rule
                sheet.insertRule(getEmptyKeyframesRule(name), index)
                updateSheet(sheet.cssRules[index], rules)
                mark(sheet.cssRules[index], '__Cr_keyframesRule', rule)
            } else if (rule.type === 'CSSKeyframeRule') {
                // 生成动画帧数规则
                sheet.appendRule(getKeyframeRuleString(rule), index)
                mark(sheet.cssRules[index], '__Cr_keyframeRule', rule)
            }
        });
        mark(sheet, '__Cr_rules', nextRules)
    } else {
        // 更新样式表
        console.log('更新样式表');
        // 对比 prevRules 和  nextRules
        console.log(prevRules,nextRules);
        
    }
}

var ss: any = (document as any).querySelector('style').sheet


function test() {
    // first render
    updateSheet(ss, nextStyle)
    console.log(ss);
    // first update
    updateSheet(ss, nextStyle)
}

export {
    test
}



