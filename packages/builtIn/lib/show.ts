


function setDisplay(el: any, show: boolean) {
    if (show) {
        el.style.display = el._display
    } else {
        el.style.display = 'none'
    }
}

export const showDirective = {
    beforeMount(el: any, { value }: any, { transition }: any) {
        el._display = el.style.display
        setDisplay(el, value)
    },
    updated(el: Element, { value, oldValue }: any, n: any, p: any) {
        if (!value === !oldValue) {
            return
        }
        

    }
}