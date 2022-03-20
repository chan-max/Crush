import {
    throwError
} from './console'

const createRegex = () => {

}


/*
    use exec to extract the captureGroups 
*/
export const exec = (target: string, extractor: RegExp, resultIsRequired: boolean = true) => {
    var res = extractor.exec(target)
    if (res) {
        var [_, ...captureGroups] = res
        return captureGroups
    } else {
        if (resultIsRequired) {
            throwError(`
                failed to exec
            `)
        }
    }
    return null
}
