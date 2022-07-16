import { emptyObject, error, isUndefined } from "@crush/common";
import { getEventName, isEvent, parseEventName } from "@crush/core";
import { unionkeys } from "./common";
import { updateInstanceListeners } from "./componentListener";

export const mountComponentProps = (instance: any, props: any) => updateComponentProps(instance, null, props)

export function updateComponentProps(instance: any, pProps: any, nProps: any) {
    pProps ||= emptyObject
    nProps ||= emptyObject
    const { scope, propsOptions, emitsOptions } = instance

    // 在props都不存在的情况下也要处理默认值，必须值等情况，所以传入propsoptions进入循环
    for (let prop of unionkeys(pProps, nProps, propsOptions, emitsOptions)) {
        let pValue = pProps[prop]
        let nValue = nProps[prop]
        if (prop.startsWith('_')) {
            // 组件保留属性 skip
        } else if (prop === 'ref') {
            // ref component
            let refs = instance.parent.refs ||= {}
            if (nValue !== pValue) {
                pValue && (refs[pValue] = null);
                nValue && (refs[nValue] = instance);
            }
        } else if (!propsOptions[prop] || (isEvent(prop) && !emitsOptions[getEventName(prop)])) {
            // 未定义
            let attrs = instance.attrs ||= {}
            attrs[prop] = nValue
        } else if (isEvent(prop)) {
            // events
            var {
                event,
                _arguments,
                modifiers
            } = parseEventName(prop)
            updateInstanceListeners(instance, event, pValue, nValue)
        } else {
            // props
            const { default: _default, type, validator, required } = propsOptions[prop]
            if (isUndefined(nValue)) {
                // nValue 不存在在时应该使用默认值
                if (required) {
                    error(`props ${prop} is required`)
                } else {
                    nValue = _default
                }
            }

            if (type && nValue.constructor !== type) {
                error(`prop ${nValue} is not the typeOf ${type.name}`)
            }

            if (validator && !validator(nValue)) {
                error(`prop ${nValue} is not legal for custom validator`)
            }

            // do update props value
            scope[prop] = nValue
        }
    }
}


