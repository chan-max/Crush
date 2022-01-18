
const exec = (regExp: RegExp, target: string) => regExp.exec(target)
const trimS = (s: string, len: number = 0) => s.slice(len).trimStart()

export {
    exec,
    trimS
}