import { NodeTypes } from "../types"

import { anaylzeSelector } from "./CSSParserSupporter"

import {
      selectorRE,
      declarationMapRE,
      CSSDirectiveRE,
      AtRuleRE
} from './extractRE'

const parseCascadingStyleSheet = (template:string) => {
      var astTree: any = [],stack:any = [] ,$,subLength = 0 ,currentRule:any
      while(template = template.substring(subLength).trimStart()){
            if(template.startsWith('}')){ /* rule close */
                  stack.pop()
                  subLength = 1
                  continue
            }else if(template.startsWith('@')){
                  /* At-Rule */
                  var [{length},type,content]:any = AtRuleRE.exec(template)

                  if(type === 'media'){
                        currentRule = {
                              type:NodeTypes.MEDIA,
                              mediaCondition:content,
                              children:[],parent:null,declaration:[]
                        }
                  }else if(type === 'keyframes'){
                        currentRule = {
                              type:NodeTypes.KEYFRAMES,
                              keyframesName:content,
                              children:[],parent:null,declaration:[]
                        }
                  }else if(type === 'support'){
                        currentRule = {
                              type:NodeTypes.SUPPORTS,
                              supportCondition:content,
                              children:[],parent:null,declaration:[]
                        }
                  }
                  subLength = length
            }else if(template.startsWith('--')){
                  /* directive */
                  var [{length},directiveName,directiveContent]:any = CSSDirectiveRE.exec(template)
                  currentRule = {
                        type:NodeTypes.DIRECTIVE,
                        directiveName,directiveContent,
                        children:[],parent:null,declaration:[],
                  }
                  subLength = length
            }else if($ = selectorRE.exec(template)){
                  var [{length},selector]:any = $
                  currentRule = {
                        type:NodeTypes.STYLE,
                        selector:anaylzeSelector(selector),
                        children:[],parent:null,declaration:[]
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