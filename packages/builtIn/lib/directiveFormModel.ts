

// compiler required : 

import { addListener } from "@crush/renderer"

/*
    model types :
    checkbox
    color
    date
    rang
*/



export const modelText = {
    beforeUpdate(el: any, { value }: any,) {
        el.value = value;
    },
    created(el: any, { value }: any, vnode: any) {
        const setter = vnode.props._setter
        el.value = value;
        addListener(el, 'input', () => {
            setter(el.value)
        })
    }
}

export const modelRadio = {
    
}

export const modelCheckbox = {

}

export const modelSelect = {

}


export const modelColor = {
    created(el: any, binding: any, vnode: any) {
        debugger
    }
}