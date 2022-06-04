

export function exec(target: string, extractor: RegExp): null | string[] {
    return extractor.exec(target)
}

export function execCaptureGroups(target: string, extractor: RegExp) {
    var res = exec(target, extractor)
    if (!res) {
        return null
    } else {
        var [_, ...captureGroups] = res
        return captureGroups
    }
}