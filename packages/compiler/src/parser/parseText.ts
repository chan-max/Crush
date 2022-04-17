

export type Text = {
    content:string
    isDynamic:boolean
}

var mustache = /\{\{(.*?)\}\}/g

export var parseText = (text: string):Text[] => {
    var texts:Text[] = []
    var cursor = 0
    var execArr
    while(execArr = mustache.exec(text)){
        if(execArr.index > cursor){
            texts.push({
                content:text.slice(cursor,execArr.index),
                isDynamic:false
            })
        }
        if(execArr[1]){
            texts.push({
                content:execArr[1],
                isDynamic:true
            })
        }
        cursor = execArr[0].length + execArr.index 
    }
    if(cursor < text.length){
        texts.push({
            content:text.slice(cursor),
            isDynamic:false
        })
    }
    return texts
}

