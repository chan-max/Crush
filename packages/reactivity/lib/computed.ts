import { ReactiveFlags, ReactiveTypeSymbol } from "./common"
import { createReactiveEffect } from "./effect";
import { trackRef, triggerRef } from "./ref";

export const computed = (getter: any) => new ComputedRef(getter)

class ComputedRef {
    [ReactiveTypeSymbol] = true;
    [ReactiveFlags.IS_COMPUTED] = true;
    [ReactiveFlags.IS_REF] = true

    cacheValue: any

    shouldCompute = true

    computedEffect: any

    constructor(getter: any) {
        this.computedEffect = createReactiveEffect(getter, () => {
            // 依赖的值变化后，触发调度器 , 一个computed依赖的副作用就是它所依赖的值的副作用
            if (!this.shouldCompute) { // 缓存值
                this.shouldCompute = true
                triggerRef(this)
            }
        })
    }

    get computedValue() {
        this.shouldCompute = false
        return this.cacheValue = this.computedEffect.run()
    }

    get value() {
        trackRef(this)
        return this.shouldCompute ? this.computedValue : this.cacheValue
    }
}