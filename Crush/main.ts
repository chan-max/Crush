/*-------------------------------------------------------*/
import { _createStyleRule } from "./core/vnode";



let list = [
    _createStyleRule('div',{
        color:'red',
        backgroundColor:'blue'
    })
]

function updateStyleSheet(style:HTMLStyleElement,ruleList:any){

}

var style:any = document.querySelector('#style') 



updateStyleSheet(style,list)