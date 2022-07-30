

export function debounce(fn: Function, wait: number) {
    let timeoutId: any = null
    return () => {
        if (timeoutId !== null) {
            // 存在任务
            clearTimeout(timeoutId)
        }
        timeoutId = setTimeout(() => {
            fn()
            timeoutId = null
        }, wait);
    }
}



export function throttle(fn: any, wait: number) {
    // 确保第一次永远执行
    let lastTime: any = -wait
    return () => {
        console.log('th');
        if (Date.now() - lastTime >= wait) {
            fn()
            lastTime = Date.now()
        }
    }
}

// 如果在模板中使用防抖节流， 每次更新都会重新生成防抖截节流函数

const debounceCache = new WeakMap()

export function cacheDebounce(fn: any, wait: number) {
    let cached = debounceCache.get(fn)
    if (cached) {
        return cached
    } else {
        let debounceFn = debounce(fn, wait)
        debounceCache.set(fn, debounceFn)
        return debounceFn
    }
}


const throttleCache = new WeakMap()

export function cacheThrottle(fn: any, wait: number) {
    let cached = throttleCache.get(fn)
    if (cached) {
        return cached
    } else {
        let throttleFn = throttle(fn, wait)
        throttleCache.set(fn, throttleFn)
        return throttleFn
    }
}
