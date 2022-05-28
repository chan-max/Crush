
function mixin(...sources: [Record<string, any>]){
    return Object.assign(...sources)
}

export {
    mixin
}