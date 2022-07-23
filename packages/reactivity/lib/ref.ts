import { emptyObject } from "@crush/common";
import { isProxyType, ReactiveFlags, ReactiveTypeSymbol } from "./common"
import { getActiveEffect, TARGET_MAP, track, trigger, ReactiveEffect, isEffect, getDeps } from "./effect"
import { reactive } from "./reactive";

export const ref = (value: any, options?: any) => new Ref(value, options)

export const createRefValueSetter = (ref: Ref) => (newValue: any) => ref.value = newValue


export class Ref {
    [ReactiveTypeSymbol] = true;
    [ReactiveFlags.IS_REF] = true

    oldValue: any // 保存旧值

    _value: any

    sensitive: any

    shallow: any

    constructor(value: any, options: any = emptyObject) {
        this.sensitive = options.sensitive
        this.shallow = options.shallow
        this._value = value
    }

    get value() {
        // track
        track(this)
        let value = this._value
        return (!this.shallow && isProxyType(value)) ? reactive(value) : value
    }

    set value(newValue) {
        // 当 sensitive ，为true时 ， 当值试图从一个值变为另一个相同的值时，即使基本类型或引用类型全等，也会视为一次改变，触发依赖
        if (this._value === newValue && !this.sensitive) {
            return
        }
        this.oldValue = this._value
        this._value = newValue
        // trigger
        trigger(this)
    }
}




// 清除所有与当前ref相关的依赖
export const cleaarRefDeps = (ref: Ref) => {
    getDeps(ref).clear()
}


