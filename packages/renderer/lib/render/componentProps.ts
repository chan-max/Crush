import { emptyObject, isUndefined } from "@crush/common";
import { getEventName, isComponentLifecycleHook, isEvent, parseEventName, parsePropertyName } from "@crush/core";
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
        switch (prop) {
            case 'ref':
                // ref component
                let refs = instance.parent.refs ||= {}
                if (nValue !== pValue) {
                    pValue && (refs[pValue] = null);
                    nValue && (refs[nValue] = instance);
                }
                break
            case 'class':
                break
            case 'style':
                break
            default:
                if (prop.startsWith('_')) {
                    if (prop.startsWith('_modelValue')) {
                        if (pValue !== nValue) {
                            // modelValue绑定的值变了，更新到作用域
                            let modelKey = prop.split('_is_')[1]
                            scope[modelKey] = nValue
                        }
                    }
                } else if (isEvent(prop)) {
                    var { event, _arguments, modifiers, filters } = parseEventName(prop)
                    if (emitsOptions[event]) {
                        updateInstanceListeners(instance, event, pValue, nValue, _arguments, modifiers, filters)
                    } else if (isComponentLifecycleHook(event)) {
                        continue
                    } else {
                        // attrs
                        let attrs = instance.attrs ||= {}
                        attrs[prop] = nValue
                    }
                } else {
                    // property

                    let { property, _arguments, modifiers, filters } = parsePropertyName(prop)
                    if (!propsOptions[property]) {
                        // attrs
                        let attrs = instance.attrs ||= {}
                        attrs[property] = nValue
                    } else {
                        // props
                        const { default: _default, type, validator, required, rename } = propsOptions[property]
                  
                        if (isUndefined(nValue)) {
                            // nValue 不存在在时应该使用默认值
                            if (required) {
                            } else {
                                nValue = _default
                            }
                        }

                        if (type && nValue.constructor !== type) {

                        }

                        if (validator && !validator(nValue)) {

                        }

                        // do update props value
                        scope[rename || property] = nValue;
                        (instance.props ||= {})[property] = nValue
                    }
                }
        }
    }
}


