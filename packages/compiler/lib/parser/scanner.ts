import { error,exec  } from "@crush/common"

export const createScanner = (source: string) => new Scanner(source)

// operate the string template
class Scanner {
    source
    constructor(source: string) {
        this.source = source.trim()
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
        var res = exec(this.source, extractor) as string[]
        if (!res) {
            return null
        } else {
            var [_, ...groups] = res
            this.move(_.length)
            return groups
        }
    }
}