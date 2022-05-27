import { error } from "../../common/console"
import { exec } from "../../common/regexp"

export const createScanner = (source: string) => new Scanner(source)

// operate the string template
class Scanner {
    source
    constructor(source: string) {
        this.source = source
        this.move(0)
    }
    move(step: number) {
        this.source = this.source.slice(step).trimLeft()
    }
    at(index: number) {
        return this.source[index]
    }
    expect(expect: string, index = 0) {
        return this.source.slice(index, expect.length + index) === expect
    }
    startsWith(expect: any) {
        // same as use expect without the second arg
        return this.source.startsWith(expect)
    }
    exec(extractor: RegExp,) {
        var [_, ...groups] = exec(this.source, extractor) as string[]
        this.move(_.length)
        return groups
    }
}