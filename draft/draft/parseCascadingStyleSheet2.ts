var createAstFragment = (type: string, attributes: any) => {
      return Object.assign({
          type, children: [], parent: null, declaration: []
      }, attributes)
  }
  
  var RE_dynamicSelector = /\$\[([^\]]+)\]/g
  function anaylzeSelector(selector: string) {
      var dynamic = false
      var content = selector.replace(RE_dynamicSelector, (_: string, content): string => {
          dynamic = true
          return '${' + content + '}'
      })
      return content
  }
  
  var RE_catchMedia = /@media\s*([^{]+)(?<!\s)\s*{/
  var RE_catchDirective = /--([\w]+)\s*\(([^)]*)\)\s*{/
  var RE_catchKeyframes = /@keyframes\s+([\w]+)\s*{/
  var RE_pseudoSelector = /^([\w$\[\]&]+:{1,2}[\w$\[\]]+)\s*{/
  var RE_selector = /^([^{}:;]*)(?<!\s)\s*{/
  var RE_propertyAndValue = /(\$)?(\[)?\s*([\w-]+)\s*(\])?\s*(!)?\s*:\s*([^;]+)(?<!\s)\s*;/
  
  var parseCascadingStyleSheet = (template: string) => {
      var ast: any = []
      var $ = null
      var stack: any = []
      var subLength = 0
      var currentRule = null
      while (template = template.substring(subLength).trimStart()) {
          if (template.startsWith('}')) {
              // close
              stack.pop()
              subLength = 1
              continue
          } else if (template.startsWith('@media')) {
              // meida rule
              var [{ length }, mediaCondition]: any = RE_catchMedia.exec(template)
              currentRule = createAstFragment('media', {
                  mediaCondition
              })
              subLength = length
          } else if (template.startsWith('@keyframes')) {
              // keyframes
              var [{ length }, keyframesName]: any = RE_catchKeyframes.exec(template)
              currentRule = createAstFragment('keyframes', {
                  keyframesName
              })
              subLength = length
          } else if (template.startsWith('--')) {
              var [{ length }, directiveName, directiveContent]: any = RE_catchDirective.exec(template)
              currentRule = createAstFragment('directive', {
                  directiveName, directiveContent
              })
              subLength = length
          } else if (($ = RE_pseudoSelector.exec(template)) || ($ = RE_selector.exec(template))) {
              var [{ length }, selector]: any = $
              currentRule = createAstFragment('style', {
                  selector: anaylzeSelector(selector)
              })
              subLength = length
          } else if ($ = RE_propertyAndValue.exec(template)) {
              var [{ length }, dynamicValue, dynamicPrperty, property, _, important, value]: any = $
              stack[stack.length - 1].declaration.push({
                  property, value,
                  dynamicProperty: !!dynamicPrperty,
                  dynamicValue: !!dynamicValue,
                  important: !!important
              })
              subLength = length
              continue
          }
          
          var parent = stack[stack.length - 1]
          if (!parent) {
              ast.push(currentRule)
          } else {
              parent.children.push(currentRule)
              currentRule.parent = parent
          }
          stack.push(currentRule)
      }
      return ast
  }
  
  export {
      parseCascadingStyleSheet
  }