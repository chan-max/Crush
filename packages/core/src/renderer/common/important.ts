
export const IMPORTANT_SYMBOL = Symbol('important')

export const IMPORTANT_KEY = '!important'
export const IMPORTANT = 'important'

export const important = (value: any) => ({
    value,
    [IMPORTANT_SYMBOL]: true
})