
export const updateStyleSheet = (p: any, n: any) => {
    var el = n.el = p.el
    var sheet = el.sheet
    updateSheet(p.children, n.children, sheet)
}

/*
    selector 
    meida could be updated by mediaList , appendMedium and deleteMedium
*/

function updateSheet(pRules: any, nRules: any, sheet: any) {
    debugger
    /*
        与更新dom元素不同，规则中只要patchKey相同就一定会复用,
        更新过程依赖patchkey  
        patchkey 作为第一优先级
        其次为nodetype,
        !还是假设key相同的节点顺序一定不会变，
        既然key顺序不会变，
        我们可以先得到一个
    */

}