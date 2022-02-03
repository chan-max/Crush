import { isUndefined } from "../dataType";

const cache = (fn: Function) => {
        const cache = Object.create(null);
        return ((key: string) => {
                const cached = cache[key];
                return isUndefined(cached) ? (cache[key] = fn(key)) : cached
        });
}

const useCache = (fn: Function) => {
        fn = cache(fn)
        return fn
}

export {
        cache
}