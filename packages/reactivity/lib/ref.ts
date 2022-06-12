import { ReactiveFlags } from "./common"
import { getActiveEffect, TARGET_MAP, track, TrackTypes, trigger, ReactiveEffect } from "./effect"

export const ref = (value: any) => new Ref(value)

class Ref {

    [ReactiveFlags.IS_REF] = true

    _value: any

    constructor(value: any) {
        this._value = value
    }

    get value() {
        // track
        trackRef(this)
        return this._value
    }

    set value(newValue) {
        if (this._value === newValue) {
            // sensitive 
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


