function mark(target: Record<string, any>, name: string, value: any) {
        return Reflect.defineProperty(target, name, {
            writable: false,
            configurable: false,
            enumerable: false,
            value
        })
    }
    
    export {
        mark
    }