var nextTick = (fn, args = undefined) => {
    var p = Promise.resolve(args)
    p.then(fn.bind(null))
}


export {
    nextTick
}