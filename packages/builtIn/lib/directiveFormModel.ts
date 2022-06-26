

// compiler required : 

/*
    model types :
    checkbox
    color
    date
    rang
*/

export const model = {
}



export const modelText = {
    created(el: any, _: any, vnode: any) {
        const changeModelValue = vnode.props._changeModelValue
        el.addListener('input', () => {
            changeModelValue(el.value)
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

}