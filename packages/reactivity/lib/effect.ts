
var observeMap = new WeakMap()

export function track(...args: any[]) {
    console.warn('track',...args);
}


export function trigger(...args: any[]) {
    console.warn('trigger',...args);
}