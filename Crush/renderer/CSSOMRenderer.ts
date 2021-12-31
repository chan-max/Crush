function mark(target: Record<string, any>, name: string, value: any) {
    return Reflect.defineProperty(target, name, {
        writable: false,
        configurable: false,
        enumerable: false,
        value
    })
} // 打上标记

function createStyle(selector: string, declaration: Record<string, any>) {
    return {
        type: 'CSSStyleRule',
        selector,
        declaration,
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

function createKeyframe(selector: string, declaration: Record<string, any>) {
    return {
        type: 'CSSKeyframeRule',
        selector,
        declaration
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




// 获取styleRule的字符串形式
function baseStyleRuleToString(styleRule: any) {
    var {
        selector,
        declaration
    } = styleRule

    var ruleContent = Object.keys(declaration).reduce((res, property) => {
        return res + property + ':' + declaration[property] + ';'
    }, '')

    return selector + '{' + ruleContent + '}'
}


function getMediaRuleString(mediaRule: any) {
    const {
        condition,
        rules
    } = mediaRule

    var ruleContent = rules.reduce((res: string, rule: any) => {
        return res + baseStyleRuleToString(rule)
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
        declaration
    } = keyframeRule

    var ruleContent = Object.keys(declaration).reduce((res, property) => {
        return res + property + ':' + declaration[property] + ';'
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
                sheet.insertRule(baseStyleRuleToString(rule), index)
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
        console.log(prevRules, nextRules);

    }
}






