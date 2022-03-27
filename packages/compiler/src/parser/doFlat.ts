import { flatRules } from './flatRules'
import { Nodes } from '@crush/types'
import { Selector } from './parseSelector';
import { parseIterator } from './parseIterator';
import { Dir } from './parseNode';
import {
    Asb
} from './ast'

 export function doFlat(
    rules: Asb[],
    flattedRules: any,
    isKeyframe = false
) {
    rules.forEach((rule: Asb) => {
        const type = rule.type
        if(type === Nodes.DECLARATIONS){
            rule.parent?.children?.push(rule)
        }else if(type === Nodes.STYLE_RULE){
            const {
                parent,
                content,
                children:_children
            } = rule
            if(parent?.dirs){
                rule.dirs = parent.dirs
            } /* extend the dirs */
            if(isKeyframe){
                rule.type = Nodes.KEYFRAME_RULE
            }else{
                const extendSelectors = parent?.selectors
                if(extendSelectors){
                    rule.selectors = [...extendSelectors, content]
                }else {
                    rule.selectors = [content]
                }
            }
        flattedRules.push(rule)
        if (_children) {
            rule.children = []
            doFlat(_children, flattedRules)
        }
        }else if(type === Nodes.MEDIA_RULE){

        }else if(type === Nodes.FOR){
            var dirs = rule.dirs || [];
            dirs.push(rule)
            if(rule.children){
                rule.children.forEach((childRule:Asb) => {
                    childRule.dirs = dirs
                    childRule.parent = rule.parent
                })
                doFlat(rule.children,flattedRules)
            }
        }
    });
    return flattedRules
}


// switch (rule.type) {
//     case Nodes.STYLE_RULE:
//         // process style and keyframe , cause parser dont
//         var { content, parent, children } = rule
//         /*
//             keyframe wont extend the selectors
//         */
//         if (isKeyframe) {
//             rule.type = Nodes.KEYFRAME_RULE 
//         } else {       
//             /*
//                 if exist parent selecors , current rule is the child , 
//             */
//             const extendSelectors = parent?.selectors
//             if (extendSelectors) {
//                 // bubbling
//                 // extends the parent selector
//                 var dirs = null
//                 var _parent = parent
//                 while (_parent) {
//                     if (_parent.dirs) {
//                         (dirs ||= []).unshift(_parent.dirs)
//                     }
//                     _parent = _parent.parent
//                 }
//                 rule.dirs = dirs
//                 rule.selectors = [...extendSelectors, content]
//             } else {
//                 rule.selectors = [content]
//             }
//         }
//         flattedRules.push(rule)
//         if (children) {
//             doFlat(children, flattedRules)
//         }
//         break
//     case Nodes.DECLARATIONS :
        
//         break
//     case Nodes.MEDIA_RULE:
//     case Nodes.SUPPORT_RULE:
//         if (rule.children) {
//             rule.selectors = rule.parent?.selectors
//             rule.children = flatRules(rule.children)
//             flattedRules.push(rule)
//         }
//         break
//     case Nodes.FOR:
//         rule.selectors = rule.parent?.selectors
//         rule.dirs = {
//             type: Nodes.FOR,
//             content: rule.content
//         }
//         if (rule.children) {
//             doFlat(rule.children, flattedRules)
//         }
//         break
//     case Nodes.IF:

//         break
//     case Nodes.ELSE_IF:

//         break
//     case Nodes.ELSE:
//         break
//     case Nodes.KEYFRAMES_RULE:
//         // should i ?
//         if (rule.children) {
//             rule.children = flatRules(rule.children, true) // emmmm 赋给children用于生成code
//             flattedRules.push(rule)
//         }
//         break
// }