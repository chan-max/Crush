
// import { templateExtract } from "./templateExtract";

// import { TAG_TYPE } from '../shared/types'
 
// enum XML_CONTENT_TYPE {
//     OPEN_TAG,
//     CLOSE_TAG,
//     TEXT,
//     COMMENT
// }

// var template = `
// <header-row disabled  @CLICK="132456"  dada >
//    <header disabled  @CLICK="fafafa"   >
//    123456
//     </header>
// </header-row>
// `
// var e = templateExtract(template)

// var stack = []
// for (var item of e) {
// if (item.type === XML_CONTENT_TYPE.OPEN_TAG) {
// item.children = []
// item.isClosed = false
// stack.push(item)
// } else if (item.type === XML_CONTENT_TYPE.CLOSE_TAG) {
// for (var i = stack.length - 1; i >= 0; i--) {
//     if (stack[i].isClosed) continue
//     if (stack[i].tagName === item.tagName) {
//         stack[i].isClosed = true
//         var children = stack.splice(i + 1)
//         if (children) {
//             stack[i].children = children
//         }
//         break
//     }
// }
// } else if (item.type === XML_CONTENT_TYPE.TEXT) {
// stack.push(item)
// }
// }

// console.log(stack);

// function transformToRenderFunction(node: any) {
// var str = ``
// switch (node.tagType) {
// case TAG_TYPE.HTMLELEMENT:
//     str = `_element('${node.tagName}',[`
//     if (node.children) { str = str + node.children.map((el: any) => transformToRenderFunction(el)).join(',') }
//     str = str + '])'
//     break;
// case TAG_TYPE.COMPONENT:
//     str = `_component('${node.tagName}',[`
//     if (node.children) { str = str + node.children.map((el: any) => transformToRenderFunction(el)).join(',') }
//     str = str + '])'
//     break;
// case TAG_TYPE.BUILDIN_TAG:
//     str = `_buildin('${node.tagName}',[`
//     if (node.children) { str = str + node.children.map((el: any) => transformToRenderFunction(el)).join(',') }
//     str = str + '])'
//     break;
// case TAG_TYPE.SVGELEMENT:
//     str = `_svgelement('${node.tagName}',[`
//     if (node.children) { str = str + node.children.map((el: any) => transformToRenderFunction(el)).join(',') }
//     str = str + '])'
//     break;
// default:
//     str = `_text('${node.value}')`
//     break
// }
// return str
// }

// console.log(transformToRenderFunction(stack[0]));
