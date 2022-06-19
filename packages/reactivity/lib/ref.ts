import { emptyObject } from "@crush/common";
import { ReactiveFlags, ReactiveTypeSymbol } from "./common"
import { getActiveEffect, TARGET_MAP, track, TrackTypes, trigger, ReactiveEffect } from "./effect"

export const ref = (value: any, options?: any) => new Ref(value, options)

export class Ref {
    [ReactiveTypeSymbol] = true;
    [ReactiveFlags.IS_REF] = true

    _value: any

    sensitive: any

    constructor(value: any, options: any = emptyObject) {
        this.sensitive = options.sensitive
        this._value = value
    }

    get value() {
        // track
        trackRef(this)
        return this._value
    }

    set value(newValue) {
        // 当 sensitive ，为true时 ， 当值试图从一个值变为另一个相同的值时，即使基本类型或引用类型全等，也会视为一次改变，触发依赖
        if (this._value === newValue && !this.sensitive) {
            return
        }

        this._value = newValue
        // trigger
        triggerRef(this)
    }
}


export function trackRef(ref: any) {
    var activeEffect = getActiveEffect()
    if (!activeEffect) {
        return
    }

    var deps = TARGET_MAP.get(ref)
    if (!deps) {
        deps = new Set()
        TARGET_MAP.set(ref, deps)
    }
    deps.add(activeEffect)
}

export function triggerRef(ref: any) {
    var deps = TARGET_MAP.get(ref)
    if (!deps) {
        return
    }
    deps.forEach((effect: ReactiveEffect) => effect.triggerRun())
}


