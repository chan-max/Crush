

export type Text = {
    content: string
    isDynamic: boolean
    modifier?: string
}

var mustache = /\{\{(.*?)\}\}/g

export var parseText = (text: string): Text[] => {
    var texts: Text[] = []
    var cursor = 0
    var execArr
    while (execArr = mustache.exec(text)) {
        if (execArr.index > cursor) {
            texts.push({
                content: text.slice(cursor, execArr.index),
                isDynamic: false
            })
        }
        if (execArr[1]) {
            let exp = execArr[1].trim()
            var content: any, modifier: any
            if (exp.startsWith('@')) {
                // 使用修饰非一定要用一个空格作为分隔
                let firstWhitespace = exp.indexOf(' ')
                modifier = exp.slice(1,firstWhitespace)
                content = exp.slice(firstWhitespace)
            } else {
                content = exp
            }
            texts.push({
                modifier,
                content,
                isDynamic: true
            })
        }
        cursor = execArr[0].length + execArr.index
    }

    if (cursor < text.length) {
        texts.push({
            content: text.slice(cursor),
            isDynamic: false
        })
    }
    return texts
}

