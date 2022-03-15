// compiler helper

class Scanner {
    constructor(source: string) {
        this.source = source
        this.move(0) // cut the space
    }
    source
    move(step: number) {
        this.source = this.source.slice(step).trimLeft()
    }
    expect(expect: string, index = 0) {
        return this.source.slice(index, expect.length + index) === expect
    }
    startsWith(expect: string) {
        // same as use expect without the second arg
        return this.source.startsWith(expect)
    }
    exec(
        extractor: RegExp,
    ) {
        var res = extractor.exec(this.source)
        if (!res) {
            return false as any
        } else {
            var [{ length }, ...token] = res as Iterable<string>
            this.move(length)
            return token
        }
    }
}

const createScanner = (source: string) => new Scanner(source)
export {
    createScanner
}