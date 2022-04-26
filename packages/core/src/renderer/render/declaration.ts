import {
    isString
} from '@crush/common'
import {
    IMPORTANT_SYMBOL,
    IMPORTANT_KEY
} from '../common/important'

export function getDeclarationValue(rawValue: any) {
    var value, important
    if (rawValue[IMPORTANT_SYMBOL]) {
        value = rawValue.value
        important = true
    } else {
        value = rawValue
        important = false
    }
    if (isString(value) && value.endsWith(IMPORTANT_KEY)) {
        value = value.split(IMPORTANT_KEY)[0].trim()
        important = true
    }
    return {
        value,
        important
    }
}