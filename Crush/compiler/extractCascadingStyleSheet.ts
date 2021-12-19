
var RE_propertyAndValue: RegExp = /^([^;{}]+)\s*:\s*([^;]+);/
var RE_selector: RegExp = /([^{};]*)(?<!\s)\s*{/
var RE_directive = /--(\w+)\(([^)]+)\)\s*{/
var RE_atRule = /@(\w+)\s+([^{]+)(?<!\s)\s*{/

function extractCascadingStyleSheet(template: string) {
    var stack = []
    var astTree: any = []
    var $ = null
    var cutLength = 0
    var currentChip: any = null
    while (template = template.trimLeft()) {
        // why atrule is first to extract , because there will be some strange issues ...
        if (template[0] === '@') {
            var [{ length }, atRuleName, atRuleContent] = RE_atRule.exec(template)!
            currentChip = {
                type: 'atRule',
                atRuleName,
                atRuleContent,
                declaration: {},
                children: [],
                parent: null
            };
            cutLength = length
        } else if (template[0] == '}') {
            stack.pop()
            template = template.substring(1)
            continue
        } else if ($ = RE_propertyAndValue.exec(template)) {
            var [{ length }, property, value] = $
            debugger
            stack[stack.length - 1].declaration[property] = value
            template = template.substring(length)
            continue
        } else if (template.startsWith('--')) {
            var [{ length }, directiveName, directiveContent] = RE_directive.exec(template)!
            currentChip = {
                type: 'derective',
                directiveName,
                directiveContent,
                declaration: {},
                children: []
            };
            cutLength = length
        } else {
            // 统一当作选择器来处理
            var [{ length }, selector] = RE_selector.exec(template)!
            currentChip = {
                type: 'style',
                selector,
                declaration: {},
                children: [],
                parent: null
            };
            cutLength = length
        }
        var parent = stack[stack.length - 1]
        if (!parent) {
            astTree.push(currentChip)
        } else {
            parent.children.push(currentChip)
            currentChip.parent = parent
        }
        stack.push(currentChip)
        template = template.substring(cutLength)
    }
    return astTree
}

export {
    extractCascadingStyleSheet
}