

export const updateStyleSheet = (p: any, n: any) => {
    var el = n.el = p.el
    var sheet = el.sheet
    updateSheet(p.children, n.children, sheet)
}

function updateSheet(pRules: any, nRules: any, sheet: any) {
    debugger
    /*
        与更新dom元素不同，规则中只要patchKey相同就一定会复用,
        更新过程依赖patchkey  
    */ 
}