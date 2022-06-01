


function setDisplay(el: any, show: boolean) {
    if (show) {
        el.style.display = el._display
    } else {
        el.style.display = 'none'
    }
}

export const show = {
    beforeMount(el: any, { value }: any) {
        el._display = el.style.display
        setDisplay(el, value)
    },
    updated(el: Element, { value, oldValue }: any) {
        if (!value !== !oldValue) {
            setDisplay(el, value)
        }
    }
}