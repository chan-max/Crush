var extractActiveSelectorRE = /\$\[([^\]]*)\]/g

function anaylzeSelector(selector:string){
      var dynamic = false
      return {
            selector:selector.replace(extractActiveSelectorRE, (_, content): string => {
                  dynamic = true
                  return '${' + content + '}'
              }),
              dynamic
      }
}

export {
      anaylzeSelector
}