
export const IMPORTANT_SYMBOL = Symbol('Important')

export const IMPORTANT_KEY = '!important'
export const IMPORTANT = 'important'

export function important(value: any):any {
    return {
        value,
        [IMPORTANT_SYMBOL]: true
    }
}

