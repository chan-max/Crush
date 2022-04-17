

export var nextTick = (fn: Function, args = undefined) => {
    var p = Promise.resolve(args)
    p.then(fn.bind(null))
}