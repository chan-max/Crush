import { Nodes } from "../../type/nodeType"

/*
    color : red ;
    color!:red; important
    $color : variable ; support string,array,number
    (variable) : red ;
    $(variable) : variable ; 
*/

const extractDeclarationProperty = /(\$)?(\()?([\w-]+)(\))?(!)?/

const parseDeclaration = (rawProperty: string, value: string) => {
    var [
        _,
        dynamicValue,
        l,
        property,
        r,
        important
    ]: any = extractDeclarationProperty.exec(rawProperty)
    return {
        type:Nodes.DECLARATION,
        property,
        value,
        dynamicValue,
        dynamicProperty: l && r,
        important
    }
}

export {
    parseDeclaration
}