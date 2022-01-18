// import { isString, isArray, isNumber, isObject } from "../shared/dataType";
// import { mark } from "../shared/mark";
// const enum CSSRULE_TYPE {
//     STYLERULE,
//     KEYFRAMESRULE,
//     MEDIARULE,
//     KEYFRAMERULE
// }

// const createStyleRuleNode = (selector: string, declaration: any, config: any) => ({ type: CSSRULE_TYPE.STYLERULE, selector, declaration, config })
// const createMediaRuleNode = (condition: string, rules: any) => ({ type: CSSRULE_TYPE.MEDIARULE, condition, rules })
// const createKeyframesRuleNode = (name: string, rules: any) => ({ type: CSSRULE_TYPE.KEYFRAMESRULE, name, rules })
// const createKeyframeRuleNode = (key: string, declaration: any,config:any) => ({ type: CSSRULE_TYPE.KEYFRAMERULE, key, declaration,config })

// // background-color:red; => ....
// function toStyleMapString(property: string, value: any, important: boolean, config: any): any {
//     return isObject(value) ? Object.entries(value).map(([v1, v2]) => {
//         return toStyleMapString(property + '-' + v1, v2, important, config)
//     }).join('') : `${property}:${isArray(value) ?
//         value.reduce((res: string, valueItem: any) => res + ' ' + (isNumber(valueItem) ? valueItem + config.unit : valueItem), '') : isNumber(value) ?
//             value + config.unit : value}${important ? ' !important' : ''};`
// }

// // mount single styleRule , for instance, body{...styleMap}
// function createStyleRuleString(selector: string, declaration: any, config: any) {
//     return `${selector}{${Object.entries(declaration).map(([property, { value, important }]: any) => toStyleMapString(property, value, important, config)).join('')}}`
// }


// function mountRule(styleSheet: any, rule: any, index: number) {
//     if (rule.type === CSSRULE_TYPE.MEDIARULE) {
//         styleSheet.insertRule(`@media ${rule.condition}{}`, index)
//         updateStyleSheet(styleSheet.cssRules[index], rule.rules)
//     } else if (rule.type === CSSRULE_TYPE.KEYFRAMESRULE) {
//         styleSheet.insertRule(`@keyframes ${rule.name}{}`,index)
//         updateStyleSheet(styleSheet.cssRules[index], rule.rules)

//     } else if (rule.type === CSSRULE_TYPE.STYLERULE) {
//         styleSheet.insertRule(createStyleRuleString(rule.selector, rule.declaration, rule.config), index)
//     } else if (rule.type === CSSRULE_TYPE.KEYFRAMERULE) {
//         styleSheet.appendRule(createStyleRuleString(rule.key, rule.declaration, rule.config), index)
//     }
// }

// function updateStyleSheet(sheet: any, rules: any) {
//     rules.forEach((rule: any, index: number) => {
//         mountRule(sheet, rule, index)
//     });
// }



// var style: any = (document.querySelector('#style') as any).sheet
// const styleRender = (config = { unit: 'px', url: '../images/' }) => {
//     return [
//         createMediaRuleNode('screen and (min-width:500px)', [
//             createStyleRuleNode('body', {
//                 border: {
//                     important: true,
//                     value: '100px solid green'
//                 },
//                 animation:{
//                     important:true,
//                     value:'a 3s infinite'
//                 } 
//             }, config)
//         ]),
//         createKeyframesRuleNode('a',[
//             createKeyframeRuleNode('0%',{
//                 ['background-color']:{
//                     value:'red',important:false
//                 }
//             },config),
//             createKeyframeRuleNode('100%',{
//                 ['background-color']:{
//                     value:'blue',important:false
//                 }
//             },config)
//         ])
//     ]
// }







