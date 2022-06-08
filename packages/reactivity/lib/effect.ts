

export function track(...args: any[]) {
    console.warn('track', ...args);
}


export function trigger(...args: any[]) {
    console.warn('trigger', ...args);
}

let activeEffect: any = null
const activeEffectStack = []



class Effect {

    // 记录副作用依赖了那些变量
    deps = []

    fn: any

    constructor(fn: any) {
        this.fn = fn
    }

    run() {

        activeEffect = this
        activeEffectStack.push(this)
    }

}


// export const effect = (fn: any) => new Effect(fn)