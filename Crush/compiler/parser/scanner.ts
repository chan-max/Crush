
function Scanner(source) {
    this.source = source
    this.move(0)
}

Scanner.prototype.move = function (step: number) {
    this.source = this.source.slice(step).trimLeft()
}

Scanner.prototype.extract = function (extractor: RegExp) {
    var res
    if (res = extractor.exec(this.source)) {
        var [{ length }, ...token] = res
        this.move(length)
        return token
    } else {
        return false
    }
}

Scanner.prototype.expect = function (expect, index = 0) {
    return this.source.slice(index, expect.length + index) === expect
}

const createScanner = (source) => new Scanner(source)

export {
    createScanner
}