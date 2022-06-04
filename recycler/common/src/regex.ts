import {
    error
} from './console'

const createRegex = () => {

}


/*
    use exec to extract the captureGroups 
*/
export const exec = (target: string, extractor: RegExp) => {
    var res = extractor.exec(target)
    if (res) {
        var [_, ...captureGroups] = res
        return captureGroups
    }
    return null
}
