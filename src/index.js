import { typeOf } from "./shared";
var handler = {
    get(target, key, receiver) {
        console.log('get');
        var value = target[key];
        switch (typeOf(value)) {
            case 'string':
                return value;
            case 'boolean':
                return value;
            case 'number':
                return value;
            case 'symbol':
                return value;
            case 'undefined':
                target[key] = undefined;
                return undefined;
            case 'null':
                return null;
            case 'object':
                return reactive(value);
            case 'array':
                console.log('track arr');
                return reactive(value);
            case 'function':
                return value;
            default:
                return new Error('!!!');
        }
    },
    set(target, key, newValue, receiver) {
        console.log('set');
        return target[key] = newValue;
    }
};
function reactive(target) {
    return new Proxy(target, handler);
}
function createApp() {
    return 1;
}
export { createApp };
