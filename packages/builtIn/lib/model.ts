
import { isArray, isUndefined, removeFromArray, toNumber } from "@crush/common";
import { addListener } from "@crush/renderer"

import { debounce, isNumber, } from '@crush/common'
import { hexToHsl, hexToRgb, isRef, normalizeToHexColor } from "@crush/reactivity";


export const modelText = {
    created(el: any, { value, modifiers }: any, vnode: any) {
        const { lazy, number, trim, debounce: useDebounce } = modifiers
        const setter = vnode.props._setModelValue
        el._modelValue = value
        // 设置input初始值
        let initalValue = isRef(value) ? value.value : value
        el.value = isUndefined(initalValue) ? '' : initalValue;

        let inputHandler = () => {
            let inputValue = el.value
            // number 和 trim 不能同时使用 , 空字符串转数字会变为0
            inputValue = inputValue === '' ? '' : number ? toNumber(inputValue) : trim ? inputValue.trim() : inputValue
            // 标记输入框刚刚输入完毕
            el._inputing = true
            if (isRef(el.modelValue)) {
                el.modelValue.value = inputValue
            } else {
                setter(inputValue)
            }
        }

        if (useDebounce) {
            let debounceNextModifier = modifiers[modifiers.indexOf('debounce') + 1]
            let numberValue = toNumber(debounceNextModifier)
            // 如果是合理地数字
            let wait = isNumber(numberValue) ? numberValue : 100
            inputHandler = debounce(inputHandler, wait)
        }

        addListener(el, lazy ? 'change' : 'input', inputHandler)
    },
    beforeUpdate(el: any, { value }: any) {
        // 由输入框输入引发的更新，不会重新设置输入框的值
        if (el._inputing) {
            el._inputing = false
        } else {
            el._modelValue = el.value
            let newValue = isRef(value) ? value.value : value
            el.value = isUndefined(newValue) ? '' : newValue;
        }
    }
}



// 多个相同name的input同时出现
export const modelRadio = {
    created(el: any, { value }: any, { props: { _setModelValue } }: any) {
        if (el.value === value) {
            el.checked = true
        }
        addListener(el, 'change', () => {
            _setModelValue(el.value)
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
    created(el: any, { value: checked }: any, vnode: any) {
        if (!isArray(checked)) {
            return
        }
        // 设置初始化值
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
    childrenMounted(el: any, { value }: any, { props: { _setModelValue } }: any) {
        let options = el.options
        for (let option of options) {
            // options 默认第一个为选中的
            option.selected = option.value === value
        }
        addListener(el, 'change', () => {
            _setModelValue(el.value)
        })
    },
    beforeUpdate(el: any, { value }: any) {
        if (value !== el.value) {
            el.value = value
        }
    }
}

export const modelSelectMultiple = {
    childrenMounted(el: any, { value }: any, { props: { _setModelValue } }: any) {
        if (!isArray(value)) {
            return
        }
        let options = el.options
        for (let option of options) {
            // options 默认第一个为选中的 , 初始化选中状态
            option.selected = value.includes(option.value)
        }
        addListener(el, 'change', () => {
            _setModelValue(getSelectedValue(el))
        })
    },
    beforeUpdate(el: any, { value }: any) {
        setSelectState(el, value)
    }
}


// 目前只支持 16 进制
export const modelColor = {
    created(el: any, { value, modifiers: { lazy, rgb, hsl, } }: any, vnode: any) {
        el._mdelValue = value
        const setter = vnode.props._setModelValue
        // 设置初始值
        el.value = normalizeToHexColor(isRef(value) ? value.value : value);
        addListener(el, lazy ? 'change' : 'input', () => {
            el._inputing = true
            let colorValue = rgb ? hexToRgb(el.value) : hsl ? hexToHsl(el.value) : el.value
            isRef(el._mdelValue) ? el._mdelValue.value = colorValue : setter(colorValue)
        })
    },
    beforeUpdate(el: any, { value }: any,) {
        if (el._inputing) {
            el._inputing = false
        } else {
            el._mdelValue = value
            el.value = normalizeToHexColor(isRef(value) ? value.value : value)
        }
    }
}



export const modelRange = {
    created(el: HTMLInputElement, { value, modifiers: { lazy } }: any, { props: { _setModelValue } }: any) {
        el.value = isRef(value) ? value.value : value
        addListener(el, lazy ? 'change' : 'input', () => {
            if (isRef(value)) {
                value.value = el.value
            } else {
                _setModelValue(el.value)
            }
        })
    },
    beforeUpdate(el: HTMLInputElement, { value }: any) {
        el.value = isRef(value) ? value.value : value
    }
}