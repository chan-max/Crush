
/*
    color : red ;
    color!:red; important
    $color : variable ; support string,array,number
    (variable) : red ;
    $(variable) : variable ; 
*/

import { camelize } from "@crush/common"


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
        //property: camelize(property), setProperty must use - , so no need to camelize
       // property, 
       property:camelize(property), // property need to be camlized , for support mixin 
        value,
        isDynamicValue,
        isDynamicProperty: l && r,
        isImportant
    }
}

export {
    parseDeclaration
}