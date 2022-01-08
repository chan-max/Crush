

const enum RuleTypes {
      STYLE,
      MEDIA,
      KEYFRAMES,
      DIRECTIVE
}

const CSSRuleDirectives = [
      'if',
      'elseIf',
      'else',
      'for'
]

import { anaylzeSelector } from "./CSSParserSupporter"


/*
      decide a selector by  not contain {; and end with {' 
*/
const selectorRE = /^([^{};]*)(?<!\s)\s*{/
const declarationMapRE =  /(\$)?(\[)?([^\]:]+)(\])?\s*(!)?\s*:\s*([^;]+)(?<!\s)\s*;/
const CSSDirectiveRE = /^--([\w]+)\s*(?:\(([^{]+)\))?/

const parseCascadingStyleSheet = (template:string) => {
      var astTree: any = [],stack:any = [] ,$,subLength = 0 ,currentRule:any
      while(template = template.substring(subLength).trimStart()){
            if(template.startsWith('}')){ /* rule close */
                  stack.pop()
                  subLength = 1
                  continue
            }else if(template.startsWith('@')){
                  /* At-Rule */
            }else if(template.startsWith('--')){
                  /* directive */
                  var [{length},directiveName,directiveContent]:any = CSSDirectiveRE.exec(template)
                  currentRule = {
                        type:RuleTypes.DIRECTIVE,
                        directiveName,directiveContent,
                        children:[],
                        parent:null,
                        declaration:[],
                  }
                  subLength = length
            }else if($ = selectorRE.exec(template)){
                  var [{length},selector]:any = $
                  currentRule = {
                        type:RuleTypes.STYLE,
                        selector:anaylzeSelector(selector),
                        children:[],
                        parent:null,
                        declaration:[]
                  }
                  subLength = length
            }else if($ = declarationMapRE.exec(template)){
                  /*  resolve property value map */
                  var [{length},dynamicValue,dynamicProperty,property,_,important,value]:any = $
                  stack[stack.length - 1].declaration.push({
                        property, value,
                        dynamicProperty: !!dynamicProperty,
                        dynamicValue: !!dynamicValue,
                        important: !!important
                    })
                    subLength = length
                    continue
            }

            var parent = stack[stack.length - 1]
            if (!parent) {
                astTree.push(currentRule)
            } else {
                parent.children.push(currentRule)
                currentRule.parent = parent
            }
            stack.push(currentRule)
      }
      return astTree
}

export {
      parseCascadingStyleSheet
}