
function setProto(proto: any, target: any) {
    target.__proto__ = proto
    return target
}

const protoExtends = (...targets: any) => targets.reduce(setProto)

export {
    protoExtends
}
