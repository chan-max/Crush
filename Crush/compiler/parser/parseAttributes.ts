/*
       /(-{2}|@|$)?(\[)?(\w+)(\])?(?:\.(\w+))/
      在正则表达式中，组数是固定的。在组后面放置一个量词不会增加组数。
*/

var attributeExtractRE = /(-{2}|@|$)?(\[)?(\w+)(\])?(?:\.(.*))?/

var parseAttrs = (attribute:string,value:string) => {
      var [_,flag,l,attr,r,modifiers]:any = attributeExtractRE.exec(attribute)
      if(flag === '--'){
            return {
                  type:'directive',
                  directive:attr,
                  value
            }
      }else if(flag === '@'){
            return {
                  type:'event',
                  event:attr,
                  value,
                  modifiers:modifiers?.split('.')
            }
      }else{
            return {
                  type:'attr',
                  dynamicValue: flag === '$',
                  dynamicAttr:!!l,
                  value
            }
      }
}

export {
      parseAttrs
}


