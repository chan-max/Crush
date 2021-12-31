
function flatNestingRules(ast: any, res: any) {
    ast.forEach((fragment: any) => {
        if (fragment.type === 'style') {
            var { parent, declaration, children, selector } = fragment
            if (parent) {
                selector = parent.realSelector + ' ' + selector
            }
            fragment.realSelector = selector
            res.push({
                selector, declaration,
                type:'style'
            })
            flatNestingRules(children, res)
        } else if (fragment.type === 'media') {
            fragment.realSelector = fragment.parent.realSelector
            res.push({
                media: fragment.mediaCondition,
                rules: generateRules(fragment.children),
                type:'media'
            })
        } else if (fragment.type === 'keyframes') {
            res.push({
                keyframesName: fragment.keyframesName,
                keyframe: fragment.children
            })
        }
    });
    return res
}

function generateRules(ast: any) {
    return flatNestingRules(ast, [])
}


var toBackQuotesString = (_: string) => '`' + _ + '`'


function styleRuleToRenderString(styleRule: any) {
    return `createStyleRule(${toBackQuotesString(styleRule.selector)},{${styleRule.declaration.map((item: any) => {
        return '['+(item.dynamicProperty ? item.property : toBackQuotesString(item.property))+']' + ':' + (item.dynamicValue ? item.value : toBackQuotesString(item.value))
    }).join(',')}})`
}

function mediaRuleToRenderString(mediaRule:any) {
    return `createMediaRule(${toBackQuotesString(mediaRule.media)},${generateRenderString(mediaRule.rules)})`
}


function generateRenderString(rules: any) {
    return `[${rules.map((rule: any) => {
        if (rule.type === 'style') {
            return styleRuleToRenderString(rule)
        } else if (rule.type === 'media') {
            return mediaRuleToRenderString(rule)
        }
    }).join(',')}]`
}


export {
    generateRules,generateRenderString
}









