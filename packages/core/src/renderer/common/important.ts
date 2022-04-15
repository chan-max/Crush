
export const IMPORTANT_SYMBOL = Symbol('important')

export const IMPORTANT_KEY = '!important'
export const IMPORTANT = 'important'

export function important(value: any) {
    return {
        value,
        [IMPORTANT_SYMBOL]: true
    }
}