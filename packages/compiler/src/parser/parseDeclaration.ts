
/*
    color : red ;
    color!:red; important
    $color : variable ; support string,array,number
    (variable) : red ;
    $(variable) : variable ; 
*/


export type Declaration = {
    property: string,
    value: string,
    isImportant: string,
    isDynamicValue: string,
    isDynamicProperty: string
}

const extractDeclarationProperty = /(\$)?(\()?([\w-]+)(\))?(!)?/

const IMPORTANT_KEY = '!important'

const parseDeclaration = (rawProperty: string, value: string): Declaration => {
    var [
        _,
        isDynamicValue,
        l,
        property,
        r,
        isImportant
    ] = extractDeclarationProperty.exec(rawProperty) as RegExpExecArray
    return {
        property,
        value,
        isDynamicValue,
        isDynamicProperty: l && r,
        isImportant
    }
}

export {
    parseDeclaration
}