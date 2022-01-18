import { isUndefined } from "../dataType/dataType";

const cache = (fn: Function) => {
        const cache = Object.create(null);
        return ((str: string) => {
                const cached = cache[str];
                return isUndefined(cached) ? (cache[str] = fn(str)) : cached
        });
}

export {
        cache
}