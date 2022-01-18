const openTagRE = /^<([\w-]+)(?:\:(\w+))?/
/*
    $1 : tagName
    $2 : modifier
*/

const closeTagRE = /^<\/([\w-]+)\s*>/
/*
    $1 : tagName
    ignore the modifiers
*/

const DOMCommentRE = /<!--((.|[\r\n])*?)-->/
/*
    $1 : comment content
*/

const attributeMapRE = /^(-{2}|@|$)?(\[)?([\w-]+)(\])?(?:\.([^=]*)(?<!\s))?(?:\s*=\s*(["'])([^\6]*?)(?:\6))?/
/*
    props capture group  : 10
    1 : -- , @ , $  divective , event , dynamicValue      1
    2 : [   dynamicAttribute left             2
    3 : attributeName             3
    4 : ]   dynamicAttribute right      4
    5 : modifiers , ignore
    6 : modifiers modifiers            5
    7 : with value  , ignore
    8 : " or ' value left   cannt ignore      6
    9 :  value        7
    10 : " or ' value right ignore
*/

var textRE1 = /((?:(?:(?!(?:\{{2}|<))|\s).)*)(\{{2})?/
/*      
        $1 : text
        $2 : {{
*/

var textRE2 = /((?:(?!\}{2}).)*)*\}\}/
/*
        $1 : text
*/

const selectorRE = /^([^{};]*)(?<!\s)\s*{/
/*
    $1 : selcector
*/

const declarationMapRE = /(\$)?(\[)?([^\]:]+)(\])?\s*(!)?\s*:\s*([^;]+)(?<!\s)\s*;/
/*

*/

const CSSDirectiveRE = /^--([\w]+)\s*(?:\(([^{]+)\))?\s*{/
const AtRuleRE = /^@([\w]+)\s*([^{]+)(?<!\s)\s*{/

export {
    openTagRE,
    closeTagRE,
    DOMCommentRE,
    attributeMapRE,
    textRE1, textRE2,
    selectorRE,
    declarationMapRE,
    CSSDirectiveRE,
    AtRuleRE
}