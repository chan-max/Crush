
export const IMPORTANT_SYMBOL = Symbol('important')

export const IMPORTANT_KEY = '!important'
export const IMPORTANT = 'important'

/*
    input a value and return the important version , 
    so we can do this while useing dynamic binding
    body{
        $background-color : bg;
    }
    --- js
    bg = important('red') 
    the same as
    bg = 'red !important'
    used for when use javascript stylesheet , we can set the declaration important
*/
export function important(value: any) {
    return {
        value,
        [IMPORTANT_SYMBOL]: true
    }
}
