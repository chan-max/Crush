
const cache = (fn: Function) => {
    const cache = Object.create(null);
    return ((key: string) => {
        const cached = cache[key];
        return cached === undefined ? (cache[key] = fn(key)) : cached
    });
}


export {
    cache,
}