

export function exec(target: string, extractor: RegExp): null | string[] {
    return extractor.exec(target)
}