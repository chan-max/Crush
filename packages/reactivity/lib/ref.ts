import { emptyObject } from "@crush/common";
import { isProxyType, ReactiveFlags, ReactiveTypeSymbol } from "./common"
import { getActiveEffect, TARGET_MAP, track, trigger, ReactiveEffect, isEffect, getDeps } from "./effect"
import { reactive } from "./reactive";

export const ref = (value: any = null, options?: any) => new Ref(value, options)

export const createRefValueSetter = (ref: Ref) => (newValue: any) => ref.value = newValue

let defaultRefOptions = {
    sensitive: false,
    shallow: false,
    onSet: null,
    onGet: null
}

export class Ref {
    [ReactiveTypeSymbol] = true; // 标记为响应式数据
    [ReactiveFlags.IS_REF] = true // 标记为ref

    // 注册set和get的回调函数
    onSet: any
    onGet: any

    oldValue: any // 保存旧值

    _value: any // 保存当前值

    sensitive: any // 该属性为true时 , 当值设置为当前值时也会触发响应

    shallow: any  // 深层数据是否为响应式

    constructor(value: any, options: any = defaultRefOptions) {
        this.sensitive = options.sensitive
        this.shallow = options.shallow
        this.onSet = options.onSet
        this._value = value
    }

    get value() {
        // track
        if (this.onGet) {
            this.onGet()
        }

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
        if (this.onSet) {
            this.onSet()
        }
        // trigger
        trigger(this)
    }
}




// 清除所有与当前ref相关的依赖
export const cleaarRefDeps = (ref: Ref) => {
    getDeps(ref).clear()
}


