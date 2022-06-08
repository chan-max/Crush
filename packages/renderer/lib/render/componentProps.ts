import { emptyObject, error, isUndefined } from "@crush/common";
import { isEvent } from "@crush/core";
import { createMapEntries, unionkeys } from "./common";


export function updateComponentProps(instance: any, pProps: any, nProps: any) {
    pProps ||= emptyObject
    nProps ||= emptyObject
    const { scope, propsOptions, emitsOptions } = instance
    // 在props都不存在的情况下也要处理默认值，必须值等情况，所以传入propsoptions进入循环
    for (let prop of unionkeys(pProps, nProps, propsOptions)) {
        let pValue = pProps[prop]
        let nValue = nProps[prop]

        if (prop.startsWith('_')) {
            // 组件保留属性
        } else if (isEvent(prop)) {
            // 暂时忽略组件事件的参数和修饰符
        } else {
            // normal props
            const { default: _default, type, validator, required } = propsOptions[prop]
            if (isUndefined(nValue)) {
                // nValue 不存在在时应该使用默认值
                if (required) {
                    error(`props ${prop} is required`)
                } else {
                    nValue = propsOptions[prop].default
                }
            }

            if (type && nValue.constructor !== type) {
                error(`prop ${nValue} is not the typeOf ${type.name}`)
            }

            if (validator && !validator(nValue)) {
                error(`prop ${nValue} is not legal for custom validator`)
            }

            // do update props value
            if (pValue !== nValue) {
                scope[prop] = nValue
            }
        }
    }
}


export const mountComponentProps = (instance: any, props: any) => updateComponentProps(instance, null, props)