


var parseTag = (tag:string,modifier:string) => {
    return {
        tag,modifier
    }
}


var parseAttr = (attr: string, val: string) => {
    return {
        attr,val
    }
}

var parseTexts = (texts:any) =>{
    return {
        texts
    }
}


export {
    parseTag,
    parseAttr,
    parseTexts
}


