

// compiler required : 

import { isArray, removeFromArray, toNumber } from "@crush/common";
import { addListener } from "@crush/renderer"


export const modelText = {
    created(el: any, { value, modifiers: { lazy, number, trim } }: any, vnode: any) {
        const setter = vnode.props._setter
        // 设置input初始值
        el.value = value;
        addListener(el, lazy ? 'change' : 'input', () => {
            let inputValue = el.value
            // number 和 trim 不能同时使用
            inputValue = inputValue === '' ? '' : number ? toNumber(inputValue) : trim ? inputValue.trim() : inputValue

            // 标记输入框刚刚输入完毕
            el._inputing = true
            setter(inputValue)
        })
    },
    beforeUpdate(el: any, { value }: any) {
        // 由输入框输入引发的更新，不会重新设置输入框的值
        if (el._inputing) {
            el._inputing = false
        } else {
            el.value = value;
        }
    }
}

// 多个相同name的input同时出现
export const modelRadio = {
    created(el: any, { value }: any, { props: { _setter } }: any) {
        if (el.value === value) {
            el.checked = true
        }
        addListener(el, 'change', () => {
            _setter(el.value)
        })
    },
    // data to input
    beforeUpdate(el: any, { value }: any) {
        if (el.value === String(value)) {
            el.checked = true
        } else {
            el.checked = false
        }
    }
}



// modelcheckbox dont need setter
export const modelCheckbox = {
    created(el: any, { value: checked }: any) {
        if (!isArray(checked)) {
            return
        }
        if (checked.includes(el.value)) {
            el.checked = true
        }
        addListener(el, 'change', () => {
            if (el.checked) {
                checked.push(el.value)
            } else {
                removeFromArray(checked, el.value)
            }
        })
    },
    // 数据改变更新视图
    beforeUpdate(el: any, { value }: any) {
        el.checked = value.includes(el.value)
    }
}



function getSelectedValue(selectEl: any) {
    let selected = []
    for (let option of selectEl.options) {
        if (option.selected) {
            selected.push(option.value)
        }
    }
    return selected
}

function setSelectState(selectEl: any, selected: any) {
    for (let option of selectEl.options) {
        option.selected = selected.includes(option.value)
    }
}


export const modelSelectOne = {
    childrenMounted(el: any, { value }: any, { props: { _setter } }: any) {
        let options = el.options
        for (let option of options) {
            // options 默认第一个为选中的
            option.selected = option.value === value
        }
        addListener(el, 'change', () => {
            _setter(el.value)
        })
    },
    beforeUpdate(el: any, { value }: any) {
        if (value !== el.value) {
            el.value = value
        }
    }
}

export const modelSelectMultiple = {
    childrenMounted(el: any, { value }: any, { props: { _setter } }: any) {
        if (!isArray(value)) {
            return
        }
        let options = el.options
        for (let option of options) {
            // options 默认第一个为选中的 , 初始化选中状态
            option.selected = value.includes(option.value)
        }
        addListener(el, 'change', () => {
            _setter(getSelectedValue(el))
        })
    },
    beforeUpdate(el: any, { value }: any) {
        setSelectState(el, value)
    }
}


// 目前只支持 16 进制
export const modelColor = {
    created(el: any, { value }: any, vnode: any) {
        const setter = vnode.props._setter
        el.value = value;
        addListener(el, 'input', () => {
            setter(el.value)
        })
    },
    beforeUpdate(el: any, { value }: any,) {
        el.value = value;
    },
}

export const modelRange = {
    created(el: HTMLInputElement, { value }: any, { props: { _setter } }: any) {
        el.value = value
        addListener(el, 'input', () => {
            _setter(el.value)
        })
    },
    beforeUpdate(el: HTMLInputElement, { value }: any) {
        el.value = value
    }
}